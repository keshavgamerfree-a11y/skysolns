import { motion } from 'framer-motion';

export default function LegalPageView({ legalData, policyKey, navigateTo }) {
  if (!legalData || !legalData[policyKey]) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <h2>Legal Policy Not Found</h2>
          <p>The requested policy could not be loaded.</p>
          <button className="btn btn-primary" onClick={() => navigateTo('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  const activePolicy = legalData[policyKey];

  const links = [
    { key: 'privacy-policy', label: 'Privacy Policy', path: '/privacy-policy' },
    { key: 'terms-conditions', label: 'Terms & Conditions', path: '/terms-conditions' },
    { key: 'accessibility', label: 'Accessibility Statement', path: '/accessibility' },
    { key: 'cookie-policy', label: 'Cookie Policy', path: '/cookie-policy' },
    { key: 'disclaimer', label: 'Disclaimer', path: '/disclaimer' }
  ];

  // Helper to render text with clickable links, emails, and phone numbers
  const renderTextWithLinks = (text) => {
    if (!text) return '';
    const unionRegex = /(\[.*?\]\(.*?\)|https?:\/\/[^\s]+?(?=[.,;:]?(?:\s|$))|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\+91\s\d{10})/g;
    const parts = text.split(unionRegex);
    return parts.map((part, idx) => {
      if (!part) return null;

      // 1. Check for Markdown link: [Label](URL)
      if (part.startsWith('[') && part.endsWith(')')) {
        const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (match) {
          const label = match[1];
          let url = match[2];

          // Check if URL is an email address
          const isEmail = url.startsWith('mailto:') || (url.includes('@') && !url.includes('/'));
          if (isEmail) {
            const cleanEmail = url.startsWith('mailto:') ? url.substring(7) : url;
            return (
              <a
                key={idx}
                href={`mailto:${cleanEmail}`}
                className="legal-link"
              >
                {label}
              </a>
            );
          }

          // Check if URL is phone
          const isPhone = url.startsWith('tel:') || (url.startsWith('+') && url.match(/^\+?[0-9\s-]{8,20}$/));
          if (isPhone) {
            const cleanPhone = url.startsWith('tel:') ? url.substring(4) : url;
            return (
              <a
                key={idx}
                href={`tel:${cleanPhone.replace(/[^\d+]/g, '')}`}
                className="legal-link"
              >
                {label}
              </a>
            );
          }

          // Regular link
          return (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="legal-link"
            >
              {label}
            </a>
          );
        }
      }

      // 2. Check for raw URL: http:// or https://
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            {part}
          </a>
        );
      }

      // 3. Check for raw Email
      if (part.includes('@') && part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return (
          <a
            key={idx}
            href={`mailto:${part}`}
            className="legal-link"
          >
            {part}
          </a>
        );
      }

      // 4. Check for Phone number (+91 9908140066)
      if (part.startsWith('+91') && part.match(/^\+91\s\d{10}$/)) {
        return (
          <a
            key={idx}
            href={`tel:${part.replace(/[^\d+]/g, '')}`}
            className="legal-link"
          >
            {part}
          </a>
        );
      }

      return part;
    });
  };

  // Helper to split text by double newlines into structured paragraphs / sections
  const renderParagraphs = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => {
      // Check if it's a section title (short line, no period, or ends with :)
      const trimmed = paragraph.trim();
      const lines = trimmed.split('\n');
      const firstLine = lines[0].trim();
      
      const isHeader = lines.length === 1 && 
        (firstLine.length < 60 && !firstLine.includes('.') && 
         (firstLine === firstLine.toUpperCase() || firstLine.endsWith(':') || 
          firstLine.includes('Information We Collect') || 
          firstLine.includes('How We Use') || 
          firstLine.includes('Website Usage') || 
          firstLine.includes('Limitation of Liability') || 
          firstLine.includes('Accessibility Focus') || 
          firstLine.includes('Continuous Improvement') || 
          firstLine.includes('Types of Cookies') || 
          firstLine.includes('Managing Cookies') || 
          firstLine.includes('Technical Specifications') || 
          firstLine.includes('Data Security')));

      if (isHeader) {
        return (
          <h3 
            key={index} 
            style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: 'var(--text-primary)', 
              marginTop: '32px', 
              marginBottom: '16px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '8px'
            }}
          >
            {trimmed}
          </h3>
        );
      }

      // Handle normal paragraphs with potential bullet list items
      return (
        <p 
          key={index} 
          style={{ 
            fontSize: '15px', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.75', 
            marginBottom: '20px',
            whiteSpace: 'pre-line'
          }}
        >
          {renderTextWithLinks(trimmed)}
        </p>
      );
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', paddingBottom: '80px', minHeight: '80vh' }}>
      {/* Breadcrumb Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-white)', padding: '24px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '40px' }}>
        <div className="container">
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('/')}>Home</span> / Legal / <span style={{ color: 'var(--accent-blue)', fontWeight: '500' }}>{activePolicy.title}</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container">
        <div className="legal-layout" style={{ display: 'flex', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Sidebar Navigation */}
          <aside className="legal-sidebar" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '140px', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '20px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: '700' }}>
              Legal & Compliance
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {links.map((link) => {
                const isActive = link.key === policyKey;
                return (
                  <button
                    key={link.key}
                    onClick={() => navigateTo(link.path)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '500',
                      borderRadius: '4px',
                      color: isActive ? 'var(--accent-purple)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--accent-purple-light)' : 'transparent',
                      transition: 'all 0.2s ease',
                      borderLeft: isActive ? '3px solid var(--accent-purple)' : '3px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Policy Document View */}
          <main className="legal-document-main" style={{ flexGrow: 1, backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '40px' }}>
            <motion.div
              key={policyKey}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h1 style={{ fontSize: '32px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                {activePolicy.title}
              </h1>
              
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '32px', fontStyle: 'italic', display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-color)', paddingBottom: '12px' }}>
                <span>Sky Life Sciences Solutions LLP</span>
                <span>Last Updated: {activePolicy.lastUpdated}</span>
              </div>

              <div className="legal-text-body">
                {renderParagraphs(activePolicy.content)}
              </div>
            </motion.div>
          </main>

        </div>
      </div>
    </div>
  );
}
