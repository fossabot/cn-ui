import fs from "node:fs";

export const createSourceCode = (imports, options) => {
    fs.writeFileSync(
        `./temp/${imports[0]}.ts`,
        `import { ${imports.join(", ")} } from '@cn-ui/core';\n console.log(${imports.join(", ")})`,
    );
};

// 将需要分析的组件放置在这里
[
    ["Avatar"],
    ["Button"],
    ["Checkbox"],
    ["CheckboxGroup"],
    ["Collapse"],
    ["Flex"],
    ["Container", "Main", "Header", "Aside", "Footer", "Center"],
    ["DatePicker"],
    ["Dialog"],
    // Extra
    ["SortableList"],

    ["FloatingButton"],
    ["MagicForm"],
    ["GroupList"],
    ["Icon"],
    ["Image"],
    ["BaseInput"],
    ["InputNumber"],
    ["LazyLoad"],
    ["Loading"],
    ["Message"],
    ["Alert"],
    ["Modal"],
    ["Pagination"],
    ["PickerColumn"],
    ["AddressPicker"],
    ["Popover"],
    ["Row", "Col"],
    ["Select"],
    ["Splitter"],
    ["MagicTable"],
    ["Tabs"],
    ["Tag", "TagGroup"],
    ["TOC"],
    ["Typography"],
    ["VirtualList"],
    ["VirtualGrid"],
    ["WaterFall"],
].forEach((i) => {
    createSourceCode(i);
});
