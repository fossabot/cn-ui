import { NullAtom, OriginComponent, OriginDiv, computed } from "@cn-ui/reactive";
import type { SelectOptionsType } from "@cn-ui/reactive";
import { SelectableList, type SelectableListExpose } from "@cn-ui/reactive";
import { firstClass } from "@cn-ui/reactive";
import { AiOutlineClose, AiOutlinePlus } from "solid-icons/ai";
import { Icon } from "../icon";

export const Tabs = OriginComponent<
    {
        options: SelectOptionsType[];
    },
    HTMLDivElement,
    SelectOptionsType
>((props) => {
    const options = computed(() => props.options);
    const selectableList = NullAtom<SelectableListExpose>(null);
    return (
        <OriginDiv prop={props} class="flex gap-2">
            <SelectableList options={options}>
                {(_, selectItem, { index, dynamicList }) => {
                    return (
                        <button
                            class={firstClass.base("px-2 transition-colors")(
                                selectItem.isSelected() &&
                                    "bg-primary-500 hover:bg-primary-600 text-design-pure ",
                                selectItem.isDisabled() && "opacity-50 cursor-pointer",
                                "hover:bg-gray-100",
                            )}
                            onclick={selectItem.selectHandle}
                        >
                            {selectItem.label()}
                            <Icon
                                onclick={() => {
                                    dynamicList.remove(index());
                                }}
                            >
                                <AiOutlineClose />
                            </Icon>
                        </button>
                    );
                }}
            </SelectableList>
            <button
                class={firstClass.base("px-2 transition-colors")(
                    // selectItem.isDisabled() && 'opacity-50 cursor-pointer',
                    "hover:bg-gray-100",
                )}
                onclick={() => {
                    const str = prompt("i9fid9");
                    selectableList()!.dynamicList.updateList((list) =>
                        list.push({ label: str!, value: str! }),
                    );
                }}
            >
                <Icon>
                    <AiOutlinePlus />
                </Icon>
            </button>
        </OriginDiv>
    );
});
