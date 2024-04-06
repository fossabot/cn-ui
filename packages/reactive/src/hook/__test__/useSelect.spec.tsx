import { renderHook } from '@solidjs/testing-library'
import { expect, test } from 'vitest'
import { genArray } from '../../utils'
import { useSelect } from '../useSelect'
import { atom } from '../../atom'

test('单选方案', async () => {
    const {
        result: { toggleById, isSelected }
    } = renderHook(() => useSelect(atom(genArray(10).map((i) => ({ value: i.toString() }))), { multi: false }))

    const select = (key: string) => {
        expect(isSelected(key)).toBe(false)
        toggleById(key)
        expect(isSelected(key)).toBe(true)
    }
    const unselect = (key: string) => {
        expect(isSelected(key)).toBe(true)
        toggleById(key)
        expect(isSelected(key)).toBe(false)
    }
    select('2')
    select('3')
    expect(isSelected('2')).toBe(false)
    unselect('3')
    expect(isSelected('3')).toBe(false)
})

test('多选方案', async () => {
    const {
        result: { isSelected, isAllSelected, isIndeterminate, isNoneSelected, selectAll, clearAll, select }
    } = renderHook(() => useSelect(atom(genArray(10).map((i) => ({ value: i.toString() })))))

    // 全选
    selectAll()
    genArray(10).forEach((i) => {
        expect(isSelected(i.toString())).toBe(true)
    })
    expect(isAllSelected()).toBe(true)
    expect(isIndeterminate()).toBe(false)
    expect(isNoneSelected()).toBe(false)

    clearAll()
    genArray(10).forEach((i) => {
        expect(isSelected(i.toString())).toBe(false)
    })
    expect(isAllSelected()).toBe(false)
    expect(isIndeterminate()).toBe(false)
    expect(isNoneSelected()).toBe(true)

    select({ value: '1' })
    expect(isSelected('1')).toBe(true)
    ;[2, 3, 4, 5, 6, 7, 8, 9].forEach((i) => {
        expect(isSelected(i.toString())).toBe(false)
    })
    expect(isAllSelected()).toBe(false)
    expect(isIndeterminate()).toBe(true)
    expect(isNoneSelected()).toBe(false)
})
