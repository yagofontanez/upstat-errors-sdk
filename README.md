# upstat-js

SDK de error tracking e monitoramento de logs para Node.js. Captura erros automaticamente e envia para o [UpStat](https://upstat.online).

## Instalacao

```bash
npm install upstat-js
```

## Quick Start

```js
const { UpStat } = require("upstat-js");

UpStat.listen({
  token: "ups_seutoken",
});
```

Pronto. A partir disso o SDK captura automaticamente:

- `uncaughtException` — excecoes nao tratadas
- `unhandledRejection` — promises rejeitadas sem catch
- `console.error()` — chamadas de console.error
- `console.warn()` — chamadas de console.warn

## Opcoes

```js
UpStat.listen({
  token: "ups_seutoken",           // obrigatorio
  environment: "production",        // opcional (default: process.env.NODE_ENV || "production")
  captureLogs: ["error", "warn"],   // opcional (default: ["error", "warn"])
  endpoint: "https://...",          // opcional (default: api do UpStat)
});
```

| Opcao | Tipo | Default | Descricao |
|-------|------|---------|-----------|
| `token` | `string` | — | Token da API (obrigatorio) |
| `environment` | `string` | `NODE_ENV` ou `"production"` | Nome do ambiente |
| `captureLogs` | `Array<"error"\|"warn"\|"log">` | `["error", "warn"]` | Quais metodos do console interceptar |
| `endpoint` | `string` | `https://api.upstat.online/ingest/errors` | URL do endpoint de ingestao |

## Capturando console.log

Por default, `console.log` nao e capturado. Para ativar:

```js
UpStat.listen({
  token: "ups_seutoken",
  captureLogs: ["error", "warn", "log"],
});
```

## Integracao com Express

Se o Express estiver instalado no projeto, o SDK injeta automaticamente um error handler em cada Router. Nenhuma configuracao extra e necessaria.

Erros capturados pelo Express incluem contexto adicional:

```json
{
  "type": "express",
  "context": {
    "method": "POST",
    "path": "/api/users",
    "statusCode": 500
  }
}
```

## Comportamento

- **console.error/warn/log** — o SDK intercepta a chamada, envia o evento pro UpStat e chama o metodo original normalmente. O console continua funcionando igual.
- **uncaughtException** — envia o evento e encerra o processo com `process.exit(1)`.
- **unhandledRejection** — envia o evento sem encerrar o processo.
- **Express** — captura o erro, envia o evento e chama `next(err)` pra continuar o fluxo normal de error handling.
- **Falhas de rede** — erros de envio sao silenciosos em producao. Em dev, aparece um `console.debug` com o erro.

## Tipos exportados

```ts
import type { UpStatOptions, CapturedEvent } from "upstat-js";
```

### `CapturedEvent`

```ts
interface CapturedEvent {
  token: string;
  message: string;
  stack?: string;
  type:
    | "uncaughtException"
    | "unhandledRejection"
    | "console.error"
    | "console.warn"
    | "console.log"
    | "express";
  environment: string;
  context?: Record<string, unknown>;
  timestamp: string;
}
```

## Requisitos

- Node.js 18+ (usa `fetch` nativo)
- Zero dependencias de producao

## Licenca

MIT
