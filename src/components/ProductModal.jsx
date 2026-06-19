import { motion, AnimatePresence } from 'framer-motion';

export default function ProductModal({ isOpen, onClose, category, products = [], onOpenContact }) {
  if (!category) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ zIndex: 1000 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '850px',
              width: '90%',
              padding: '40px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '0px'
            }}
          >
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
              <span className="section-meta" style={{ color: 'var(--accent-blue)', fontSize: '11px', margin: 0 }}>Category Portfolio</span>
              <h3 className="section-title" style={{ fontSize: '32px', marginBottom: '8px', marginTop: '4px' }}>
                {category.title}
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                {category.desc}
              </p>
            </div>

            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '16px', opacity: 0.5 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p style={{ fontSize: '15px' }}>No products available in this category at the moment.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {products.map((product, idx) => (
                  <div
                    key={product.id || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: product.img ? '180px 1fr' : '1fr',
                      gap: '24px',
                      padding: '24px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#FCFCFC',
                      alignItems: 'start'
                    }}
                  >
                    {product.img && (
                      <div style={{ width: '100%', height: '140px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#FFF' }}>
                        <img
                          src={product.img}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {product.name}
                      </h4>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px', flexGrow: 1 }}>
                        {product.desc || 'No description available for this product. Technical specifications can be requested via our support line.'}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: 'auto' }}>
                        {product.pdf && (
                          <a
                            href={product.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{
                              padding: '8px 16px',
                              fontSize: '12.5px',
                              gap: '6px',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download Brochure
                          </a>
                        )}
                        <button
                          className="btn-text"
                          onClick={() => {
                            const recipient = "shylender@skylifesciencessolutions.com";
                            const subject = `Product Enquiry - ${product.name}`;
                            const body = `Hello Sky Life Sciences Solutions,

I would like more information regarding:

${product.name}

Company:

Name:

Phone Number:

Email:

Message:

Thank you.`;
                            window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                          }}
                          style={{ fontSize: '13px' }}
                        >
                          Request Quote
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <button className="btn btn-secondary" onClick={onClose} style={{ padding: '10px 20px', fontSize: '13px' }}>
                Close Window
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
