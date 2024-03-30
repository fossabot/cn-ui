import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import dts from 'vite-plugin-dts'
import UnoCSS from 'unocss/vite'
import p from './package.json'
import path from 'path'
import multi from 'rollup-plugin-multi-input'
import { bundleStats } from 'rollup-plugin-bundle-stats'

import fs from 'fs'
const needBundle: string[] = []
const AllDeps = [p.dependencies, p.devDependencies].flatMap((i) => Object.keys(i)).filter((i) => !needBundle.includes(i))
const collection = new Map()

export default defineConfig({
    plugins: [
        {
            name: 'external',
            resolveId: {
                order: 'pre',
                handler(source, importer, options) {
                    const shortString = (i = 'null') => i.split('packages')?.[1] ?? i
                    if (source.startsWith('.') && importer) {
                        collection.set(shortString(importer), shortString(path.resolve(path.dirname(importer), source)))
                    } else {
                        collection.set(shortString(importer), shortString(source))
                    }
                    if (AllDeps.some((i) => source.startsWith(i))) {
                        return { id: source, external: true }
                    }
                    if (source.includes('node_modules')) {
                        // console.log(source);
                    }
                }
            },
            async generateBundle(outputOptions, bundle) {
                fs.writeFileSync('./dist/relationShip.json', JSON.stringify([...collection.entries()]))
            }
        },
        multi.default({
            relative: 'lib',
            transformOutputPath: (output, input) => {
                return `${path.basename(path.dirname(output))}/${path.basename(output)}`
            }
        }),
        dts(),
        // unocss 文件是额外进行构建的
        // 但是这里用于处理 css 内的 unocss 语法问题
        UnoCSS({
            mode: 'global',
            content: {
                pipeline: {
                    include: ['**/*.css'],
                    exclude: ['**/*.@(ts|tsx)']
                }
            }
        }),
        solid(),
        // wasm(),
        bundleStats()
    ],
    esbuild: {
        jsx: 'preserve'
    },
    assetsInclude: ['**/*.mdx'],
    build: {
        target: 'esnext',
        outDir: 'dist/esm',
        lib: {
            entry: './src/index.ts',
            formats: ['es'],
            fileName(format, entryName) {
                return entryName + '.js'
            }
        },
        rollupOptions: {
            input: ['src/*/index.ts']
        },
        sourcemap: true // 输出.map文件
    }
})
