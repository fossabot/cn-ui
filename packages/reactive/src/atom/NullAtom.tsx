import type { SignalOptions } from "solid-js";
import { type Atom, atom } from "./atom";

export const NullAtom = atom as <T>(
    value: T | null,
    props?: SignalOptions<T> | undefined,
) => Atom<T | null>;
