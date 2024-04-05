---
outline: deep
---

# Handling Requests

When a request is made to your application, the request is passed to the router. The router will then match the request to a route and call the handler function associated with that route.

Example of handling a get request:

```typescript
// routes/index.ts - This will handle localhost:3000/
export async function GET(req: Request): Promise<Response> {
   return new Response('Hello World');
}
```

The method is the name of the function that you export from your route file. The method name must be in uppercase.

The method must be an async function that takes a single parameter, which is the request object.

## Valid Methods

The following methods are valid:

- GET
- POST
- PUT
- DELETE
- PATCH