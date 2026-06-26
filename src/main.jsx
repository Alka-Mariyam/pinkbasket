import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

import { ThemeProvider } from './context/ThemeContext'
import { UserProvider } from './context/UserContext'
import { ShopProvider } from './context/ShopContext'
import { CartProvider } from './context/CartContext'
import WishlistProvider from './context/WishlistContext'

import { ManagerProvider } from './context/ManagerContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ManagerProvider>
          <ShopProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </ShopProvider>
        </ManagerProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
