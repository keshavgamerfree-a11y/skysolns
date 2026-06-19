import { motion } from 'framer-motion';

export default function Careers({ content, onOpenContact }) {
  if (!content) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: 'var(--whitespace-xxl)' }}>
      {/* Page Header */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', padding: '40px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <a href="/">Home</a> / About Us / <span style={{ color: 'var(--accent-blue)', fontWeight: '500' }}>Careers</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', padding: '80px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Meta and Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-meta">Join Our Team</span>
              <h1 style={{ fontSize: '42px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '12px', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                {content.title}
              </h1>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.75', fontWeight: '300', marginBottom: '40px' }}>
                {content.description}
              </p>
            </motion.div>

            {/* Email Card (Lead Gen style) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                background: 'linear-gradient(135deg, rgba(19, 107, 54, 0.03) 0%, rgba(35, 71, 168, 0.03) 100%)',
                border: '1px solid var(--border-color)',
                padding: '40px',
                textAlign: 'left',
                boxShadow: 'var(--shadow-md)',
                borderRadius: '8px',
                marginBottom: '40px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
                How to Apply
              </h3>
              
              <div style={{ fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
                {content.recruitmentInfo}
              </div>

              {content.email && (
                <div style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', fontWeight: '600', letterSpacing: '0.05em' }}>
                      Submit your resume to:
                    </span>
                    <a
                      href={`mailto:${content.email}`}
                      style={{ fontSize: '20px', fontWeight: '600', color: 'var(--accent-purple)', textDecoration: 'underline' }}
                    >
                      {content.email}
                    </a>
                  </div>

                  <a
                    href={`mailto:${content.email}`}
                    className="btn btn-primary"
                    style={{ fontSize: '13px', padding: '12px 24px', display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Send Email Resume
                  </a>
                </div>
              )}
            </motion.div>

            {/* General Inquiry CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}
            >
              Don't see a matching position? You can always submit a general inquiry.{' '}
              <button
                onClick={onOpenContact}
                style={{ color: 'var(--accent-blue)', fontWeight: '500', textDecoration: 'underline', padding: 0 }}
              >
                Contact our hiring team
              </button>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
