import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CAT_EMOJI, formatPrice } from '../data/products';

export default function CartDrawer({ onClose }) {
  const { cart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-charcoal/55 z-[500] flex items-center justify-center backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-warm-white rounded-[20px] p-9 w-full max-w-[500px] relative shadow-modal animate-scale-in max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 bg-cream border-none rounded-full w-[30px] h-[30px] cursor-pointer text-muted flex items-center justify-center text-base hover:text-charcoal">✕</button>
        <div className="font-serif text-[22px] font-bold mb-5">🛒 Your Cart</div>

        {cart.length === 0 ? (
          <div className="text-center py-10 text-muted">
            <div className="text-5xl mb-3">🛒</div>
            <div className="text-[14px]">Your cart is empty</div>
          </div>
        ) : (
          <>
            {cart.map(({ product, qty }) => {
              const id = product._id || product.id;
              const name = product.title || product.name;
              const img = product.images?.[0] || product.image;
              return (
                <div key={id} className="flex gap-4 py-3 border-b border-black/[0.08] items-center">
                  <div className="w-[60px] h-[75px] rounded-lg overflow-hidden bg-cream flex-shrink-0 flex items-center justify-center">
                    {img
                      ? <img src={img} alt={name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                      : <span className="text-2xl">{CAT_EMOJI[product.category || product.cat] || '👔'}</span>
                    }
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-muted">{product.brand}</div>
                    <div className="text-[13px] font-medium text-charcoal">{name}</div>
                    <div className="text-[11px] text-muted">Qty: {qty}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-serif text-[16px] font-bold">{formatPrice(product.price)}</div>
                    <button onClick={() => removeFromCart(id)} className="text-muted hover:text-red-500 transition-colors text-base border-none bg-none cursor-pointer">✕</button>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 border-t border-black/[0.08] mt-1">
              <div className="flex justify-between font-bold text-[16px] mb-4">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <button
                onClick={() => { onClose(); navigate('/cart'); }}
                className="w-full py-3.5 bg-charcoal text-warm-white rounded-xl font-sans text-[14px] font-semibold cursor-pointer transition-colors hover:bg-rust"
              >
                View Cart & Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
