// 导入打包产物
import { sky_module, Compiler } from 'https://esm.sh/rollup-web/dist/index.js'

// 导入各种插件
import { babelCore as babel } from 'https://esm.sh/rollup-web/dist/plugins/babel.core.js'

import SolidPresets from 'https://esm.sh/babel-preset-solid'
import TS from 'https://esm.sh/@babel/preset-typescript'

const config = {
    plugins: [
        babel({
            babelrc: {
                presets: [
                    [
                        TS,
                        {
                            // 需要使用这种方式兼容 solid 配置
                            isTSX: true,
                            allExtensions: true
                        }
                    ],
                    SolidPresets
                ]
            },
            // 注意，默认导入要设置这个为 ""
            extensions: ['.tsx', '.ts', ''],
            log(id) {
                console.log('%c> ' + id, 'color:green')
            }
        }),
        sky_module({
            cdn: 'https://esm.sh/'
        })
    ]
}
const compiler = new Compiler(config, {
    extensions: ['.tsx', '.ts'],
    log(url) {
        console.log('%c' + url, 'color:green')
    }
})

import { Evaluator } from 'https://esm.sh/rollup-web/dist/index.js'

const Eval = new Evaluator()

await Eval.createEnv({ Compiler: compiler })
console.log('环境布置完成')
globalThis.Eval = Eval
console.log(Eval)
