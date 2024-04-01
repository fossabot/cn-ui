import { Button } from '@cn-ui/core'

export const ButtonExample = () => {
    return (
        <div>
            <div class="mb-4 flex gap-4">
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dash</Button>
                <Button type="text">Text</Button>
                <Button type="link">Link</Button>
            </div>
            <div class="mb-4 flex gap-4">
                <Button disabled type="primary">
                    Primary
                </Button>
                <Button disabled>Default</Button>
                <Button disabled type="dashed">
                    Dash
                </Button>
                <Button disabled type="text">
                    Text
                </Button>
                <Button disabled type="link">
                    Link
                </Button>
            </div>
        </div>
    )
}
