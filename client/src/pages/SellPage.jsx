import { useState, useRef } from 'react';
import { aiGenerateListing, aiPricePredict } from '../services/api';
import toast from 'react-hot-toast';

export default function SellPage() {
  const fileRef = useRef();
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', brand:'', category:'', condition:'Good', size:'M', price:'', tags:'' });
  const [aiRunning, setAiRunning] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState({ min:750, max:1100, recommended:899 });
  const [dragover, setDragover] = useState(false);
  const [recentListings, setRecentListings] = useState([
    { title:'Vintage Denim Jacket', price:'₹899', time:'2h ago', status:'active', emoji:'🧥' },
    { title:'Floral Midi Dress', price:'₹1,200', time:'1d ago', status:'sold', emoji:'👗' },
  ]);

  const handleFiles = (fileList) => {
    Array.from(fileList).forEach(file => {
      if (!file.type.startsWith('image/')) { toast.error(`${file.name} is not an image`); return; }
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10MB`); return; }
      const reader = new FileReader();
      reader.onload = ev => setImages(p => [...p, { dataUrl: ev.target.result, name: file.name }]);
      reader.readAsDataURL(file);
    });
  };

  const triggerAI = async () => {
    if (!images.length) { toast.error('📸 Please upload at least one photo first'); return; }
    setAiRunning(true);
    try {
      const { data } = await aiGenerateListing({ imageBase64: images[0].dataUrl, brand: form.brand, category: form.category, condition: form.condition });
      const d = data.data;
      setForm(p => ({ ...p, title: d.title||p.title, description: d.description||p.description, category: d.category||p.category, brand: d.brand||p.brand, tags: (d.tags||[]).join(' '), price: d.suggestedPrice?.recommended?.toString()||p.price, condition: d.condition||p.condition }));
      if (d.suggestedPrice) setPriceSuggestion(d.suggestedPrice);
      setAiDone(true);
      toast.success(data.mock ? '✅ AI generated (demo mode)!' : '✅ AI generated your listing!');
    } catch { toast.error('AI generation failed.'); }
    finally { setAiRunning(false); }
  };

  const fetchPrice = async () => {
    if (!form.brand && !form.category) return;
    try {
      const { data } = await aiPricePredict({ brand: form.brand, category: form.category, condition: form.condition, size: form.size });
      setPriceSuggestion(data);
    } catch {}
  };

  const submitListing = () => {
    if (!images.length) { toast.error('📸 Please upload at least one photo'); return; }
    if (!form.title) { toast.error('⚠️ Please add a title'); return; }
    if (!form.price) { toast.error('⚠️ Please set a price'); return; }
    setRecentListings(p => [{ title: form.title.slice(0,32), price:`₹${form.price}`, time:'Just now', status:'active', dataUrl:images[0].dataUrl }, ...p]);
    toast.success(`🎉 "${form.title.slice(0,30)}" listed!`);
    setImages([]); setAiDone(false);
    setForm({ title:'', description:'', brand:'', category:'', condition:'Good', size:'M', price:'', tags:'' });
  };

  const f = k => ({ value: form[k], onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) });

  return (
    <div className="grid grid-cols-2 min-h-[calc(100vh-64px)]">
      {/* LEFT */}
      <div className="bg-charcoal px-12 py-12 flex flex-col gap-6">
        <div>
          <div className="text-[11px] font-medium tracking-[2.5px] uppercase text-rust mb-3">✦ Create Listing</div>
          <div className="font-serif text-[36px] leading-[1.15] text-warm-white font-bold mb-2">Turn your<br />closet into <em className="italic text-sand">cash.</em></div>
          <div className="text-[13px] text-warm-white/50 leading-relaxed max-w-[320px]">Upload photos and let AI generate title, description, hashtags, and price.</div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
        {images.length === 0 ? (
          <div className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-3.5 cursor-pointer transition-all text-center ${dragover?'border-rust bg-rust/5':'border-warm-white/20 hover:border-rust'}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e=>{e.preventDefault();setDragover(true)}}
            onDragLeave={()=>setDragover(false)}
            onDrop={e=>{e.preventDefault();setDragover(false);handleFiles(e.dataTransfer.files)}}>
            <span className="text-4xl">📸</span>
            <div className="font-serif text-[18px] text-warm-white">Drop your photos here</div>
            <div className="text-[12px] text-warm-white/50">JPG, PNG or HEIC • Up to 10MB each</div>
            <span className="text-[12px] font-medium text-rust border-b border-dashed border-rust pb-0.5">Browse from device</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img,i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-warm-white/5 border border-warm-white/10">
                <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover"/>
                {i===0 && <div className="absolute top-1.5 left-1.5 bg-rust text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full">Cover</div>}
                <button onClick={()=>setImages(p=>p.filter((_,j)=>j!==i))} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-charcoal/75 text-white border-none cursor-pointer text-[11px] flex items-center justify-center">×</button>
              </div>
            ))}
            <div onClick={()=>fileRef.current?.click()} className="aspect-square rounded-xl border-[1.5px] border-dashed border-warm-white/20 text-warm-white/50 flex items-center justify-center text-2xl cursor-pointer hover:border-rust hover:text-rust transition-colors">+</div>
          </div>
        )}

        <button onClick={triggerAI} disabled={aiRunning||!images.length}
          className="w-full py-3.5 bg-rust text-warm-white rounded-xl font-sans text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-rust-dark disabled:opacity-55 disabled:cursor-not-allowed transition-colors border-none cursor-pointer">
          {aiRunning ? '⏳ Analyzing image…' : '✨ Generate with AI'}
        </button>
        <div className="text-warm-white/40 text-[11px] text-center -mt-4">Powered by Gemini Vision API</div>

        <div className="mt-auto pt-6 border-t border-warm-white/10">
          <div className="font-serif text-[14px] text-warm-white mb-3">Recent listings</div>
          <div className="flex flex-col gap-2">
            {recentListings.map((r,i) => (
              <div key={i} className="flex items-center gap-2.5 py-2.5 px-3 bg-warm-white/5 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-warm-white/10 flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
                  {r.dataUrl ? <img src={r.dataUrl} className="w-full h-full object-cover" alt=""/> : <span>{r.emoji||'👔'}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-warm-white font-medium truncate">{r.title}</div>
                  <div className="text-[11px] text-warm-white/40">{r.price} • {r.time}</div>
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${r.status==='active'?'bg-moss-light text-moss':'bg-amber-100 text-amber-800'}`}>{r.status==='active'?'Active':'Sold'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-warm-white px-12 py-12 overflow-y-auto">
        {aiDone && <div className="ai-indicator">✨ AI-generated — review and edit before publishing</div>}
        <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted mb-3">Item Details</div>
        <div className="mb-3.5"><label className="form-label">Title</label><input className="form-input" placeholder="e.g. Vintage Levi's 501 Denim Jacket" {...f('title')}/></div>
        <div className="mb-3.5"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Describe your item…" {...f('description')}/></div>
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <div><label className="form-label">Category</label>
            <select className="form-select" {...f('category')} onBlur={fetchPrice}>
              <option value="">Select category</option>
              {['Tops','Bottoms','Dresses','Outerwear','Sneakers','Bags','Accessories'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="form-label">Condition</label>
            <select className="form-select" {...f('condition')} onBlur={fetchPrice}>
              {['Like New','Good','Fair'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3.5">
          <div><label className="form-label">Size</label>
            <select className="form-select" {...f('size')}>
              {['XS','S','M','L','XL','XXL'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="form-label">Brand</label><input className="form-input" placeholder="e.g. Levi's, Zara" {...f('brand')} onBlur={fetchPrice}/></div>
        </div>
        <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted mb-3 mt-6">Pricing</div>
        {priceSuggestion && (
          <div className="bg-moss-light border border-moss/20 rounded-xl px-3.5 py-2.5 text-[12.5px] text-moss flex justify-between items-center mb-3.5">
            <span>🤖 AI suggests <strong>₹{priceSuggestion.min}–₹{priceSuggestion.max}</strong></span>
            <button onClick={()=>setForm(p=>({...p,price:String(priceSuggestion.recommended)}))} className="text-[11px] underline cursor-pointer text-moss bg-transparent border-none">Use ₹{priceSuggestion.recommended}</button>
          </div>
        )}
        <div className="mb-3.5"><label className="form-label">Your Price (₹)</label><input className="form-input" placeholder="Enter price" type="number" {...f('price')}/></div>
        <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted mb-3 mt-6">Tags</div>
        <div className="mb-3.5"><input className="form-input" placeholder="#vintage #denim #90s #streetwear" {...f('tags')}/></div>
        <div className="text-[12px] text-muted mb-3.5 leading-relaxed">By listing, you agree to WearAI's <span className="text-rust cursor-pointer">Terms & Seller Policy</span>. A 3.5% platform fee applies.</div>
        <button onClick={submitListing} className="w-full py-3.5 bg-charcoal text-warm-white border-none rounded-xl font-sans text-[14px] font-semibold cursor-pointer transition-colors hover:bg-rust">Publish Listing →</button>
      </div>
    </div>
  );
}
