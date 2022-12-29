import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import visualizer from 'rollup-plugin-visualizer';
import Package from './package.json';
const deps = [Package.dependencies, Package.peerDependencies, Package.devDependencies].flatMap(
    (i) => Object.keys(i)
);
console.log(deps);
export default defineConfig(({ mode }) => {
    return {
        plugins: [
            {
                name: 'shake',
                enforce: 'pre',
                resolveId(thisFile) {
                    if (deps.some((i) => thisFile.startsWith(i))) return false;
                },
            },
            solidPlugin(),
            mode === 'analyze' &&
                (visualizer({ open: true, filename: 'visualizer/stat.html' }) as any),
        ],
        server: {
            port: 3000,
        },
        build: {
            assetsInlineLimit: 0,
            target: 'es6',
            lib: {
                entry: './src/index.ts',
                name: 'index',
                fileName: 'index',
                formats: ['es'],
            },

            sourcemap: true,
        },
    };
});
