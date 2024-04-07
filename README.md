# probun
# ⚠️ This is a work in progress! Expect many new features. ⚠️

## Official [ProBun Docs](https://probun.dev)

## A better web server for Bun.

Check out the template project [here](https://github.com/benjamint08/probun-example) to get started and also check out the routes folder for an example. This is where you can define your routes.
You can also add folders to the routes folder to create sub-routes. Go wild- probun loads all of them.

## Test the post requests in your terminal:

```bash
curl -X POST http://localhost:3000/ --data '{"data":"hi"}'
```

# Installation

To install dependencies:

```bash
bun install probun
```

# TODO
- Add support for MongoDB out of the box

This project was created using `bun init` in bun v1.1.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
