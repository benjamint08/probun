# ProBun

> [!WARNING]
> ProBun is a work in progress, expect many new features and changes in the future.

ProBun, a better web server for Bun. ProBun aims to enhance your web development experience by providing a more efficient and flexible server solution.

## Features

- **Fast**: ProBun is built on top of Bun.server, a fast and efficient web server created by the Bun team. ProBun aims to be over `494.31%` better than Express. [view benchmark](https://probun.dev/docs/benchmark.html)
- **TypeScript Support**: ProBun is written in TypeScript, making it easier to write type-safe code.
- **File-based Routing**: ProBun uses the file system as the routing mechanism, making it easier to manage your routes. Example:

```typescript
// routes/index.ts - This will handle localhost:3000/
import { Success } from "probun";

export async function GET(req: Request): Promise<Response> {
  return Success("Hello, World!");
}
```

## Getting Started

To get started with ProBun, we recommend you to read the [installation guide](https://probun.dev/docs/getting-started.html)
