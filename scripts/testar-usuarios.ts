import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  console.log('URI carregada?', Boolean(process.env.MONGODB_URI));

  const {
    listarUsuarios,
    criarUsuario,
    editarNomeUsuario,
    alternarStatusUsuario,
    mudarTipoUsuario,
    buscarUsuarioPorMatricula,
  } = await import('../src/lib/usuarios');

  console.log('--- 1. Criando um usuário admin de teste ---');
  await criarUsuario({ matricula: '999999999', nome: 'Admin de Teste', tipo: 'admin' });
  console.log('Criado com sucesso.\n');

  console.log('--- 2. Listando todos os usuários ---');
  console.log(await listarUsuarios());

  console.log('\n--- 3. Buscando por matrícula ---');
  console.log(await buscarUsuarioPorMatricula('999999999'));

  console.log('\n--- 4. Editando o nome ---');
  const usuarios = await listarUsuarios();
  const id = usuarios[0].id;
  await editarNomeUsuario(id, 'Admin Renomeado');
  console.log('Nome editado. Lista atualizada:');
  console.log(await listarUsuarios());

  console.log('\n--- 5. Tentando desativar o único admin (deve dar erro) ---');
  try {
    await alternarStatusUsuario(id, 'inativo');
    console.log('ERRO: isso não deveria ter funcionado!');
  } catch (e) {
    console.log('Bloqueado como esperado:', (e as Error).message);
  }

  console.log('\n--- 6. Mudando o tipo pra operário (deve dar erro, mesmo motivo) ---');
  try {
    await mudarTipoUsuario(id, 'operario');
    console.log('ERRO: isso não deveria ter funcionado!');
  } catch (e) {
    console.log('Bloqueado como esperado:', (e as Error).message);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error('Erro inesperado:', e);
  process.exit(1);
});