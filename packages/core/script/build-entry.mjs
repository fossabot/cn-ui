import { glob } from 'glob'
import path from 'path'
import fs from 'fs-extra'

// 生成 src/index.ts
const e = await glob([`./src/*/index.ts`])
const jsFile = e
    .sort()
    .map((i) => {
        return `export * from './${path.relative('./src/', i).replace('.ts', '')}'`
    })
    .join('\n')
fs.outputFileSync('./src/index.ts', jsFile)

fs.outputFileSync('./dist/index.js', `export * from './lib/index.js';`)
fs.outputFileSync('./dist/index.d.ts', `export * from './lib/index';`)
