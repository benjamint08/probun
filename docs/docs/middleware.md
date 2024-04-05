---
outline: deep
---

# Middleware

Middleware is a function that is called before the request is passed to the route handler. It can be used to perform operations like logging, authentication, etc. Middleware functions can be added to the application or to a specific route.

## Adding Middleware to the Application

```typescript
import ProBun from "probun"
import { powered } from "./middleware/powered";
import { cors } from "./middleware/cors";

const server = new ProBun({
    port: 3001,
    routes: "routes",
    logger: true
});

server.defineMiddleware(powered);
server.defineMiddleware(cors);
server.start();
```

- `defineMiddleware` - This method is used to add middleware to the application.
- `powered` - This is a middleware function that adds a `X-Powered-By` header to the response.
- `cors` - This is a middleware function that adds CORS headers to the response.

## Custom Middleware

```typescript
export async function mymiddleware(req: Request, props: any): Promise<void> {
    // props is { customHeaders: Headers }
    props.customHeaders.set("X-Custom-Header", "Custom Value");
    // Do something
    return;
}
```