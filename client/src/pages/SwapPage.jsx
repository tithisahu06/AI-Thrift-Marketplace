import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, CAT_EMOJI, formatPrice } from '../data/products';
import toast from 'react-hot-toast';

const swapItems = PRODUCTS.filter(p => p.type === 'swap');
const allItems = PRODUCTS.filter(p => p.type === 'sell');

export default function SwapPage() {
  const { addToCart } = useCart();
  const [proposed, setProposed] = useState(null);
  const [requests, setRequests] = useState([]);

  const proposeSwap = (item) => {
    toast.success(`🔄 Swap request sent for "${item.title || item.name}"!`);
    setRequests(p => [...p, { id: Date.now(), item, status: 'pending' }]);
  };

  return (
    <div className="p-8 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-rust mb-2">✦ Outfit Swap</div>
        <div className="section-title mb-2">Swap <span>Outfits</span></div>
        <p className="text-[14px] text-muted max-w-xl">Exchange clothes with other users instead of buying new. Propose a swap on any listing and negotiate directly with the seller.</p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon:'📸', step:'1', title:'Browse Swap Listings', desc:'Find items marked with 🔄 Swap tag — sellers open to exchanging.' },
          { icon:'🤝', step:'2', title:'Propose Your Item', desc:'Select something from your wardrobe that you want to offer in exchange.' },
          { icon:'✅', step:'3', title:'Agree & Exchange', desc:'Chat with the seller, agree on terms, and ship your items to each other.' },
        ].map(s=>(
          <div key={s.step} className="bg-warm-white border border-black/[0.08] rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-rust-light flex items-center justify-center text-xl mb-4">{s.icon}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-rust mb-1">Step {s.step}</div>
            <div className="text-[14px] font-semibold text-charcoal mb-1.5">{s.title}</div>
            <div className="text-[12.5px] text-muted leading-relaxed">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Swap listings */}
      <div className="section-title mb-5">Available for <span>Swap</span></div>
      {swapItems.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 mb-10">
          {swapItems.map(p=>{
            const name=p.title||p.name;
            const img=p.images?.[0]||p.image;
            return (
              <div key={p._id||p.id} className="bg-warm-white border border-black/[0.08] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200">
                <div className="aspect-[3/4] relative overflow-hidden bg-cream flex items-center justify-center">
                  {img ? <img src={img} alt={name} className="w-full h-full object-cover"/> : <span className="text-5xl">{CAT_EMOJI[p.category||p.cat]||'👔'}</span>}
                  <div className="absolute top-2.5 left-2.5 bg-moss text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">🔄 Swap</div>
                </div>
                <div className="p-3.5">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-muted mb-1">{p.brand}</div>
                  <div className="text-[13.5px] font-medium text-charcoal mb-1">{name}</div>
                  <div className="text-[12px] text-muted mb-3">Est. value: <span className="font-semibold text-charcoal">{formatPrice(p.price)}</span></div>
                  <button onClick={()=>proposeSwap(p)} className="w-full py-2 bg-moss text-white rounded-lg text-[12px] font-medium border-none cursor-pointer hover:bg-moss/80 transition-colors">
                    🤝 Propose Swap
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted">
          <div className="text-5xl mb-3">🔄</div>
          <div className="text-[15px]">No swap listings yet. Be the first!</div>
        </div>
      )}

      {/* Pending requests */}
      {requests.length > 0 && (
        <div>
          <div className="section-title mb-4">Your Swap <span>Requests</span></div>
          <div className="flex flex-col gap-3">
            {requests.map(r=>(
              <div key={r.id} className="bg-warm-white border border-black/[0.08] rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-14 rounded-lg overflow-hidden bg-cream flex items-center justify-center flex-shrink-0">
                  {r.item.images?.[0]||r.item.image
                    ? <img src={r.item.images?.[0]||r.item.image} className="w-full h-full object-cover" alt=""/>
                    : <span className="text-2xl">{CAT_EMOJI[r.item.category]||'👔'}</span>}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-charcoal">{r.item.title||r.item.name}</div>
                  <div className="text-[11px] text-muted">{r.item.brand} • {formatPrice(r.item.price)}</div>
                </div>
                <div className="text-[11px] px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-semibold">⏳ Pending</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
