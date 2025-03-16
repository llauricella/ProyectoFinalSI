import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserProvider} from "../Context/UserContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <App/>
    </UserProvider>
  </StrictMode>,
)
