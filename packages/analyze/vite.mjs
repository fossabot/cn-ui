import { defineConfig, build } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'path'
import fs from 'fs'
import multi from 'rollup-plugin-multi-input'
import analyze from 'rollup-plugin-analyzer'
const ignoreDeps = ['solid-js', 'solid-js/web', 'solid-js/store']
const buildConfig = (entry) => {
    const collection = new Map()
    return defineConfig({
        mode: "production",
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
                        if (ignoreDeps.includes(source)) {
                            return { id: source, external: true }
                        }

                    }
                },
                async generateBundle(outputOptions, bundle) {
                    // fs.writeFileSync(`./dist/${path.basename(entry)}_relationShip.json`, JSON.stringify([...collection.entries()]))
                }
            },

            solid(),
            // analyze({
            //     stdout: false,
            //     summaryOnly: true
            // })
        ],
        esbuild: {
            minifyWhitespace: true,
            minifyIdentifiers: true,
            minify: true,
        },
        build: {
            target: 'esnext',
            outDir: 'dist',
            emptyOutDir: false,
            reportCompressedSize: false,
            // lib: {
            //     entry,
            //     formats: ['es'],
            //     fileName(format, entryName) {
            //         return entryName + '.js'
            //     },
            // },
            rollupOptions: {
                input: entry,
            },
            minify: 'esbuild',
        }
    })
}
import { glob } from 'glob'

const entries = await glob('./temp/*.ts')

import pLimit from 'p-limit';

const limit = pLimit(3);
entries.forEach(entry => {
    limit(async () => {

        const config = buildConfig(entry)
        return build(config)
    })
})