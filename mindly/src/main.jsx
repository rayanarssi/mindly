import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ChakraProvider,
  defaultSystem,
  Toaster,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastCloseTrigger,
} from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { toaster } from './library/toaster'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <App />
        <Toaster toaster={toaster}>
          {(toast) => (
            <ToastRoot w="400px" p={4} bg="#472c1b" color="#fefae0">
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
              <ToastCloseTrigger color="#fefae0" />
            </ToastRoot>
          )}
        </Toaster>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)
