export default function Footer({ footerContent, onOpenContact, navigateTo, services = [] }) {
  const currentYear = new Date().getFullYear();

  const handleFooterLinkClick = (e, path, targetId = null) => {
    e.preventDefault();
    navigateTo(path, targetId);
  };

  // ─── Data from content ────────────────────────────────────────────────────
  const phone = footerContent?.phone || "+91 9908140066";
  const email = footerContent?.email || "shylender@skylifesciencessolutions.com";
  const mapUrl = footerContent?.mapEmbedUrl || "";
  const supportLink = footerContent?.supportLink || "#";

  const socials = {
    linkedin: footerContent?.socials?.linkedin || "https://www.linkedin.com/company/skylifesciencessolutions",
    instagram: footerContent?.socials?.instagram || "#",
  };

  // ─── Services: use serviceCategories OR flat services list (never hardcoded defaults) ───
  // If no data at all, show nothing — admin must add
  const hasServices = services && services.length > 0;

  // Get up to 5 services for footer display
  const footerServices = hasServices
    ? services.slice(0, 5)
    : [];

  return (
    <footer className="footer-wrapper" style={{ backgroundColor: 'var(--bg-white)', borderTop: '1px solid var(--border-color)' }}>

      {/* ════════ MAIN FOOTER BODY ════════ */}
      <div style={{ padding: '56px 0 40px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr 1fr', gap: '40px', alignItems: 'start' }}>

            {/* ── COL 1: COMPANY INFO + CONNECT WITH US ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <img src="/logo.jpg" alt="Skylife Logo" style={{ height: '38px', width: 'auto', borderRadius: '4px' }} />
                  <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.04em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    SKY LIFE<br />SCIENCES
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, maxWidth: '300px' }}>
                  Delivering next-generation analytical and manufacturing solutions for pharmaceutical, biotech and life sciences.
                </p>
              </div>

              {/* ── CONNECT WITH US (Priority #1) ── */}
              <div>
                <h5 style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  Connect With Us
                </h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Email */}
                  <a
                    href={`mailto:${email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '13.5px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'color 0.2s'
                    }}
                    className="footer-connect-link"
                  >
                    <span style={{
                      width: '32px', height: '32px', flexShrink: 0, borderRadius: '6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'rgba(19, 107, 54, 0.08)',
                      border: '1px solid rgba(19, 107, 54, 0.15)'
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</span>
                  </a>

                  {/* Instagram */}
                  {socials.instagram && socials.instagram !== '#' && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        textDecoration: 'none', color: 'var(--text-primary)',
                        fontSize: '13.5px', fontWeight: '500', transition: 'color 0.2s'
                      }}
                      className="footer-connect-link"
                    >
                      <span style={{
                        width: '32px', height: '32px', flexShrink: 0, borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(193, 53, 132, 0.06)',
                        border: '1px solid rgba(193, 53, 132, 0.15)'
                      }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C13584" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </span>
                      Instagram
                    </a>
                  )}

                  {/* LinkedIn */}
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      textDecoration: 'none', color: 'var(--text-primary)',
                      fontSize: '13.5px', fontWeight: '500', transition: 'color 0.2s'
                    }}
                    className="footer-connect-link"
                  >
                    <span style={{
                      width: '32px', height: '32px', flexShrink: 0, borderRadius: '6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: 'rgba(10, 102, 194, 0.07)',
                      border: '1px solid rgba(10, 102, 194, 0.15)'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </span>
                    LinkedIn
                  </a>
                </div>
              </div>

            </div>

            {/* ── COL 2: CONTACT DETAILS ── */}
            <div>
              <h5 style={{
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px',
                paddingBottom: '8px', borderBottom: '1px solid var(--border-color)'
              }}>
                Contact Details
              </h5>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Email Inquiry */}
                <div>
                  <span style={{
                    fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: '600'
                  }}>
                    Email Inquiry
                  </span>
                  <a
                    href={`mailto:${email}`}
                    style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)', textDecoration: 'none', wordBreak: 'break-all', lineHeight: '1.4', display: 'inline-flex', alignItems: 'center', gap: '7px' }}
                    className="footer-link"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {email}
                  </a>
                </div>


                {/* Direct Phone */}
                <div>
                  <span style={{
                    fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: '600'
                  }}>
                    Direct Phone
                  </span>
                  <a
                    href={`tel:${phone.replace(/\D/g, '')}`}
                    style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', textDecoration: 'none' }}
                    className="footer-link"
                  >
                    {phone}
                  </a>
                </div>

                {/* Request Consultation CTA */}
                <div style={{ paddingTop: '4px' }}>
                  <button
                    onClick={onOpenContact}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      padding: '9px 18px',
                      background: 'var(--accent-green)',
                      color: '#FFF',
                      border: 'none', borderRadius: '6px',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      letterSpacing: '0.02em',
                      transition: 'opacity 0.2s'
                    }}
                    className="footer-cta-btn"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Request Consultation
                  </button>
                </div>
              </div>
            </div>

            {/* ── COL 3: SERVICES ── */}
            <div>
              <h5 style={{
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px',
                paddingBottom: '8px', borderBottom: '1px solid var(--border-color)'
              }}>
                Services
              </h5>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {footerServices.length > 0 ? (
                  footerServices.map((svc, idx) => (
                    <li key={svc.id || idx}>
                      <a
                        href={svc.learnMore || '/services'}
                        onClick={(e) => {
                          if (!svc.learnMore || svc.learnMore === '#contact') {
                            e.preventDefault(); onOpenContact();
                          } else if (svc.learnMore.startsWith('#')) {
                            e.preventDefault();
                            const el = document.getElementById(svc.learnMore.slice(1));
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          } else if (!svc.learnMore.startsWith('http')) {
                            handleFooterLinkClick(e, svc.learnMore);
                          }
                        }}
                        className="footer-link"
                        style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', lineHeight: '1.4', display: 'block' }}
                      >
                        {svc.title}
                      </a>
                    </li>
                  ))
                ) : (
                  <li style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', opacity: 0.6 }}>
                    No services added yet
                  </li>
                )}
                {footerServices.length > 0 && services.length > 5 && (
                  <li>
                    <a
                      href="/"
                      onClick={(e) => handleFooterLinkClick(e, '/', 'services')}
                      className="footer-link"
                      style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-blue)', textDecoration: 'none' }}
                    >
                      View All Services →
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* ── COL 4: QUICK NAVIGATION ── */}
            <div>
              <h5 style={{
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px',
                paddingBottom: '8px', borderBottom: '1px solid var(--border-color)'
              }}>
                Quick Navigation
              </h5>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <li><a href="/" onClick={(e) => handleFooterLinkClick(e, '/')} className="footer-link" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Home Page</a></li>
                <li><a href="/products" onClick={(e) => handleFooterLinkClick(e, '/products')} className="footer-link" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Products Portfolio</a></li>
                <li><a href="/services" onClick={(e) => handleFooterLinkClick(e, '/services')} className="footer-link" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Services</a></li>
                <li><a href="/what-we-do" onClick={(e) => handleFooterLinkClick(e, '/what-we-do')} className="footer-link" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>What We Do</a></li>
                <li><a href="/#who-we-are" onClick={(e) => handleFooterLinkClick(e, '/', 'who-we-are')} className="footer-link" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>About Us</a></li>
                <li>
                  <button
                    onClick={onOpenContact}
                    className="footer-link"
                    style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}
                  >
                    Request Consultation
                  </button>
                </li>
                <li><a href={supportLink} target="_blank" rel="noopener noreferrer" className="footer-link" title="Visit Our Office – 5th Floor, Sky Life Sciences Solutions Office" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Support Centre</a></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ════════ GOOGLE MAP STRIP ════════ */}
      {mapUrl && (
        <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ padding: '0' }}>
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <iframe
                src={mapUrl}
                width="100%"
                height="220"
                style={{ border: 'none', display: 'block', filter: 'grayscale(15%) contrast(1.05)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sky Life Sciences Location"
              />
              {/* Location label overlay */}
              <div style={{
                position: 'absolute', bottom: '12px', left: '16px',
                background: 'rgba(255,255,255,0.95)',
                padding: '6px 12px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {footerContent?.mapLocation || 'Hyderabad, Telangana, India'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════ FOOTER BOTTOM: LEGAL + COPYRIGHT ════════ */}
      <div style={{ backgroundColor: '#F8F9FA', padding: '16px 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container footer-bottom-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>

          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            &copy; {currentYear} Skylife Sciences Solutions. All rights reserved.
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href="/privacy-policy" onClick={(e) => handleFooterLinkClick(e, '/privacy-policy')} className="footer-bottom-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px' }}>Privacy Policy</a>
            <span style={{ color: 'var(--border-color-dark)', fontSize: '12px' }}>|</span>
            <a href="/terms-conditions" onClick={(e) => handleFooterLinkClick(e, '/terms-conditions')} className="footer-bottom-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px' }}>Terms & Conditions</a>
            <span style={{ color: 'var(--border-color-dark)', fontSize: '12px' }}>|</span>
            <a href="/accessibility" onClick={(e) => handleFooterLinkClick(e, '/accessibility')} className="footer-bottom-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px' }}>Accessibility</a>
            <span style={{ color: 'var(--border-color-dark)', fontSize: '12px' }}>|</span>
            <a href="/cookie-policy" onClick={(e) => handleFooterLinkClick(e, '/cookie-policy')} className="footer-bottom-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px' }}>Cookie Policy</a>
            <span style={{ color: 'var(--border-color-dark)', fontSize: '12px' }}>|</span>
            <a href="/disclaimer" onClick={(e) => handleFooterLinkClick(e, '/disclaimer')} className="footer-bottom-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px' }}>Disclaimer</a>
            <span style={{ color: 'var(--border-color-dark)', fontSize: '12px' }}>|</span>
            <a href="/admin" onClick={(e) => { e.preventDefault(); navigateTo('/admin'); }} className="footer-bottom-link" style={{ opacity: 0.35, textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '12px' }}>CMS Login</a>
          </div>

        </div>
      </div>

    </footer>
  );
}
