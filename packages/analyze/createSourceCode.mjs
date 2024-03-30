import fs from 'fs'

export const createSourceCode = (imports, options) => {
    fs.writeFileSync(`./temp/${imports[0]}.ts`, `import { ${imports.join(', ')} } from '@cn-ui/core';\n console.log(${imports.join(', ')})`)
};

// 将需要分析的组件放置在这里
[
    ['Avatar'],
    ['Button'],
    ['Checkbox'],
    ['CheckboxGroup'], // TODO
    ['Collapse'],// TODO
    ['Flex'],
    ['Container', 'Main', "Header", 'Aside', 'Footer', 'Center'],
    ['DatePicker'], // TODO
    ['Dialog'],
    // Extra
    ['SortableList'],

    ['FloatingButton'],
    ['MagicForm'],
    ['GroupList'],// TODO
    ['Icon'],
    ['Image'],
    ['BaseInput'],
    ['InputNumber'],// TODO
    ['LazyLoad'],
    ['Loading'],
    ['Message'],
    ['Alert'],
    ['Modal'],
    ['Pagination'],
    ['PickerColumn'],
    ['AddressPicker'],
    ['Popover'],// TODO
    ['Row', "Col"],
    ['Select'],// TODO
    ['Splitter'],
    ['MagicTable'],// TODO
    ['Tabs', "Tab"],
    ['Tag', "TagGroup"],
    ['TOC'],
    ['Typography'],
    ['VirtualList'],
    ['VirtualGrid'],
    ['WaterFall'],
].forEach(i => { createSourceCode(i) })