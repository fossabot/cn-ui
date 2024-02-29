import { OriginComponent } from '@cn-ui/reactive'
import { CheckboxGroup } from './CheckboxGroup'
import { CheckboxProps } from './Checkbox'

export const FormRadio = OriginComponent<{ options: CheckboxProps[] }, HTMLDivElement, string | null>((props) => {
    const model = props.model.reflux(props.model() ? [props.model()!] : ([] as string[]), (i) => (i ? i[0] : null))
    return <CheckboxGroup options={props.options} v-model={model} multiple={false}></CheckboxGroup>
})
