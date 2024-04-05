/// <reference types='bun-types' />
// Script made by @aquapi - https://github.com/bit-js/library/blob/main/build.ts
// Modified by @benjamint08 for ProBun
import { existsSync, rmSync } from 'fs';
import pkg from './package.json';
import { $ } from 'bun';

const version = pkg.version.split('.');
const major = Number(version[0]);
const minor = Number(version[1]);
const patch = Number(version[2]);

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

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`Major version (current: ${major.toString()}): `, (m: any) => {
    readline.question(`Minor version (current: ${minor.toString()}): `, (n: any) => {
        readline.question(`Patch version (current: ${patch.toString()}): `, async (p: any) => {
            pkg.version = `${m || major}.${n || minor}.${p || patch}`;
            await Bun.write('package.json', JSON.stringify(pkg, null, 4));
            console.log(`Version set to ${pkg.version}`);
            readline.close();
            process.exit(0);
        });
    });
});

