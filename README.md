# probun
### This is a work in progress! Expect many new features.

## A better web server for Bun.

To get started, check out the routes folder. This is where you can define your routes.

## Test the post requests in your terminal:

```bash
curl -X POST http://localhost:3000/ --data '{"data":"hi"}'
```

# Installation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

# TODO
- Add support for multi-folders so routes like `/api/v1/test` can be called etc.
- Add support for MongoDB out of the box

This project was created using `bun init` in bun v1.1.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
