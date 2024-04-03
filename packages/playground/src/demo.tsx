import { render } from 'solid-js/web'
import { Preview } from '.'
import 'virtual:uno.css'
const App = () => {
    return <Preview code="/public/init.ts"></Preview>
}
render(App, document.body)
