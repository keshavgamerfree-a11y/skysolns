import { motion } from 'framer-motion';

export default function CategoryView({ category, products = [], onSelectProduct, onBackToCategories }) {
  if (!category) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingTop: 'var(--whitespace-xl)', paddingBottom: 'var(--whitespace-xxl)' }}>
      {/* Category Header Banner */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-color)', padding: 'var(--whitespace-xl) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: category.img ? '1.2fr 0.8fr' : '1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <button 
                  onClick={onBackToCategories}
                  style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '13px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    padding: '4px 8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)'
                  }}
                >
                  ← Categories
                </button>
                <span style={{ color: 'var(--border-color-dark)', fontSize: '12px' }}>/</span>
                <span style={{ fontSize: '13px', color: 'var(--accent-blue)', fontWeight: '500' }}>{category.title}</span>
              </div>

              <span className="section-meta" style={{ color: 'var(--accent-purple)' }}>Category Portfolio</span>
              <h1 className="section-title" style={{ fontSize: '44px', fontWeight: '300', marginBottom: 'var(--whitespace-md)' }}>
                {category.title}
              </h1>
              <p className="section-subtitle" style={{ margin: 0, maxWidth: '800px', fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {category.desc}
              </p>
            </div>
            {category.img && (
              <div style={{ 
                height: '240px', 
                width: '100%', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                backgroundColor: '#FFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <img src={category.img} alt={category.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products list grid */}
      <section className="section alt-bg" style={{ padding: 'var(--whitespace-xl) 0 0 0', borderBottom: 'none' }}>
        <div className="container">
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '16px', opacity: 0.4, color: 'var(--text-secondary)' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>No products available under this category at this time.</p>
              <button className="btn btn-secondary" onClick={onBackToCategories} style={{ marginTop: '20px', fontSize: '13px', padding: '10px 20px' }}>
                Back to Categories
              </button>
            </div>
          ) : (
            <div className="cards-grid">
              {products.map((prod, idx) => (
                <motion.div 
                  className="product-card" 
                  key={prod.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  style={{ padding: '0', overflow: 'hidden' }}
                >
                  <div style={{ height: '200px', width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--border-color)', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <img 
                      src={prod.img || prod.images?.[0] || category.img} 
                      alt={prod.name} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.5s ease' }}
                      className="product-img-hover"
                    />
                  </div>
                  <div style={{ padding: 'var(--whitespace-md)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ 
                      fontSize: '11px', 
                      color: 'var(--accent-blue)', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em', 
                      fontWeight: '600', 
                      display: 'inline-block', 
                      marginBottom: '8px' 
                    }}>
                      {category.title}
                    </span>
                    <h3 className="card-title" style={{ fontSize: '19px', marginBottom: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{prod.name}</h3>
                    
                    <button 
                      className="btn-text" 
                      style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: '14px' }}
                      onClick={() => onSelectProduct(prod.slug || prod.id)}
                    >
                      View Product Details
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
