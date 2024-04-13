import { AC, ArrayFolder, DebounceAtom, atom, computed, resource } from "@cn-ui/reactive";
import Fuse from "fuse.js";
import { BaseInput } from "../../input";

import * as AntdIcon from "solid-icons/ai";
import type { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { watch } from "solidjs-use";
import { Tabs } from "../../tabs";
import copy from "copy-to-clipboard";
import { VirtualList } from "../../virtualList";
import { InputNumber } from "../../inputNumber";
import { Message } from "../../Message";

const loader = {
    Ai: () => AntdIcon,
    Bs: () => import("solid-icons/bs"),
    Fi: () => import("solid-icons/fi"),
    Hi: () => import("solid-icons/hi"),
    Im: () => import("solid-icons/im"),
    Si: () => import("solid-icons/si"),
    Vs: () => import("solid-icons/vs"),
    Oc: () => import("solid-icons/oc"),
    // 下面的图标库打包报错
    // Bi: () => import('solid-icons/bi'),
    // Fa: () => import('solid-icons/fa')
    // Io: () => import('solid-icons/io')
    // Ri: () => import('solid-icons/ri'),
    // Ti: () => import('solid-icons/ti'),
    // Wi: () => import('solid-icons/wi'),
    // Cg: () => import('solid-icons/cg'),
    // Tb: () => import('solid-icons/tb'),
} as unknown as Record<string, () => Promise<Record<string, Component>>>;

export const IconSearch = () => {
    const searchText = atom("");
    const searchKey = DebounceAtom(searchText, 500);
    const size = atom(32);

    const watchingTab = atom({
        value: "Ai",
    });

    const pack = resource(async () => loader[watchingTab().value](), {
        initValue: {},
    });
    const totalAvailable = computed(() =>
        Object.keys(pack())
            .filter((i) => i !== "default")
            .map((i) => ({ label: i })),
    );
    const fuse = computed(() => new Fuse<{ label: string }>(totalAvailable(), { keys: ["label"] }));
    const result = computed(() => {
        if (!searchKey()) return totalAvailable();
        return fuse()
            .search(searchKey())
            .map((i) => i.item);
    });
    watch(watchingTab, () => {
        pack.refetch();
    });
    return (
        <div class="h-[80vh] grid grid-cols-12 gap-4">
            <BaseInput
                class="col-span-6"
                placeholder="试着搜索 icon 的英文"
                v-model={searchText}
                suffixIcon={`搜索结果 ${result().length} / ${totalAvailable().length}`}
            />
            <InputNumber class="col-span-6" v-model={size} controls step={4} />
            <Tabs
                class="col-span-12"
                options={Object.keys(loader).map((i) => {
                    return { label: i, value: i };
                })}
                v-model={watchingTab}
            />
            <div class="col-span-12 h-full">
                <AC resource={pack}>
                    {() => {
                        return <IconGallery comps={pack()} result={result()} size={size()} />;
                    }}
                </AC>
            </div>
        </div>
    );
};

const IconGallery = (props: {
    comps: Record<string, Component<{ size: number }>>;
    result: { label: string }[];
    size: string | number;
}) => {
    return (
        <VirtualList
            each={ArrayFolder(
                props.result
                    .map((i) => ({ ...i, comp: props.comps[i.label] }))
                    .filter((i) => i.comp),
            )}
            estimateSize={64}
        >
            {(row) => {
                return (
                    <div class="grid grid-cols-10 h-12 ">
                        {row.map((i) => {
                            return (
                                <div
                                    title={i.label}
                                    class="cursor-pointer transition p-4 rounded-lg flex justify-center items-center"
                                    onclick={() => {
                                        copy(i.label);
                                        Message.success(`复制 ${i.label} 成功`);
                                    }}
                                >
                                    <Dynamic
                                        component={i.comp}
                                        size={Number.parseInt(props.size as string)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                );
            }}
        </VirtualList>
    );
};
