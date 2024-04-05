---
outline: deep
---

# Getting Started

ProBun is a fast, lightweight file-based routing system for Bun servers. It is designed to be simple and easy to use.

## Installation

```bash
bun install probun
```

## Example Usage

```typescript
import ProBun from "probun"

const server = new ProBun({
    port: 3001,
    routes: "routes",
    logger: true
});


server.start();
```

## Configuration

- `port` - The port to run the server on. (optional)
- `routes` - The folder where your routes are stored. 
- `logger` - Enable or disable logging. (optional)

## File-based Routing

ProBun uses file-based routing to make it easy to create routes. When you create folder and add a file called `index.ts` inside it, it will create a route for that folder. Example:

```plaintext
routes/
    index.ts # This will render /
    users/ # This will render /users
        index.ts
```

