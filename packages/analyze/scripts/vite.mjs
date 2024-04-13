import fs from "node:fs";
import path from "node:path";
import analyze from "rollup-plugin-analyzer";
import multi from "rollup-plugin-multi-input";
import { visualizer } from "rollup-plugin-visualizer";
import { build, defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import solid from "vite-plugin-solid";
const ignoreDeps = ["solid-js", "solid-js/web", "solid-js/store"];
const buildConfig = (entry) => {
	const collection = new Map();
	return defineConfig({
		mode: "production",
		css: {},
		plugins: [
			{
				name: "external",
				resolveId: {
					order: "pre",
					handler(source, importer, options) {
						if (ignoreDeps.includes(source)) {
							return { id: source, external: true };
						}
					},
				},
			},
			cssInjectedByJsPlugin(),
			solid(),
			visualizer({
				emitFile: true,
				filename: "dist/" + entry + ".html",
			}),
		],
		esbuild: {
			minifyWhitespace: true,
			minifyIdentifiers: true,
			minify: true,
		},
		build: {
			target: "esnext",
			outDir: "dist",
			emptyOutDir: false,
			reportCompressedSize: false,
			rollupOptions: {
				input: entry,
			},
			minify: "esbuild",
		},
	});
};
import { glob } from "glob";

const entries = await glob("./temp/*.ts");

import pLimit from "p-limit";

const limit = pLimit(3);
entries.forEach((entry) => {
	limit(async () => {
		const config = buildConfig(entry);
		return build(config);
	});
});
