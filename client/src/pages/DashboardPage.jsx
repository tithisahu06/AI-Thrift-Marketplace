export default function DashboardPage() {
  const bars = [40,60,35,80,100,70,55];
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const trends = [
    {rank:1,name:'Vintage Denim',vol:'2.4k searches this week',up:true},
    {rank:2,name:'Y2K Tops',vol:'1.8k searches this week',up:true},
    {rank:3,name:'Canvas Sneakers',vol:'1.2k searches this week',up:true},
    {rank:4,name:'Oversized Hoodies',vol:'980 searches this week',up:false},
  ];
  return (
    <div className="p-8 bg-cream min-h-[calc(100vh-64px)]">
      <div className="font-serif text-[26px] font-bold text-charcoal mb-6">Seller <span className="italic text-rust">Dashboard</span></div>

      {/* Eco banner */}
      <div className="bg-moss text-warm-white rounded-2xl p-5 px-6 flex items-center gap-5 mb-7">
        <div className="text-[28px]">🌿</div>
        <div>
          <div className="font-serif text-[17px] font-bold mb-0.5">Sustainability Impact</div>
          <div className="text-[13px] opacity-75">Your listings have contributed to circular fashion this month.</div>
        </div>
        <div className="flex gap-6 ml-auto">
          {[['12.6kg','CO₂ saved'],['8400L','Water saved'],['28','Items circulated']].map(([n,l])=>(
            <div key={l} className="text-center">
              <div className="font-serif text-[22px] font-bold">{n}</div>
              <div className="text-[10px] opacity-65 uppercase tracking-wide">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-7">
        {[
          {label:'Revenue (MTD)',value:'₹14,240',delta:'↑ 18% vs last month',up:true},
          {label:'Items Sold',value:'23',delta:'↑ 5 more than last month',up:true},
          {label:'Active Listings',value:'11',delta:'3 expiring soon',up:null},
          {label:'Avg. Sale Price',value:'₹619',delta:'↓ 4% vs last month',up:false},
        ].map(c=>(
          <div key={c.label} className="bg-warm-white border border-black/[0.08] rounded-2xl p-5">
            <div className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-2.5">{c.label}</div>
            <div className="font-serif text-[28px] font-bold text-charcoal">{c.value}</div>
            <div className={`text-[12px] mt-1 ${c.up===true?'text-moss':c.up===false?'text-red-500':'text-muted'}`}>{c.delta}</div>
          </div>
        ))}
      </div>

      {/* Chart + Trends */}
      <div className="grid grid-cols-[2fr_1fr] gap-3.5">
        <div className="bg-warm-white border border-black/[0.08] rounded-2xl p-5">
          <div className="font-serif text-[16px] text-charcoal mb-4">Sales this week</div>
          <div className="flex items-end gap-2 h-[120px]">
            {bars.map((h,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className={`w-full rounded-t transition-all duration-200 hover:bg-rust ${i===4?'bg-rust':'bg-rust-light'}`} style={{height:`${h}%`,minHeight:8}}/>
                <div className="text-[10px] text-muted">{days[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-warm-white border border-black/[0.08] rounded-2xl p-5">
          <div className="font-serif text-[16px] text-charcoal mb-3.5">Trending Categories</div>
          <div className="flex flex-col">
            {trends.map(t=>(
              <div key={t.rank} className="flex items-center gap-2.5 py-2 border-b border-black/[0.06] last:border-b-0">
                <div className="font-serif text-[14px] font-bold text-sand-dark w-4.5 flex-shrink-0">{t.rank}</div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-charcoal">{t.name}</div>
                  <div className="text-[11px] text-muted">{t.vol}</div>
                </div>
                <div className={`text-[12px] ${t.up?'text-moss':'text-red-500'}`}>{t.up?'↑':'↓'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
