import { defineConfig } from 'astro/config';

// https://astro.build/config
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
    integrations: [solidJs(), tailwind(), sitemap()],
    vite: {
        resolve: {
            alias: {
                '@cn-ui/core': '/node_modules/@cn-ui/core/src/index.ts',
            },
        },
    },
});