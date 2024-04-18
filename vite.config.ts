import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    plugins: [UnoCSS(), solid(), wasm()],
    assetsInclude: ["**/*.mdx"],
    build: {
        target: "esnext",
    },
    server: {
        watch: {
            usePolling: false,
            interval: 300,
        },
    },
});
