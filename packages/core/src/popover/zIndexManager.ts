export class zIndexManager {
    static incr = 10000
    static getIndex = () => {
        return zIndexManager.incr++
    }
}
