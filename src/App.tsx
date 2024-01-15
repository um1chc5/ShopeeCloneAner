import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useRouteElement from './useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppProvider } from './Context/App.context'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'

function App() {
  const routeElement = useRouteElement()
  return (
    <HelmetProvider>
      <AppProvider>
        {routeElement}
        <ToastContainer position='top-center' autoClose={1000} />
      </AppProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </HelmetProvider>
  )
}

export default App
