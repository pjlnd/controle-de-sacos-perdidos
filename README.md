# Registro de Sacos Perdidos

Sistema para registrar e acompanhar sacos perdidos no armazém, com duas telas
(Perdidos / Encontrados), persistência em arquivo JSON e atualização
automática na tela (a cada 3s) sem precisar dar refresh.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` (redireciona para `/perdidos`).

Os dados ficam em `data/sacos.json`. Já vem com 2 registros de exemplo (um
perdido, um encontrado) só para demonstração.

### Formato do JSON

O arquivo é organizado por carrossel (chaves `C01` até `C13`), e dentro de
cada carrossel os sacos ficam num objeto indexado por um id numérico que
**reinicia a contagem em cada carrossel** (o primeiro saco de qualquer
carrossel é sempre `"1"`):

```json
{
  "C01": {
    "sacos": {
      "1": {
        "numero": "104582",
        "artigo": "A2231B",
        "cor": "AZ01",
        "tamanho": "42",
        "turno": "1",
        "data": "2026-07-22",
        "armazem": "2",
        "prateleira": "14",
        "motivo": "Não encontrado",
        "status": "perdido",
        "criadoEm": "2026-07-22T09:12:00.000Z"
      }
    }
  },
  "C02": { "sacos": {} }
}
```

Para a tela funcionar (filtrar/ordenar sacos de carrosséis diferentes juntos),
o back-end (`src/lib/db.ts`) "achata" isso numa lista antes de responder pela
API — cada saco ganha um `id` composto tipo `"C01-1"` só para ter uma chave
única na tela, mas o que fica salvo em disco é sempre a estrutura acima.

## Rodando com Docker

```bash
docker build -t registro-sacos .
docker run -p 3000:3000 registro-sacos
```

## ⚠️ Importante sobre o deploy na Vercel

Você pediu para subir isso na Vercel usando o Dockerfile, mas vale alinhar
uma coisa: **a Vercel não roda o Dockerfile** — ela faz o build do Next.js
diretamente a partir do repositório (o Dockerfile serve para você rodar isso
em outro lugar, tipo um VPS, Railway, Render, Fly.io etc.).

Além disso, mesmo fazendo o deploy direto do Next.js na Vercel (sem Docker),
as funções serverless da Vercel têm sistema de arquivos **somente leitura**,
exceto a pasta `/tmp`, que é apagada sempre que a instância "esfria". Ou
seja, nesse tipo de hospedagem:

- Os registros **não persistem entre deploys**.
- Em produção, instâncias diferentes da função podem não enxergar os
  mesmos dados (cada uma tem seu próprio `/tmp`).
- Funciona bem para demonstração/protótipo, mas não é confiável para uso
  real da empresa.

Duas opções, dependendo do que você quer agora:

1. **Só para demonstrar na Vercel**: pode subir do jeito que está. O app já
   detecta `process.env.VERCEL` e usa `/tmp/sacos.json`, então funciona
   durante a sessão, só não é definitivo.
2. **Para usar de verdade com JSON em arquivo**: rode com o Dockerfile em um
   host com disco persistente (um volume montado em `/app/data`), como
   Railway, Render ou um VPS simples.

Quando quiser trocar para o banco de dados da empresa, o único lugar que
precisa mudar é `src/lib/db.ts` — todo o resto (telas, API routes) já fala
com essas 3 funções (`lerSacos`, `salvarNovoSaco`, `atualizarStatusSaco`) e
não precisa ser alterado.

## Estrutura

- `src/app/perdidos` — tela de registro/listagem de sacos perdidos
- `src/app/encontrados` — tela de sacos já encontrados
- `src/app/api/sacos` — API (GET lista / POST cria)
- `src/app/api/sacos/[id]` — API (PATCH muda status para "encontrado")
- `src/lib/db.ts` — camada de persistência em JSON (trocar aqui para banco de dados)
- `src/hooks/useSacos.ts` — busca os dados a cada 3s (efeito de tempo real) e
  faz atualização otimista ao marcar como encontrado
- `data/sacos.json` — arquivo de dados (seed inicial com 2 registros)

## Validações dos campos

- Número do saco: exatamente 6 dígitos
- Artigo / Cor: apenas letras maiúsculas e números
- Tamanho: numérico
- Turno: 1, 2 ou 3
- Carrossel: 1 a 12
- Motivo: fixo em "Não encontrado"
