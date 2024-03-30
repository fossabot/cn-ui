import data from 'analyze/size_report.json'
import prettyBytes from 'pretty-bytes'
export const SizeAnalyze = (props: {}) => {
    return (
        <table class="w-full m-8">
            <thead class="font-bold text-xl bg-gray-200">
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
                        <tr class="hover:bg-gray-200">
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
