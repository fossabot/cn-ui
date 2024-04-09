/**
 * switch 的 DOM 结构版，可以方便地组合多种状态的 class 生成器
 * @example
 * // 设定基础状态
 * firstClass.base('px-2 transition-colors')(
 *      // 选中状态，一旦这个返回为 true，那么下面的值将不会被采用
 *     selectItem.isSelected() && 'bg-primary-500 hover:bg-primary-600 text-design-pure ',
 *     selectItem.isDisabled() && 'opacity-50 cursor-pointer',
 *     'hover:bg-gray-100'
 * )
 */
export const firstClass = (...args: (string | void | false)[]) => {
    return args.find((i) => i) as string | undefined
}
firstClass.base = (base: string) => {
    return (...args: (string | void | false)[]): string => base + ' ' + (firstClass(...args) || '')
}