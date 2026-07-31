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
