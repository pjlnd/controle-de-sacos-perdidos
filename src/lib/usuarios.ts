import { ObjectId, Collection } from 'mongodb';
import clientPromise from './mongodb';
import type {
  NovoUsuarioInput,
  StatusUsuario,
  TipoUsuario,
  UsuarioDados,
  UsuarioFlat,
} from './types';

const NOME_BANCO = 'registro_sacos';
const NOME_COLECAO = 'usuarios';

async function colecaoUsuarios(): Promise<Collection<UsuarioDados>> {
  const client = await clientPromise;
  return client.db(NOME_BANCO).collection<UsuarioDados>(NOME_COLECAO);
}

function paraUsuarioFlat(doc: UsuarioDados & { _id: ObjectId }): UsuarioFlat {
  const { _id, ...resto } = doc;
  return { ...resto, id: _id.toString() };
}

async function contarAdminsAtivos(colecao: Collection<UsuarioDados>): Promise<number> {
  return colecao.countDocuments({ tipo: 'admin', status: 'ativo' });
}

export async function listarUsuarios(): Promise<UsuarioFlat[]> {
  const colecao = await colecaoUsuarios();
  const docs = await colecao.find().sort({ criadoEm: -1 }).toArray();
  return docs.map((d) => paraUsuarioFlat(d as UsuarioDados & { _id: ObjectId }));
}

export async function buscarUsuarioPorMatricula(matricula: string): Promise<UsuarioFlat | null> {
  const colecao = await colecaoUsuarios();
  const doc = await colecao.findOne({ matricula });
  return doc ? paraUsuarioFlat(doc as UsuarioDados & { _id: ObjectId }) : null;
}

export async function criarUsuario(input: NovoUsuarioInput): Promise<UsuarioFlat[]> {
  const colecao = await colecaoUsuarios();

  const existente = await colecao.findOne({ matricula: input.matricula });
  if (existente) {
    throw new Error('Já existe um usuário cadastrado com essa matrícula.');
  }

  const novoUsuario: UsuarioDados = {
    matricula: input.matricula,
    nome: input.nome,
    tipo: input.tipo,
    status: 'ativo',
    criadoEm: new Date().toISOString(),
  };

  await colecao.insertOne(novoUsuario);
  return listarUsuarios();
}

export async function editarNomeUsuario(id: string, nome: string): Promise<UsuarioFlat[] | null> {
  if (!ObjectId.isValid(id)) return null;
  const colecao = await colecaoUsuarios();

  const resultado = await colecao.updateOne({ _id: new ObjectId(id) }, { $set: { nome } });
  if (resultado.matchedCount === 0) return null;
  return listarUsuarios();
}

export async function alternarStatusUsuario(
  id: string,
  status: StatusUsuario
): Promise<UsuarioFlat[] | null> {
  if (!ObjectId.isValid(id)) return null;
  const colecao = await colecaoUsuarios();

  const usuario = await colecao.findOne({ _id: new ObjectId(id) });
  if (!usuario) return null;

  if (status === 'inativo' && usuario.tipo === 'admin' && usuario.status === 'ativo') {
    const totalAdminsAtivos = await contarAdminsAtivos(colecao);
    if (totalAdminsAtivos <= 1) {
      throw new Error('Não é possível desativar o último administrador ativo do sistema.');
    }
  }

  const resultado = await colecao.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  if (resultado.matchedCount === 0) return null;
  return listarUsuarios();
}

export async function mudarTipoUsuario(
  id: string,
  tipo: TipoUsuario
): Promise<UsuarioFlat[] | null> {
  if (!ObjectId.isValid(id)) return null;
  const colecao = await colecaoUsuarios();

  const usuario = await colecao.findOne({ _id: new ObjectId(id) });
  if (!usuario) return null;

  if (tipo === 'operario' && usuario.tipo === 'admin' && usuario.status === 'ativo') {
    const totalAdminsAtivos = await contarAdminsAtivos(colecao);
    if (totalAdminsAtivos <= 1) {
      throw new Error('Não é possível rebaixar o último administrador ativo do sistema.');
    }
  }

  const resultado = await colecao.updateOne({ _id: new ObjectId(id) }, { $set: { tipo } });
  if (resultado.matchedCount === 0) return null;
  return listarUsuarios();
}