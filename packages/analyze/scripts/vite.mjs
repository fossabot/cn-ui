import { defineConfig, build } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'path'
import fs from 'fs'
import multi from 'rollup-plugin-multi-input'
import analyze from 'rollup-plugin-analyzer'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
const ignoreDeps = ['solid-js', 'solid-js/web', 'solid-js/store']
const buildConfig = (entry) => {
    const collection = new Map()
    return defineConfig({
        mode: 'production',
        css: {

        },
        plugins: [
            {
                name: 'external',
                resolveId: {
                    order: 'pre',
                    handler(source, importer, options) {
                        if (ignoreDeps.includes(source)) {
                            return { id: source, external: true }
                        }
                    }
                },
            },
            cssInjectedByJsPlugin(),
            solid()
        ],
        esbuild: {
            minifyWhitespace: true,
            minifyIdentifiers: true,
            minify: true
        },
        build: {
            target: 'esnext',
            outDir: 'dist',
            emptyOutDir: false,
            reportCompressedSize: false,
            rollupOptions: {
                input: entry
            },
            minify: 'esbuild'
        }
    })
}
import { glob } from 'glob'

const entries = await glob('./temp/*.ts')

import pLimit from 'p-limit'

const limit = pLimit(3)
entries.forEach((entry) => {
    limit(async () => {
        const config = buildConfig(entry)
        return build(config)
    })
})
