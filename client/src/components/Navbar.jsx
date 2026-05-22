import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishCount } = useWishlist();
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showCart, setShowCart] = useState(false);

  const links = [
    { to: '/', label: 'Discover' },
    { to: '/sell', label: 'Sell' },
    { to: '/swap', label: 'Swap' },
    { to: '/stylist', label: 'AI Stylist' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  const openLogin = () => { setAuthMode('login'); setShowAuth(true); };
  const openSignup = () => { setAuthMode('signup'); setShowAuth(true); };

  return (
    <>
      <nav className="sticky top-0 z-[200] h-16 bg-warm-white border-b border-black/[0.08] flex items-center px-8 gap-0">
        {/* Logo */}
        <Link to="/" className="font-serif text-[22px] font-bold text-charcoal tracking-tight mr-auto flex items-center gap-1.5 no-underline">
          Wear<span className="text-rust">AI</span>
          <span className="w-2 h-2 bg-rust rounded-full mt-0.5" />
        </Link>

        {/* Nav links */}
        <div className="flex gap-7 items-center">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-[13.5px] cursor-pointer transition-colors duration-200 no-underline relative
                ${location.pathname === l.to
                  ? 'text-charcoal font-medium after:content-[""] after:absolute after:bottom-[-22px] after:left-0 after:right-0 after:h-0.5 after:bg-rust after:rounded-t'
                  : 'text-muted hover:text-charcoal font-normal'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 items-center ml-8">
          {/* Wishlist */}
          <Link to="/wishlist" className="w-9 h-9 rounded-full bg-cream border border-black/[0.08] flex items-center justify-center cursor-pointer text-muted hover:bg-sand hover:text-charcoal transition-colors duration-200 relative no-underline">
            ♡
            {wishCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rust text-white text-[9px] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button onClick={() => setShowCart(true)} className="w-9 h-9 rounded-full bg-cream border border-black/[0.08] flex items-center justify-center cursor-pointer text-muted hover:bg-sand hover:text-charcoal transition-colors duration-200 relative">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rust text-white text-[9px] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={logout}>
              <div className="w-8 h-8 rounded-full bg-rust text-white flex items-center justify-center text-[13px] font-bold">
                {user.initials || user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-[13px] text-charcoal font-medium">{user.name?.split(' ')[0]}</span>
            </div>
          ) : (
            <button onClick={openLogin} className="bg-charcoal text-warm-white font-sans text-[13px] font-medium rounded-full px-5 py-2 border-none cursor-pointer transition-colors duration-200 hover:bg-rust">
              Sign In
            </button>
          )}

          <Link to="/sell" className="bg-rust text-warm-white font-sans text-[13px] font-medium rounded-full px-5 py-2 no-underline transition-colors duration-200 hover:bg-rust-dark">
            + List Item
          </Link>
        </div>
      </nav>

      {showAuth && <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onSwitch={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} />}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
    </>
  );
}
