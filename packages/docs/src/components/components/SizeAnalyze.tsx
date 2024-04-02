import { classNames } from '@cn-ui/reactive'
import data from 'analyze/size_report.json'
import prettyBytes from 'pretty-bytes'
export const SizeAnalyze = (props: {}) => {
    return (
        <section class="grid grid-cols-24">
            <div class="col-span-12 h-1/2 overflow-y-scroll"></div>
            <div class="col-span-12 h-1/2 overflow-y-scroll">
                <SizeTable></SizeTable>
            </div>
        </section>
    )
}
function SizeTable() {
    return (
        <table class="w-full ">
            <thead class="font-bold text-xl bg-gray-200 sticky top-0 left-0">
                <tr>
                    <td>Name</td>
                    <td>Origin</td>
                    <td>Gzip</td>
                    <td>Brotli</td>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => {
                    return (
                        <tr
                            id={item.name}
                            class={classNames(
                                'hover:bg-gray-200 font-normal',
                                item.size >= 100 * 1024
                                    ? 'text-red-600'
                                    : item.size >= 50 * 1024
                                      ? 'text-yellow-700'
                                      : item.size >= 30 * 1024
                                        ? 'text-green-700'
                                        : 'text-purple-600'
                            )}
                        >
                            <td>{item.name}</td>
                            <td>{prettyBytes(item.size)}</td>

                            <td>{prettyBytes(item.gzip)}</td>
                            <td>{prettyBytes(item.br)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
