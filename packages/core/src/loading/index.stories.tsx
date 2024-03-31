import type { Meta, StoryObj } from 'storybook-solidjs'

import { Loading } from './index'
import { AC, DefineAC, ensureOnlyChild, resource, sleep } from '@cn-ui/reactive'
import { defineExampleAC } from '../lazyLoad/example/defineExampleAC'

const meta = {
    title: 'Utils/Loading',
    component: Loading,
    argTypes: {}
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

defineExampleAC()
DefineAC({
    loading: (state, rendering) => {
        const child = ensureOnlyChild(() => rendering)
        return <Loading portalled el={child}></Loading>
    }
})

import { Col, Row } from '../RowAndCol'
import { For } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Button } from '../button'
import SpinnerNames from '@cn-ui/svg-spinner/dist/svg-spinner.exports.json'
import * as Spinners from '@cn-ui/svg-spinner'
/**  */
export const Primary: Story = {
    name: 'Loading 加载组件',
    render() {
        const res = resource(() => new Promise((resolve) => {}))
        return (
            <Row gutter="8px">
                <For each={SpinnerNames}>
                    {(item) => {
                        return (
                            <Col span={4}>
                                <AC
                                    resource={res}
                                    loading={(state, rendering) => {
                                        const child = ensureOnlyChild(() => rendering)
                                        return (
                                            <Loading portalled el={child}>
                                                <Dynamic
                                                    component={Spinners[item]}
                                                    height="64"
                                                    width="64"
                                                    class="fill-primary-400 stroke-primary-400"
                                                ></Dynamic>
                                            </Loading>
                                        )
                                    }}
                                    fallback={() => {
                                        return <div class="h-32 w-full">{item}</div>
                                    }}
                                >
                                    {() => <div class="h-32">129032</div>}
                                </AC>
                            </Col>
                        )
                    }}
                </For>
            </Row>
        )
    },
    args: {}
}

export const Floating: Story = {
    name: 'Floating 浮动加载层',
    render() {
        const res = resource(() => sleep(1000, Math.random()), { initValue: Math.random() })
        return (
            <div class="h-screen">
                <Button onclick={() => res.refetch()}>refetch</Button>
                {/*  keepLastState must render success */}
                <AC
                    resource={res}
                    keepLastState
                    loading={(state, rendering) => {
                        const child = ensureOnlyChild(() => rendering)
                        return <Loading portalled el={child}></Loading>
                    }}
                >
                    {() => {
                        return <div class="h-full">{res()}</div>
                    }}
                </AC>
            </div>
        )
    },
    args: {}
}
