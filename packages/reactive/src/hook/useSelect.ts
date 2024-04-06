import { atomization } from '../utils'
import { atom, Atom, computed } from '../atom/index'
import { createEffect, untrack } from 'solid-js'

/**
 * @zh 多选状态管理
 * */
export function useSelect<T>(
    options: Atom<T[]>,
    config: {
        getId?: (item: T) => string
        /** 默认多选，但是可以取消 */
        multi?: Atom<boolean> | boolean
        // 当数据中出现不符合规定的数据时，是否保留
        keepUndefinedOption?: boolean
    } = {}
) {
    const multi = atomization(config.multi ?? true)

    /** @ts-ignore 未想到适合的类型挂载 */
    const getId = config.getId ?? ((item) => item.value)
    const optionsIdMap = computed(() => new Map<string, T>(options().map((i) => [getId(i), i])))
    const selectedMap = atom(new Map<string, T>(), { equals: false })
    const disabledMap = atom(new Map<string, T>(), { equals: false })

    // 自动强制单选，防止多选转单选发生数据错乱
    createEffect(() => {
        // 单选模式，限制选定数据为一个
        !multi() &&
            untrack(selectedMap).size >= 1 &&
            selectedMap((i) => {
                const onlyOneSelected = new Map<string, T>()
                for (const entry of i.entries()) {
                    if (optionsIdMap().has(entry[0])) {
                        onlyOneSelected.set(entry[0], entry[1])
                        // 如果需要保留未知 option 需要全部遍历
                        if (config.keepUndefinedOption) {
                            continue
                        } else {
                            break
                        }
                    } else if (config.keepUndefinedOption) {
                        onlyOneSelected.set(entry[0], entry[1])
                    }
                }
                return onlyOneSelected
            })
    })

    /** 更改相应 id 的状态 */
    const changeSelected = (id: string, state?: boolean) => {
        if (disabledMap().has(id)) return false
        // 默认自动置反
        if (state === undefined) state = !selectedMap().has(id)

        if (state === true && !selectedMap().has(id)) {
            selectedMap((i) => {
                const item = optionsIdMap().get(id)
                if (!item) throw new Error('useSelect | changeSelected error: id ' + id + ' not found in options')
                if (multi()) {
                    i.set(id, item)
                    return i
                } else {
                    return new Map([[id, item]])
                }
            })
        } else if (state === false) {
            selectedMap().delete(id)
        }
        return state
    }
    const multiSelectedState = computed(() => {
        let hasOneSelected = false
        let hasOneUnSelected = false
        for (const id of optionsIdMap().keys()) {
            if (selectedMap().has(id)) {
                hasOneSelected = true
            } else {
                hasOneUnSelected = true
            }
        }
        const isPartial = hasOneSelected && hasOneUnSelected
        const isAll = hasOneSelected && !hasOneUnSelected
        // 特殊情况，如果没有 options 那么应该是 isNone
        const isNone = (!hasOneSelected && hasOneUnSelected) || optionsIdMap().size === 0
        return { isAll, isNone, isPartial }
    })
    return {
        multi,
        selected: () => {
            return selectedMap().values()
        },
        selectedMap,
        toggle: (item: T, state?: boolean) => changeSelected(getId(item), state),
        select: (item: T) => changeSelected(getId(item), true),
        unselect: (item: T) => changeSelected(getId(item), false),

        toggleById: changeSelected,
        selectById: (item: string) => changeSelected(item, true),
        unselectById: (item: string) => changeSelected(item, false),
        /** 清空选中 */
        clearAll() {
            if (config.keepUndefinedOption) {
                selectedMap((i) => {
                    for (const id of optionsIdMap().keys()) {
                        i.delete(id)
                    }
                    return i
                })
            } else {
                selectedMap(new Map())
            }
        },
        /** 选中所有 */
        selectAll() {
            if (multi()) {
                selectedMap((i) => {
                    for (const item of optionsIdMap()) {
                        i.set(...item)
                    }
                    return i
                })
            } else {
                throw new Error('useSelect | multi: false | can not trigger selectAll')
            }
        },
        /** 所有选中 */
        isAllSelected() {
            return multiSelectedState().isAll
        },
        /** 所有未选中 */
        isNoneSelected() {
            return multiSelectedState().isNone
        },
        /** 是否选中有 */
        isIndeterminate() {
            return multiSelectedState().isPartial
        },
        /** 检查一个键是否被选中 */
        isSelected: (id: string) => {
            return selectedMap().has(id)
        },
        /** 禁用 */
        disabledMap,
        isDisabled(item: T) {
            return disabledMap().has(getId(item))
        },
        isDisabledById(id: string) {
            return disabledMap().has(id)
        },
        disable: (item: T) => {
            disabledMap((i) => (i.set(getId(item), item), i))
        },
        disableById: (id: string) => {
            disabledMap((i) => (i.set(id, optionsIdMap().get(id)!), i))
        }
    }
}
