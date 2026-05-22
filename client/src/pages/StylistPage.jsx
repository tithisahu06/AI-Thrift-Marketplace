import { useState, useRef, useEffect } from 'react';
import { aiChat } from '../services/api';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';

const INIT_MSGS = [
  { role:'model', content:"Hi! I'm Aria, your personal AI stylist. Tell me about your style, an occasion, or ask me to build an outfit! ✨" },
  { role:'user', content:"I need an outfit for a college hangout in summer" },
  { role:'model', content:"Love that! For a summer college hangout, I'd suggest a relaxed, put-together look. Check out these picks from the marketplace 👉" },
];

const STYLE_OPTS = ['Casual','Streetwear','Bohemian','Minimalist','Y2K','Cottagecore','Dark Academia','Preppy','Vintage 90s'];

export default function StylistPage() {
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStyles, setActiveStyles] = useState(['Casual','Minimalist']);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  const sendChat = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    const newMsgs = [...msgs, { role:'user', content: msg }];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      const history = newMsgs.slice(0,-1).map(m => ({ role: m.role === 'model' ? 'model' : 'user', content: m.content }));
      const { data } = await aiChat({ message: msg, history });
      setMsgs(p => [...p, { role:'model', content: data.reply }]);
    } catch {
      setMsgs(p => [...p, { role:'model', content:"I'm having a moment — try again shortly! Meanwhile check out our trending picks. ✨" }]);
    } finally { setLoading(false); }
  };

  const toggleStyle = (s) => setActiveStyles(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);

  const outfitProducts = PRODUCTS.slice(0,6);

  return (
    <div className="grid grid-cols-[340px_1fr] h-[calc(100vh-64px)]">
      {/* SIDEBAR */}
      <div className="bg-charcoal flex flex-col overflow-hidden">
        <div className="p-6 border-b border-warm-white/8 flex-shrink-0">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-[38px] h-[38px] rounded-full bg-rust flex items-center justify-center text-base flex-shrink-0">🪡</div>
            <div>
              <div className="font-serif text-[16px] text-warm-white font-bold">Aria — AI Stylist</div>
              <div className="text-[11px] text-rust flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-rust rounded-full inline-block"/>Online now
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 chat-scroll">
          {msgs.map((m,i) => (
            <div key={i} className={`max-w-[90%] ${m.role==='user'?'self-end':''}`}>
              <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-snug
                ${m.role==='user'
                  ? 'bg-rust text-warm-white rounded-br-sm'
                  : 'bg-warm-white/7 text-warm-white/85 rounded-tl-sm'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="max-w-[90%]">
              <div className="bg-warm-white/7 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                {[0,1,2].map(i=><span key={i} className="inline-block w-1.5 h-1.5 rounded-full bg-warm-white/40 animate-bounce-dot" style={{animationDelay:`${i*0.2}s`}}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div className="p-3.5 border-t border-warm-white/8 flex gap-2 flex-shrink-0">
          <input
            className="flex-1 px-3.5 py-2.5 bg-warm-white/7 border border-warm-white/10 rounded-full font-sans text-[13px] text-warm-white outline-none placeholder:text-warm-white/30"
            placeholder="Ask Aria anything…"
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&sendChat()}
          />
          <button onClick={sendChat} className="w-9 h-9 rounded-full bg-rust border-none cursor-pointer flex items-center justify-center text-[14px] text-white flex-shrink-0 hover:bg-rust-dark transition-colors">→</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="overflow-y-auto p-8 bg-cream">
        <div className="mb-6">
          <div className="font-serif text-[24px] font-bold text-charcoal mb-1.5">Summer College Lookbook ☀️</div>
          <div className="text-[13px] text-muted">Curated by Aria based on your style preferences</div>
        </div>

        <div className="grid grid-cols-3 gap-3.5 mb-7">
          {outfitProducts.map(p=><ProductCard key={p._id||p.id} product={p}/>)}
        </div>

        <div className="bg-warm-white border border-black/[0.08] rounded-2xl p-6">
          <div className="font-serif text-[17px] text-charcoal font-bold mb-3.5">Refine your style profile</div>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTS.map(s=>(
              <button key={s} onClick={()=>toggleStyle(s)}
                className={`px-4 py-1.5 rounded-full border text-[12.5px] cursor-pointer transition-all duration-200
                  ${activeStyles.includes(s)?'bg-charcoal text-warm-white border-charcoal':'bg-cream text-charcoal border-black/10 hover:bg-charcoal hover:text-warm-white hover:border-charcoal'}`}>
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={()=>sendChat()||setInput('')}
            className="mt-3.5 w-full py-3.5 bg-rust text-warm-white border-none rounded-xl font-sans text-[14px] font-medium cursor-pointer hover:bg-rust-dark transition-colors flex items-center justify-center gap-2">
            ✨ Update Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
