import path from "node:path";
import fs from "fs-extra";
import { glob } from "glob";
import * as lodash from "lodash-es";
const files = await glob("./node_modules/@cn-ui/spinners/svg-css/*.svg");

/** 将 SVG 字符串转化为 typescript 的 Solidjs 组件 */
const SVGToSolidComponent = (svgs) => {
    // 第一个字符大写
    const capitalize = (s) => {
        if (typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    //将字符串开头的数字移动到最末尾
    const moveNumberToEnd = (s) => {
        if (typeof s !== "string") return "";
        const number = s.match(/^\d+/)?.[0];
        if (!number) return s;
        return s.replace(number, "").concat(number);
    };
    const header = `// @ts-nocheck\nimport type { JSX } from 'solid-js';\n`;

    const names = [];
    const finalCode =
        header +
        svgs
            .map((i) => {
                const compName = i.name;
                const name = moveNumberToEnd(
                    capitalize(lodash.camelCase(compName.replace(".svg", ""))),
                );
                const svgCode = i.code
                    // 处理 svg 属性传递问题
                    .replace(/<svg(.*?)>/, "<svg$1 {...props}>")
                    // style 标签在里面报错问题
                    .replace(/<style(.*?)>(.*?)<\/style>/, "<style$1>{`$2`}</style>");

                names.push(name);
                const code = `
export const ${name} = /* __@PURE__ */ (props: JSX.SvgSVGAttributes<SVGSVGElement>) => {
    return ${svgCode}
}
    `;
                return code;
            })
            .join("\n");
    return { exports: names, code: finalCode };
};

const exports = SVGToSolidComponent(
    files.map((i) => ({
        name: path.basename(i),
        code: fs.readFileSync(i, "utf-8"),
    })),
);
fs.outputFileSync("./dist/svg-spinner.tsx", exports.code);
fs.outputFileSync("./dist/svg-spinner.exports.json", JSON.stringify(exports.exports));
