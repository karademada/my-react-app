import * as ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { store } from './store'
import App from './App'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root container not found')

const root = ReactDOM.createRoot(container)

root.render(
  <Provider store={store}>
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>
  </Provider>,
)
