import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CAT_EMOJI, formatPrice } from '../data/products';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, removeFromCart, cartTotal } = useCart();
  const shipping = 49;
  const fee = Math.round(cartTotal * 0.035);
  const total = cartTotal + fee + shipping;

  if (!cart.length) return (
    <div className="text-center py-24 min-h-[calc(100vh-64px)]">
      <div className="text-[64px] mb-5">🛒</div>
      <div className="font-serif text-[22px] font-bold text-charcoal mb-2">Your cart is empty</div>
      <div className="text-[14px] text-muted mb-6">Add some items to get started!</div>
      <Link to="/" className="inline-block px-7 py-3 bg-rust text-white rounded-full font-sans text-[14px] font-medium no-underline hover:bg-rust-dark transition-colors">Start Shopping</Link>
    </div>
  );

  return (
    <div className="p-8 min-h-[calc(100vh-64px)]">
      <div className="flex justify-between items-baseline mb-6">
        <div className="section-title">Shopping <span>Cart</span></div>
        <Link to="/" className="text-[13px] text-muted hover:text-rust no-underline">← Continue Shopping</Link>
      </div>
      <div className="grid grid-cols-[1fr_380px] gap-6 items-start">
        {/* Items */}
        <div className="bg-warm-white border border-black/[0.08] rounded-2xl overflow-hidden">
          {cart.map(({product,qty})=>{
            const id=product._id||product.id;
            const name=product.title||product.name;
            const img=product.images?.[0]||product.image;
            return (
              <div key={id} className="flex gap-4 p-5 border-b border-black/[0.06] last:border-b-0 items-center">
                <div className="w-20 h-[100px] rounded-xl overflow-hidden bg-cream flex-shrink-0 flex items-center justify-center">
                  {img ? <img src={img} alt={name} className="w-full h-full object-cover" onError={e=>e.target.style.display='none'}/> : <span className="text-3xl">{CAT_EMOJI[product.category||product.cat]||'👔'}</span>}
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-muted mb-0.5">{product.brand}</div>
                  <div className="text-[14px] font-medium text-charcoal mb-1">{name}</div>
                  <div className="text-[11px] text-muted">{product.condition||product.cond} • Qty: {qty}</div>
                </div>
                <div className="font-serif text-[18px] font-bold text-charcoal flex-shrink-0">{formatPrice(product.price)}</div>
                <button onClick={()=>removeFromCart(id)} className="text-muted hover:text-red-500 transition-colors text-[18px] border-none bg-transparent cursor-pointer p-1">🗑</button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-warm-white border border-black/[0.08] rounded-2xl p-6 sticky top-[84px]">
          <div className="font-serif text-[18px] font-bold mb-4.5">Order Summary</div>
          {[
            [`Subtotal (${cart.reduce((s,c)=>s+c.qty,0)} items)`, formatPrice(cartTotal)],
            ['Platform fee (3.5%)', formatPrice(fee)],
            ['Shipping', formatPrice(shipping)],
          ].map(([l,v])=>(
            <div key={l} className="flex justify-between text-[13.5px] mb-2.5"><span>{l}</span><span>{v}</span></div>
          ))}
          <div className="flex justify-between font-bold text-[16px] pt-3 border-t border-black/[0.08] mt-3 mb-4">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <button onClick={()=>toast.success('🎉 Order placed! Thank you!')} className="w-full py-3.5 bg-charcoal text-warm-white rounded-xl font-sans text-[14px] font-semibold border-none cursor-pointer transition-colors hover:bg-rust">
            Proceed to Checkout →
          </button>
          <div className="text-center mt-3 text-[12px] text-muted">🔒 Secure checkout • Free returns</div>
        </div>
      </div>
    </div>
  );
}
