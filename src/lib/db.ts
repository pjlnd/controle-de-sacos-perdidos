import { promises as fs } from 'fs';
import path from 'path';
import { CARROSSEIS } from './carrosseis';
import type { BancoSacos, CarrosselId, NovoSacoInput, SacoDados, SacoFlat, StatusSaco } from './types';

// Em produção "serverless" (ex.: Vercel) o sistema de arquivos do projeto é
// somente leitura fora de /tmp, e /tmp é apagado a cada nova instância da
// função. Ou seja, nesse tipo de hospedagem os dados NÃO persistem entre
// deploys/instâncias frias. Para persistência de verdade, rode o Dockerfile
// deste projeto em um host com disco (Railway, Render, um VPS, etc.) e monte
// um volume em /app/data, ou troque este arquivo por um banco de dados real.
const DATA_DIR =
  process.env.VERCEL === '1' ? '/tmp' : path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'sacos.json');
const SEED_FILE = path.join(process.cwd(), 'data', 'sacos.json');

const TOTAL_CARROSSEIS = 13; // C01 até C13

export function carrosselKey(n: number): CarrosselId {
  return `C${String(n).padStart(2, '0')}`;
}

let writeQueue: Promise<unknown> = Promise.resolve();

function bancoVazio(): BancoSacos {
  const banco: BancoSacos = {};
  for (const c of CARROSSEIS) {
    banco[c] = { sacos: {} };
  }
  return banco;
}

/** Garante que todos os carrosséis C01..C13 existam no banco, mesmo que o
 *  arquivo em disco tenha sido criado antes de algum carrossel ser adicionado. */
function normalizarBanco(banco: BancoSacos): BancoSacos {
  for (const c of CARROSSEIS) {
    if (!banco[c]) banco[c] = { sacos: {} };
    if (!banco[c].sacos) banco[c].sacos = {};
  }
  return banco;
}

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    // Se ainda não existe (ex.: primeira execução em /tmp na Vercel),
    // parte da seed versionada no repositório, ou de um banco vazio.
    let seed: string | null = null;
    try {
      seed = await fs.readFile(SEED_FILE, 'utf-8');
    } catch {
      // sem seed disponível
    }
    const banco = seed ? normalizarBanco(JSON.parse(seed)) : bancoVazio();
    await fs.writeFile(DATA_FILE, JSON.stringify(banco, null, 2), 'utf-8');
  }
}

async function lerBanco(): Promise<BancoSacos> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  try {
    return normalizarBanco(JSON.parse(raw) as BancoSacos);
  } catch {
    return bancoVazio();
  }
}

async function escreverBanco(banco: BancoSacos): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(banco, null, 2), 'utf-8');
}

/** Achata o banco (agrupado por carrossel) numa lista única para o front-end. */
function paraLista(banco: BancoSacos): SacoFlat[] {
  const lista: SacoFlat[] = [];
  for (const carrossel of Object.keys(banco)) {
    const sacos = banco[carrossel]?.sacos ?? {};
    for (const localIdStr of Object.keys(sacos)) {
      lista.push({
        ...sacos[localIdStr],
        id: `${carrossel}-${localIdStr}`,
        carrossel,
        localId: Number(localIdStr),
      });
    }
  }
  // Mais recentes primeiro
  lista.sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1));
  return lista;
}

function parseId(id: string): { carrossel: CarrosselId; localIdStr: string } | null {
  const idx = id.lastIndexOf('-');
  if (idx === -1) return null;
  return { carrossel: id.slice(0, idx), localIdStr: id.slice(idx + 1) };
}

// Enfileira as escritas para que duas requisições concorrentes não
// sobrescrevam uma a outra (corrida clássica de leitura-modificação-escrita
// em arquivo JSON).
function enfileirar<T>(tarefa: () => Promise<T>): Promise<T> {
  const execucao = writeQueue.then(tarefa, tarefa);
  writeQueue = execucao.catch(() => undefined);
  return execucao;
}

export function lerSacos(): Promise<SacoFlat[]> {
  return lerBanco().then(paraLista);
}

export function salvarNovoSaco(input: NovoSacoInput): Promise<SacoFlat[]> {
  return enfileirar(async () => {
    const banco = await lerBanco();
    const bucket = banco[input.carrossel] ?? { sacos: {} };

    const idsExistentes = Object.keys(bucket.sacos).map(Number).filter((n) => !Number.isNaN(n));
    const proximoId = idsExistentes.length > 0 ? Math.max(...idsExistentes) + 1 : 1;

    const novoSaco: SacoDados = {
      numero: input.numero,
      artigo: input.artigo.toUpperCase(),
      cor: input.cor.toUpperCase(),
      tamanho: input.tamanho,
      turno: input.turno,
      data: input.data,
      retiradoPeloSistema: input.retiradoPeloSistema,
      ...(input.retiradoPeloSistema
        ? {}
        : { armazem: input.armazem, prateleira: input.prateleira }),
      motivo: 'Não encontrado',
      status: 'perdido',
      criadoEm: new Date().toISOString(),
    };

    bucket.sacos[String(proximoId)] = novoSaco;
    banco[input.carrossel] = bucket;

    await escreverBanco(banco);
    return paraLista(banco);
  });
}

export function atualizarStatusSaco(
  id: string,
  status: StatusSaco
): Promise<SacoFlat[] | null> {
  return enfileirar(async () => {
    const banco = await lerBanco();
    const partes = parseId(id);
    if (!partes) return null;

    const bucket = banco[partes.carrossel];
    const saco = bucket?.sacos?.[partes.localIdStr];
    if (!bucket || !saco) return null;

    bucket.sacos[partes.localIdStr] = {
      ...saco,
      status,
      encontradoEm: status === 'encontrado' ? new Date().toISOString() : undefined,
    };

    await escreverBanco(banco);
    return paraLista(banco);
  });
}

export function excluirSaco(
  id: string
): Promise<SacoFlat[] | null> {
  return enfileirar(async () => {
    const banco = await lerBanco();
    const partes = parseId(id);
    if (!partes) return null;

    const bucket = banco[partes.carrossel];
    if (!bucket || !bucket.sacos[partes.localIdStr]) return null;

    delete bucket.sacos[partes.localIdStr];

    await escreverBanco(banco);
    return paraLista(banco);
  });
}
