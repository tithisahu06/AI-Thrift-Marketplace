import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  return (
    <div className="p-8 min-h-[calc(100vh-64px)]">
      <div className="flex justify-between items-baseline mb-6">
        <div className="section-title">My <span>Wishlist</span></div>
        <Link to="/" className="text-[13px] text-muted hover:text-rust no-underline">← Back to Discover</Link>
      </div>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {wishlist.map(p=><ProductCard key={p._id||p.id} product={p}/>)}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-[64px] mb-5">♡</div>
          <div className="font-serif text-[22px] font-bold text-charcoal mb-2">Your wishlist is empty</div>
          <div className="text-[14px] text-muted mb-6">Save items you love by clicking the heart icon on any product.</div>
          <Link to="/" className="inline-block px-7 py-3 bg-rust text-white rounded-full font-sans text-[14px] font-medium no-underline hover:bg-rust-dark transition-colors">Start Exploring</Link>
        </div>
      )}
    </div>
  );
}
