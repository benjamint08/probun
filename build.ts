/// <reference types='bun-types' />
// Script made by @aquapi - https://github.com/bit-js/library/blob/main/build.ts
import { existsSync, rmSync } from 'fs';
import pkg from './package.json';
import { $ } from 'bun';

// Generating types
const dir = './lib';
if (existsSync(dir)) rmSync(dir, { recursive: true });

// Build source files
Bun.build({
    format: 'esm',
    target: 'bun',
    outdir: './lib',
    entrypoints: ['./index.ts', './helper.ts'],
    minify: {
        whitespace: true
    },
    external: Object.keys(pkg.dependencies)
});

await $`bun x tsc`;