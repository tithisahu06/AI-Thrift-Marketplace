import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../data/products';

const AI_FEATURES = [
  { icon: '✨', color: 'rust', title: 'Auto Listing Generator', desc: 'Upload a photo and AI writes the perfect title, description, and price suggestion in seconds.', link: '/sell', cta: 'Try it →' },
  { icon: '👗', color: 'moss', title: 'AI Outfit Stylist', desc: 'Chat with your personal AI stylist Aria for outfit recommendations, color matching, and style advice.', link: '/stylist', cta: 'Try it →' },
  { icon: '🛡️', color: 'sand', title: 'Smart Price Prediction', desc: 'AI estimates the best selling price based on brand, condition, category, and live market trends.', link: '/sell', cta: 'Learn more →' },
];

const HERO_IMGS = [
  { emoji: '🧥', label: 'Outerwear', badge: 'AI Pick', bg: '#D4BAA0' },
  { emoji: '👗', label: 'Dresses', badge: null, bg: '#B8CDB0' },
  { emoji: '👟', label: 'Sneakers', badge: 'Trending', bg: '#C8B898' },
  { emoji: '👜', label: 'Bags', badge: null, bg: '#A8B8A0' },
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeCat !== 'All') {
      list = list.filter(p =>
        (p.category || p.cat) === activeCat ||
        (activeCat === 'Vintage' && (p.ai || p.aiListed))
      );
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.title || p.name).toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.tags || []).join(' ').toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCat]);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <div className="grid grid-cols-2 min-h-[520px] overflow-hidden">
        <div className="bg-charcoal px-14 py-16 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-15 -right-15 w-70 h-70 border-[40px] border-rust/15 rounded-full" />
          <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-rust mb-5">✦ AI-Powered Sustainable Fashion</div>
          <h1 className="font-serif text-[52px] leading-[1.1] text-warm-white font-bold mb-5">
            Wear it once,<br /><em className="text-sand not-italic italic">list it twice.</em>
          </h1>
          <p className="text-[15px] text-warm-white/60 leading-relaxed max-w-[340px] mb-9">
            Discover unique pre-loved fashion with AI recommendations, instant listing generation, and your personal style assistant.
          </p>
          <div className="flex gap-3">
            <button onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary">Shop Now</button>
            <Link to="/sell" className="btn-outline no-underline">Start Selling</Link>
          </div>
        </div>

        <div className="bg-rust-light grid grid-cols-2 grid-rows-2 gap-[3px]">
          {HERO_IMGS.map((h, i) => (
            <div key={i} className="relative flex items-center justify-center min-h-[200px] overflow-hidden" style={{ background: h.bg }}>
              <span className="text-[52px]">{h.emoji}</span>
              <div className="absolute bottom-3 left-3 bg-charcoal/70 text-warm-white text-[11px] px-2.5 py-1 rounded-full font-medium">{h.label}</div>
              {h.badge && <div className="absolute top-2.5 right-2.5 bg-rust text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">{h.badge}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="bg-warm-white border-b border-black/[0.08] flex">
        {[['84K+','Active listings'],['21K+','Verified sellers'],['98%','AI accuracy'],['4.2T','CO₂g saved']].map(([n,l]) => (
          <div key={l} className="flex-1 py-5 text-center border-r border-black/[0.08] last:border-r-0">
            <span className="font-serif text-[26px] font-bold text-charcoal block">{n}</span>
            <div className="text-xs text-muted mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div className="px-8 pt-8 pb-0 flex gap-3 items-center">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-base">🔍</span>
          <input
            className="w-full h-12 bg-warm-white border border-black/[0.1] rounded-full pl-11 pr-4 font-sans text-[14px] text-charcoal outline-none focus:border-rust transition-colors placeholder:text-muted"
            placeholder="Search 'vintage levi jacket' or describe an outfit…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="h-12 px-5 bg-warm-white border border-black/[0.1] rounded-full font-sans text-[13px] text-charcoal cursor-pointer flex items-center gap-2 hover:border-rust transition-colors">
          ⚙️ Filters
        </button>
        <Link to="/stylist" className="h-12 px-5 bg-charcoal border-none rounded-full font-sans text-[13px] text-warm-white cursor-pointer flex items-center gap-2 hover:bg-rust transition-colors no-underline">
          🪡 Ask AI Stylist
        </Link>
      </div>

      {/* CATEGORIES */}
      <div className="px-8 py-6">
        <div className="flex justify-between items-baseline mb-5">
          <div className="section-title">Browse <span>Categories</span></div>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className={`cat-pill ${activeCat === cat ? 'active' : ''}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="px-8 pb-8" id="products-section">
        <div className="flex justify-between items-baseline mb-5">
          <div className="section-title">Featured <span>Finds</span></div>
          <span className="text-[13px] text-muted cursor-pointer hover:text-rust">View all →</span>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {filtered.map(p => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-muted">
            <div className="text-5xl mb-3">🔍</div>
            <div className="text-[15px]">No items found for "{search}"</div>
          </div>
        )}
      </div>

      {/* AI FEATURES */}
      <div className="px-8 pb-2">
        <div className="section-title mb-4">Powered by <span>AI</span></div>
      </div>
      <div className="grid grid-cols-3 gap-4 px-8 pb-8">
        {AI_FEATURES.map(f => (
          <Link key={f.title} to={f.link} className="no-underline">
            <div className="bg-warm-white border border-black/[0.08] rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-rust relative overflow-hidden">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3.5
                ${f.color === 'rust' ? 'bg-rust-light' : f.color === 'moss' ? 'bg-moss-light' : 'bg-[#EDE0C4]'}`}>
                {f.icon}
              </div>
              <div className="text-[14px] font-semibold text-charcoal mb-1.5">{f.title}</div>
              <div className="text-[12.5px] text-muted leading-relaxed">{f.desc}</div>
              <div className="mt-3.5 text-[12px] font-medium text-rust flex items-center gap-1">{f.cta}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ECO BANNER */}
      <div className="px-8 pb-8">
        <div className="bg-moss text-warm-white rounded-2xl p-5 px-6 flex items-center gap-5">
          <div className="text-[28px] flex-shrink-0">🌿</div>
          <div>
            <div className="font-serif text-[17px] font-bold mb-0.5">Your Impact on the Planet</div>
            <div className="text-[13px] opacity-75">Every second-hand purchase saves resources and reduces fashion waste.</div>
          </div>
          <div className="flex gap-6 ml-auto">
            {[['3.2kg','CO₂ saved'],['2000L','Water saved'],['7','Items recycled']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="font-serif text-[22px] font-bold">{n}</div>
                <div className="text-[10px] opacity-65 uppercase tracking-wide">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
