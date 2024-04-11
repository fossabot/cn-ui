import { AiOutlineLoading3Quarters } from 'solid-icons/ai'
import { Icon } from '../icon/Icon'
import '../animation/spin.css'
import { ComponentSlots } from '@cn-ui/reactive'

export const ButtonSlots = new ComponentSlots('Button', {
    loadingIcon: () => {
        return (
            <Icon class="pr-1">
                <AiOutlineLoading3Quarters class=" cn-animate-spin"></AiOutlineLoading3Quarters>
            </Icon>
        )
    }
})
