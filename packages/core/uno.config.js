import transformerDirectives from "@unocss/transformer-directives";
// uno.config.ts
import { defineConfig, presetUno } from "unocss";
import presetTheme from "unocss-preset-theme";
import presetCN, { darkColors, lightColors } from "./src/css/presets/index";

export default defineConfig({
    presets: [
        presetUno(),
        presetTheme({
            prefix: "--cn",
            theme: {
                dark: { colors: darkColors },
                light: { colors: lightColors },
            },
        }),
        presetCN,
    ],
    transformers: [
        transformerDirectives({
            applyVariable: ["--at-apply", "--uno-apply", "--uno"],
        }),
    ],
});
