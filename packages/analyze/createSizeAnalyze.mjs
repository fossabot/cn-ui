import { glob } from "glob";
import fs from 'fs'
import { gzipSize, gzipSizeSync } from 'gzip-size';
import brotliSize from 'brotli-size'

// 分析构建出来的文件的大小
const files = await glob('./dist/assets/*.js')

const report = files.map(i => {
    const file = fs.readFileSync(i)
    return {
        name: i.match(/\/(\w+)-.*/)[1],
        size: fs.statSync(i).size,
        gzip: gzipSizeSync(file),
        br: brotliSize.sync(file)
    }
}).sort((a, b) => b.size - a.size)
fs.writeFileSync('./size_report.json', JSON.stringify(report))

import filesize from 'file-size'
console.table(report.map(i => {
    return {
        name: i.name,
        size: filesize(i.size).human(),
        gzip: filesize(i.gzip).human(),
        br: filesize(i.br).human()
    }
}))