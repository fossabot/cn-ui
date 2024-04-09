import { createEffect, onCleanup } from 'solid-js'
import { Atom } from './atom'

export const createSync = <T, D>(a: Atom<T>, b: Atom<D>, AToB: (a: T) => D, BToA: (b: D) => T) => {
    let cacheState: any
    createEffect(() => {
        if (cacheState === b()) return
        const newA = BToA(b())
        a(() => newA)
        cacheState = newA
    })
    createEffect(() => {
        if (cacheState === a()) return
        const newB = AToB(a())
        b(() => newB)
        cacheState = newB
    })
    onCleanup(() => (cacheState = null))
    return {
        /**
         * @dev
         */
        breakSync: () => {}
    }
}
