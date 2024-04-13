import type { SelectOptionsType, SelectSystem } from "./useSelect";

export const useSelectItem = (
    selectSystem: SelectSystem<SelectOptionsType>,
    item: SelectOptionsType,
) => {
    return {
        label: () => item.label ?? item.value,
        selectHandle() {
            selectSystem.select(item);
        },
        isSelected() {
            return selectSystem.isSelected(item);
        },
        isDisabled() {
            return selectSystem.isDisabled(item);
        },
    };
};
