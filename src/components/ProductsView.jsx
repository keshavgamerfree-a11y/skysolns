import { motion } from 'framer-motion';

export default function ProductsView({ categories = [], onSelectCategory }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingTop: 'var(--whitespace-xl)', paddingBottom: 'var(--whitespace-xxl)' }}>
      {/* Page Header Banner */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-color)', padding: 'var(--whitespace-xl) 0' }}>
        <div className="container">
          <span className="section-meta" style={{ color: 'var(--accent-blue)' }}>Solutions Portfolio</span>
          <h1 className="section-title" style={{ fontSize: '48px', fontWeight: '300', marginBottom: 'var(--whitespace-md)' }}>
            Innovative <strong>Product Categories</strong>
          </h1>
          <p className="section-subtitle" style={{ margin: 0, maxWidth: '800px' }}>
            Explore our comprehensive range of next-generation laboratory technologies, certified scientific instruments, and high-performance consumables.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section alt-bg" style={{ padding: 'var(--whitespace-xl) 0 0 0', borderBottom: 'none' }}>
        <div className="container">
          <div className="cards-grid">
            {categories.map((cat, idx) => (
              <motion.div 
                className="product-card" 
                key={cat.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                style={{ padding: '0', overflow: 'hidden' }}
              >
                <div style={{ height: '200px', width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                  {cat.img ? (
                    <img 
                      src={cat.img} 
                      alt={cat.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      className="product-img-hover"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                      <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.5)', fontWeight: '500' }}>{cat.title}</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: 'var(--whitespace-md)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 className="card-title" style={{ fontSize: '21px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' }}>{cat.title}</h3>
                  <p className="card-desc" style={{ fontSize: '14.5px', marginBottom: '20px', lineHeight: '1.5', flexGrow: 1 }}>{cat.desc}</p>
                  
                  <button 
                    className="btn-text" 
                    style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: '14px' }}
                    onClick={() => onSelectCategory(cat.slug || cat.id)}
                  >
                    Explore Category
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
