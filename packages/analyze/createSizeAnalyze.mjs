import { glob } from "glob";
import fs from 'fs'
import { gzipSize, gzipSizeSync } from 'gzip-size';
import brotliSize from 'brotli-size'

// 分析构建出来的文件的大小
const files = await glob('./dist/*.js')

const report = files.map(i => {
    const file = fs.readFileSync(i)
    return [i, {
        size: fs.statSync(i).size,
        gzip: gzipSizeSync(file),
        br: brotliSize.sync(file)
    }]
})
fs.writeFileSync('./dist/size_report.json', JSON.stringify(report))