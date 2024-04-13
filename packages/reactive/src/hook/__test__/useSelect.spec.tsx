import { renderHook } from "@solidjs/testing-library";
import { expect, test } from "vitest";
import { atom } from "../../atom";
import { genArray } from "../../utils";
import { useSelect } from "../useSelect";

test("单选方案", async () => {
    const {
        result: { toggleById, isSelectedById },
    } = renderHook(() =>
        useSelect(atom(genArray(10).map((i) => ({ value: i.toString() }))), {
            multi: () => false,
        }),
    );

    const select = (key: string) => {
        expect(isSelectedById(key)).toBe(false);
        toggleById(key);
        expect(isSelectedById(key)).toBe(true);
    };
    const unselect = (key: string) => {
        expect(isSelectedById(key)).toBe(true);
        toggleById(key);
        expect(isSelectedById(key)).toBe(false);
    };
    select("2");
    select("3");
    // 单选只能有一个，所以更换为 3
    expect(isSelectedById("2")).toBe(false);
    expect(isSelectedById("3")).toBe(true);
    unselect("3");
    expect(isSelectedById("3")).toBe(false);
});

test("多选方案", async () => {
    const {
        result: {
            isSelectedById,
            isAllSelected,
            isIndeterminate,
            isNoneSelected,
            selectAll,
            clearAll,
            select,
        },
    } = renderHook(() => useSelect(atom(genArray(10).map((i) => ({ value: i.toString() })))));

    // 全选
    selectAll();
    genArray(10).forEach((i) => {
        expect(isSelectedById(i.toString())).toBe(true);
    });
    expect(isAllSelected()).toBe(true);
    expect(isIndeterminate()).toBe(false);
    expect(isNoneSelected()).toBe(false);

    clearAll();
    genArray(10).forEach((i) => {
        expect(isSelectedById(i.toString())).toBe(false);
    });
    expect(isAllSelected()).toBe(false);
    expect(isIndeterminate()).toBe(false);
    expect(isNoneSelected()).toBe(true);

    select({ value: "1" });
    expect(isSelectedById("1")).toBe(true);
    [2, 3, 4, 5, 6, 7, 8, 9].forEach((i) => {
        expect(isSelectedById(i.toString())).toBe(false);
    });
    expect(isAllSelected()).toBe(false);
    expect(isIndeterminate()).toBe(true);
    expect(isNoneSelected()).toBe(false);
});
