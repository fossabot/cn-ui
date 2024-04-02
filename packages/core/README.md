# Creative Nature UI

CN-UI 是一个 Solid-js 组件库, [Storybook](https://cn-ui.netlify.app/)

```sh
npm i @cn-ui/core
pnpm i @cn-ui/core
```

```js
// entry
import '@cn-ui/core/dist/cn-uno.css'
import '@cn-ui/core/dist/esm/style.css'
```

```tsx
import { Button } from '@cn-ui/core'
export const MyComponent = () => {
    return <Button></Button>
}
```

## SSR Support

```diff
// vite.config.js
+ {
+       ssr: {
+           noExternal: ['solid-icons', '@popperjs/core'],
+           resolve: {
+               externalConditions: ['solid', 'module']
+           }
+       }
+   }
```
