import { OriginComponent } from '@cn-ui/reactive'

import { Cascader, CascaderProps } from './index'
import { CommonGroupListConfig } from '../groupList'

export const FormCascader = OriginComponent<CascaderProps, HTMLDivElement, CommonGroupListConfig[] | null>((props) => {
    const model = props.model.reflux(props.model() ?? [], (i) => i)

    return <Cascader {...(props as any)} v-model={model}></Cascader>
})