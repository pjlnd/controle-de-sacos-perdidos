import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import type { NovoSacoInput, SacoDados, SacoFlat, StatusSaco } from './types';

const NOME_BANCO = 'registro_sacos';
const NOME_COLECAO = 'sacos';

async function colecaoSacos() {
  const client = await clientPromise;
  return client.db(NOME_BANCO).collection<SacoDados>(NOME_COLECAO);
}

// Documento como vem do Mongo (com _id) -> formato usado no front-end (com id string)
function paraSacoFlat(doc: SacoDados & { _id: ObjectId }): SacoFlat {
  const { _id, ...resto } = doc;
  return { ...resto, id: _id.toString() };
}

export async function lerSacos(): Promise<SacoFlat[]> {
  const colecao = await colecaoSacos();
  const docs = await colecao.find().sort({ criadoEm: -1 }).toArray();
  return docs.map((d) => paraSacoFlat(d as SacoDados & { _id: ObjectId }));
}

export async function salvarNovoSaco(input: NovoSacoInput): Promise<SacoFlat[]> {
  const colecao = await colecaoSacos();

  const novoSaco: SacoDados = {
    numero: input.numero,
    artigo: input.artigo.toUpperCase(),
    cor: input.cor.toUpperCase(),
    tamanho: input.tamanho,
    turno: input.turno,
    data: input.data,
    carrossel: input.carrossel,
    retiradoPeloSistema: input.retiradoPeloSistema,
    ...(input.retiradoPeloSistema
      ? {}
      : { armazem: input.armazem, prateleira: input.prateleira }),
    motivo: 'Não encontrado',
    status: 'perdido',
    criadoEm: new Date().toISOString(),
  };

  await colecao.insertOne(novoSaco);
  return lerSacos();
}

export async function atualizarStatusSaco(
  id: string,
  status: StatusSaco
): Promise<SacoFlat[] | null> {
  if (!ObjectId.isValid(id)) return null;
  const colecao = await colecaoSacos();

  const resultado = await colecao.updateOne(
    { _id: new ObjectId(id) },
    status === 'encontrado'
      ? { $set: { status, encontradoEm: new Date().toISOString() } }
      : { $set: { status }, $unset: { encontradoEm: '' } }
  );

  if (resultado.matchedCount === 0) return null;
  return lerSacos();
}

export async function excluirSaco(id: string): Promise<SacoFlat[] | null> {
  if (!ObjectId.isValid(id)) return null;
  const colecao = await colecaoSacos();

  const resultado = await colecao.deleteOne({ _id: new ObjectId(id) });
  if (resultado.deletedCount === 0) return null;

  return lerSacos();
}