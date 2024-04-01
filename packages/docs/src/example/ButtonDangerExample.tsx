import { Button } from '@cn-ui/core'

export const ButtonDangerExample = () => {
    return (
        <div>
            <div class="mb-4 flex gap-4">
                <Button danger type="primary">
                    Primary
                </Button>
                <Button danger>Default</Button>
                <Button danger type="dashed">
                    Dash
                </Button>
                <Button danger type="text">
                    Text
                </Button>
                <Button danger type="link">
                    Link
                </Button>
            </div>
            <div class="mb-4 flex gap-4">
                <Button danger disabled type="primary">
                    Primary
                </Button>
                <Button danger disabled>
                    Default
                </Button>
                <Button danger disabled type="dashed">
                    Dash
                </Button>
                <Button danger disabled type="text">
                    Text
                </Button>
                <Button danger disabled type="link">
                    Link
                </Button>
            </div>
        </div>
    )
}
