import { Evaluator } from "https://esm.sh/rollup-web/dist/index.js";

const Eval = new Evaluator();
await Eval.useWorker("./src/worker.mjs");
console.log(Eval);
await Eval.createEnv();
console.log("环境布置完成");
await Eval.evaluate(
    "./public/init.ts"
);
