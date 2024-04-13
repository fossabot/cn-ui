import { renderHook } from "@solidjs/testing-library";
import { expect, test } from "vitest";
import { genArray } from "../../utils";
import { atom } from "../atom";
import { createSync } from "../createSync";

test("createSync", () => {
    const _arr = genArray(10);
    const {
        result: { value, options, selected },
    } = renderHook(() => {
        const value = atom(0);
        const options = atom(_arr.map((i) => ({ label: i, value: i })));
        const selected = atom(options()[0]);
        createSync(
            value,
            selected,
            (s) => {
                const i = options().findIndex((i) => i.value === s);
                return options()[i];
            },
            (s) => s.value,
        );
        return { value, options, selected };
    });
    expect(value()).toBe(0);
    expect(selected()).eql({ label: 0, value: 0 });

    // 更改 selected 为 value = 2
    selected(() => options()[2]);
    expect(selected()).eql({ label: 2, value: 2 });
    expect(value()).toBe(2);

    // 更改 value 为 5
    value(() => 5);
    expect(value()).toBe(5);
    expect(selected()).eql({ label: 5, value: 5 });
});
