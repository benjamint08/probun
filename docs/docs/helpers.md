---
outline: deep
---


# Helper Functions

These functions makes it easier to send responses to the client.

## SendJSON

Sends a JSON response to the client.

### Parameters

- `json: any`: The JSON object to be sent.
- `status: number = 200`: The HTTP status code of the response (default is 200).

### Returns

`Promise<Response>`: A promise that resolves to the HTTP response.

### Example Usage

```typescript
async function handler(req: Request): Promise<Response> {
    const data = { message: "Hello, world!" };
    return await SendJSON(data, 200);
}
```

## Success

Sends a success message as a JSON response.

### Parameters

- `message: string`: The success message to be sent.
- `status: number = 200`: The HTTP status code of the response (default is 200).

### Returns

`Promise<Response>`: A promise that resolves to the HTTP response.

### Example Usage

```typescript
async function successHandler(req: Request): Promise<Response> {
    return Success("Operation successful", 200);
}
```

## Failure

Sends a failure message as a JSON response.

### Parameters

- `message: string`: The failure message to be sent.
- `status: number = 400`: The HTTP status code of the response (default is 400).

## ServerFailure

Sends a failure message as a JSON response with a status code of 500.

### Parameters

- `message: string`: The failure message to be sent.

### Returns

`Promise<Response>`: A promise that resolves to the HTTP response.

### Example Usage

```typescript
async function failureHandler(req: Request): Promise<Response> {
    return Failure("Operation failed", 400);
}
```

## Redirect

Redirects the client to another URL.

### Parameters

- `destination: string`: The URL to redirect to.
- `status: number = 302`: The HTTP status code of the response (default is 302).

### Returns

`Response`: The HTTP response.

### Example Usage

```typescript
function redirectHandler(req: Request): Response {
    return Redirect("https://example.com");
}
```

## Html

Sends an HTML response to the client.

### Parameters

- `html: string`: The HTML string to be sent.
- `status: number = 200`: The HTTP status code of the response (default is 200).

### Returns

`Response`: The HTTP response.

### Example Usage

```typescript
function htmlHandler(req: Request): Response {
    const htmlContent = "<h1>Hello, World!</h1>";
    return Html(htmlContent, 200);
}
```

Exported Functions: `SendJSON`, `Success`, `Failure`, `Redirect`, `Html`.
```
