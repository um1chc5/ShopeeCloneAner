import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from 'src/App'
import { ReactNode } from 'react'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      },
      mutations: {
        retry: false
      }
    }
    // logger: {
    //   log: console.log,
    //   warn: console.warn,
    //   error: () => null
    // }
  })
  const Provider = ({ children }: { children: ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  return Provider
}

export const renderWithRouter = ({ route = '/' } = {}) => {
  window.history.pushState({}, 'Test Page', route)
  const Provider = createWrapper()
  return render(
    <Provider>
      <App />
    </Provider>,
    { wrapper: BrowserRouter }
  )
}
