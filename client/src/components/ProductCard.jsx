import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CAT_EMOJI, formatPrice } from '../data/products';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWish, isWished } = useWishlist();

  const id = product._id || product.id;
  const name = product.title || product.name;
  const img = product.images?.[0] || product.image;
  const cond = product.condition || product.cond;
  const wished = isWished(id);

  return (
    <div className="bg-warm-white border border-black/[0.08] rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover relative group">
      {/* Image */}
      <div className="aspect-[3/4] relative overflow-hidden bg-cream flex items-center justify-center">
        {img ? (
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <span
          className="text-5xl items-center justify-center"
          style={{ display: img ? 'none' : 'flex' }}
        >
          {CAT_EMOJI[product.category || product.cat] || '👔'}
        </span>

        {/* Wishlist button */}
        <button
          onClick={e => { e.stopPropagation(); toggleWish(product); }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-warm-white/90 border-none 
                      flex items-center justify-center text-sm cursor-pointer transition-all duration-150 z-10
                      hover:scale-110 ${wished ? 'text-red-500' : 'text-muted'}`}
          title="Wishlist"
        >
          {wished ? '♥' : '♡'}
        </button>

        {/* AI badge */}
        {(product.ai || product.aiListed) && (
          <div className="absolute bottom-2.5 left-2.5 bg-charcoal/75 text-warm-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
            ✨ AI Listed
          </div>
        )}

        {/* Swap badge */}
        {product.type === 'swap' && (
          <div className="absolute top-2.5 left-2.5 bg-moss text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
            🔄 Swap
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 pb-3.5">
        <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-muted mb-1">{product.brand}</div>
        <div className="text-[13.5px] font-medium text-charcoal mb-1.5 leading-snug line-clamp-2">{name}</div>
        <div className="flex justify-between items-center mb-2.5">
          <div className="font-serif text-[17px] font-bold text-charcoal">{formatPrice(product.price)}</div>
          <div className={`text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full 
                          ${cond === 'Fair' ? 'bg-amber-100 text-amber-800' : 'bg-moss-light text-moss'}`}>
            {cond}
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); addToCart(product); }}
          className="w-full py-2 bg-charcoal text-warm-white rounded-lg text-xs font-medium 
                     cursor-pointer transition-colors duration-200 hover:bg-rust"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}
