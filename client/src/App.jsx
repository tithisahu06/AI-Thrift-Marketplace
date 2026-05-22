import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SellPage from './pages/SellPage';
import StylistPage from './pages/StylistPage';
import DashboardPage from './pages/DashboardPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import SwapPage from './pages/SwapPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-cream">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sell" element={<SellPage />} />
                <Route path="/stylist" element={<StylistPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/swap" element={<SwapPage />} />
              </Routes>
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1C1916',
                  color: '#FDFAF5',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: '500',
                  borderLeft: '3px solid #C4622D',
                  padding: '12px 20px',
                },
                success: { iconTheme: { primary: '#4A5D3C', secondary: '#FDFAF5' } },
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
