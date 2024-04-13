import {
    type Atom,
    NullAtom,
    OriginComponent,
    ThrottleAtom,
    atom,
    computed,
    createCtx,
    debounce,
    extendsEvent,
    useSelect,
} from "@cn-ui/reactive";
import type { SelectOptionsType } from "@cn-ui/reactive";
import { AiOutlineCheck, AiOutlineDown, AiOutlineSearch } from "solid-icons/ai";
import { createEffect, createMemo } from "solid-js";
import { TransitionGroup } from "solid-transition-group";
import { watch } from "solidjs-use";
import { createSync } from "../../../reactive/src/atom/createSync";
import "../animation/cn-list.css";
import { Flex } from "../container";
import { type BaseFormItemType, extendsBaseFormItemProp } from "../form/BaseFormItemType";
import { Icon } from "../icon/Icon";
import { BaseInput } from "../input/BaseInput";
import { ClearControl } from "../input/utils";
import { Popover } from "../popover";
import { useFocusIn } from "../popover/composable/useFocusIn";
import { TagGroup } from "../tag/TagGroup";
import { SelectPanel } from "./SelectPanel";
import { getLabelFromOptions } from "./getLabelFromOptions";
import "./index.css";

export const SelectCtx =
    /* @__PURE__ */ createCtx<ReturnType<typeof useSelect<SelectOptionsType>>>();
export interface SelectProps extends BaseFormItemType {
    /** TODO 异步态监控 */
    options: SelectOptionsType[];
    multiple?: boolean;
    disabled?: boolean;
    disabledOptions?: string[];
    onInput?: (text: string) => void;
    filterable?: boolean;
}

/** 抽离的 input 的展示逻辑 */
const useInputSearch = (inputRef: Atom<HTMLInputElement | null>) => {
    let placeholder = "";
    const [isFocusing] = useFocusIn(inputRef);
    const whenFocus = () => {
        placeholder = inputRef()!.placeholder;
        inputRef()!.placeholder = inputRef()!.value || placeholder;
        inputRef()!.value = "";
    };
    const whenBlur = () => {
        inputRef()!.value = inputRef()!.placeholder;
        inputRef()!.placeholder = placeholder;
    };

    watch(
        isFocusing,
        debounce((val: boolean) => (val ? whenFocus() : whenBlur()), 100),
    );
    return { isFocusing };
};

export const Select = OriginComponent<SelectProps, HTMLDivElement, string[]>(
    (props) => {
        const selectSystem = useSelect(() => props.options, {
            multi: () => !!props.multiple,
        });
        // 同步 model 与选择系统的数据
        createSync(
            props.model,
            selectSystem.selectedMap,
            (modelValue) => {
                const idMap = selectSystem.optionsIdMap();
                return new Map(modelValue.map((i) => [i, idMap.get(i)!]));
            },
            (selectedMap) => {
                return [...selectedMap.keys()];
            },
        );
        createEffect(() => {
            props.disabledOptions?.forEach((id) => {
                selectSystem.disableById(id);
            });
        });
        const input = NullAtom<HTMLInputElement>(null);
        useInputSearch(input);
        const selectedText = computed(() =>
            props.multiple
                ? ""
                : selectSystem
                      .selected()
                      .map((i) => i.label)
                      .join("/"),
        );
        const inputText = atom<string>(selectedText());
        const filteredOptions = computed(() => {
            if (!inputText() || !props.filterable) {
                return props.options;
            }

            return props.options.filter((i) => getLabelFromOptions(i).includes(inputText()));
        });
        const PopoverOpen = atom(false);
        const multipleTags = ThrottleAtom(
            createMemo(() => selectSystem.selected()),
            500,
        );
        const wrapper = NullAtom<HTMLSpanElement>(null);
        return (
            <SelectCtx.Provider value={selectSystem}>
                <BaseInput
                    id={props.id}
                    v-model={inputText}
                    ref={input}
                    wrapperRef={wrapper}
                    {...extendsBaseFormItemProp(props)}
                    {...extendsEvent(props)}
                    prefixIcon={() => {
                        if (!props.multiple) return;

                        return (
                            <Flex class=" flex-nowrap gap-2" justify="start">
                                <TransitionGroup name="cn-list">
                                    <TagGroup
                                        color="#a8a8a8"
                                        v-model={multipleTags}
                                        maxSize={2}
                                        closeable
                                        onClose={(item) => {
                                            if (item.value) selectSystem.unselect(item);
                                        }}
                                    />
                                </TransitionGroup>
                            </Flex>
                        );
                    }}
                    suffixIcon={(expose) => {
                        return (
                            <>
                                <Icon>
                                    {!props.disabled && (
                                        <ClearControl
                                            {...expose}
                                            onClear={() => selectSystem.clearAll()}
                                        />
                                    )}
                                </Icon>
                                <Icon>
                                    {PopoverOpen() ? (
                                        <AiOutlineSearch color="#777" />
                                    ) : (
                                        <AiOutlineDown color="#777" />
                                    )}
                                </Icon>
                            </>
                        );
                    }}
                />
                <Popover
                    popoverTarget={wrapper()!}
                    disabled={props.disabled}
                    v-model={PopoverOpen}
                    sameWidth
                    trigger="focus"
                    content={() => (
                        <SelectPanel
                            onSelected={(item, state) => {
                                // 单选模式下，清空
                                !props.multiple &&
                                    inputText(state ? getLabelFromOptions(item) : "");
                                input()?.focus();
                            }}
                            options={filteredOptions()}
                            selectedIconSlot={(item) => {
                                return (
                                    <Icon class="w-6 flex-none px-1 text-primary-400">
                                        {selectSystem.isSelected(item!) && <AiOutlineCheck />}
                                    </Icon>
                                );
                            }}
                        />
                    )}
                />
            </SelectCtx.Provider>
        );
    },
    { modelValue: [] },
);
