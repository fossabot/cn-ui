---
title: "2024 年第一里程碑"
description: "Lorem ipsum dolor sit amet"
pubDate: "2024/4/2"
---

# 2024 年第一里程碑

## 目标

在这个里程碑中，CN-UI 的目标是：

-   [x] 新版本支持绝大多数 Ant Design 同类型的组件

-   [ ] 优化所有组件导出大小

    -   [ ] Ark-ui 提供的 datePicker 非常庞大，需要重构至 80 kB 以下
    -   [ ] MagicTable 在虚拟渲染时有内存泄漏现象
    -   [ ] MagicTable 支持原生模式

-   [ ] 绝大多数组件支持 Astro 的 SSR 模式渲染

    -   [ ] Popover 原始状态为 true，在未水合时，位置为左上角遮蔽了对象
    -   [ ] MagicTable 在虚拟状态下不支持 SSR

-   [ ] 编写绝大多数组件库文档，树立文档规范
    -   [ ] Button
    -   [ ] Popover
    -   [ ] MagicTable
