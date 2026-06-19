import { useState, useEffect } from 'react';

export default function Header({ 
  onOpenContact, 
  onOpenLang, 
  currentLang = "English", 
  currentPath,
  navigateTo,
  categories,
  products,
  services
}) {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileCat, setActiveMobileCat] = useState(null);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.header-search-wrapper')) {
        setShowResults(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase();
    const resultsList = [];

    // Search Products
    if (products) {
      products.forEach(prod => {
        if (prod.name?.toLowerCase().includes(q) || prod.desc?.toLowerCase().includes(q)) {
          resultsList.push({
            type: 'product',
            title: prod.name,
            snippet: prod.desc ? prod.desc.slice(0, 75) + '...' : '',
            url: `/products/${prod.slug || prod.id}`,
            badge: '📦 Product'
          });
        }
      });
    }

    // Search Categories
    if (categories) {
      categories.forEach(cat => {
        if (cat.title?.toLowerCase().includes(q) || cat.desc?.toLowerCase().includes(q)) {
          resultsList.push({
            type: 'category',
            title: cat.title,
            snippet: cat.desc ? cat.desc.slice(0, 75) + '...' : '',
            url: `/products/${cat.slug || cat.id}`,
            badge: '📁 Category'
          });
        }
      });
    }

    // Search Services
    if (services) {
      services.forEach(svc => {
        if (svc.title?.toLowerCase().includes(q) || svc.desc?.toLowerCase().includes(q)) {
          resultsList.push({
            type: 'service',
            title: svc.title,
            snippet: svc.desc ? svc.desc.slice(0, 75) + '...' : '',
            url: '/services',
            targetId: 'services',
            badge: '⚙️ Service'
          });
        }
      });
    }

    setSearchResults(resultsList);
  };

  const handleResultClick = (e, result) => {
    e.preventDefault();
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setMobileMenuOpen(false);
    if (result.type === 'service') {
      navigateTo('/', result.targetId);
    } else {
      navigateTo(result.url);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const productCategories = (categories && products)
    ? categories.map(cat => ({
        name: cat.title,
        id: cat.id,
        slug: cat.slug || cat.id,
        products: products.filter(p => p.category === cat.id).map(p => ({
          name: p.name,
          slug: p.slug || p.id
        }))
      }))
    : [];

  const isCategoryActive = (cat) => {
    const path = currentPath || window.location.pathname;
    if (path === `/products/${cat.slug || cat.id}`) return true;
    const activeProduct = products?.find(p => `/products/${p.slug || p.id}` === path);
    return activeProduct && activeProduct.category === cat.id;
  };

  const isProductActive = (prod) => {
    const path = currentPath || window.location.pathname;
    return path === `/products/${prod.slug || prod.id}`;
  };

  const handleNavClick = (e, path, targetId = null) => {
    e.preventDefault();
    navigateTo(path, targetId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header-wrapper">
        {/* Top Utility Bar */}
        <div className="top-bar" style={{ display: isSticky ? 'none' : 'block' }}>
          <div className="top-bar-container">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=shylender@skylifesciencessolutions.com" target="_blank" rel="noopener noreferrer" className="top-bar-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              shylender@skylifesciencessolutions.com
            </a>
            <button className="top-bar-link" onClick={onOpenContact}>
              Contact Us
            </button>
            <button className="top-bar-link" onClick={onOpenLang}>
              🌐 {currentLang}
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="main-header" style={{ height: isSticky ? '100px' : '125px' }}>
          {/* Logo */}
          <a href="/" onClick={(e) => handleNavClick(e, '/')} className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img
              src="/logo.jpg"
              alt="Skylife Sciences Solutions"
              style={{ height: isSticky ? '90px' : '112px', width: 'auto', transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
            <div className="logo-text" style={{ fontSize: '22px', fontWeight: '400', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#136B36', fontWeight: '400' }}>SKY LIFE SCIENCES</span> <span style={{ color: 'var(--accent-blue)', fontWeight: '400' }}>SOLUTIONS</span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="main-nav">
            <div className="nav-item">
              <a href="/" onClick={(e) => handleNavClick(e, '/')} className="nav-link">Home</a>
            </div>

            <div className="nav-item">
              <a href="/products" onClick={(e) => handleNavClick(e, '/products')} className="nav-link">
                Products
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </a>
              <div className="nav-dropdown products-dropdown">
                {productCategories.map((cat, idx) => {
                  const active = isCategoryActive(cat);
                  return (
                    <div key={idx} className="dropdown-category-item">
                      <a
                        href={`/products/${cat.slug || cat.id}`}
                        onClick={(e) => handleNavClick(e, `/products/${cat.slug || cat.id}`)}
                        className={`category-link ${active ? 'active' : ''}`}
                      >
                        {cat.name} {cat.products.length > 0 && <span className="cat-arrow">›</span>}
                      </a>
                      {cat.products.length > 0 && (
                        <div className="dropdown-products-submenu">
                          {cat.products.map((prod, pIdx) => {
                            const pActive = isProductActive(prod);
                            return (
                              <a
                                key={pIdx}
                                href={`/products/${prod.slug}`}
                                onClick={(e) => handleNavClick(e, `/products/${prod.slug}`)}
                                className={`product-submenu-link ${pActive ? 'active' : ''}`}
                              >
                                {prod.name}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="nav-item">
              <a href="/what-we-do" onClick={(e) => handleNavClick(e, '/what-we-do')} className="nav-link">
                What We Do
              </a>
            </div>

            <div className="nav-item">
              <a href="#services" onClick={(e) => handleNavClick(e, '/', 'services')} className="nav-link">
                Services
              </a>
            </div>

            <div className="nav-item">
              <span className="nav-link" style={{ cursor: 'pointer' }}>
                About Us
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <div className="nav-dropdown" style={{ minWidth: '220px' }}>
                <a
                  href="/"
                  onClick={(e) => handleNavClick(e, '/', 'highlights')}
                  className="dropdown-link"
                >
                  Company Highlights
                </a>
                <a
                  href="/about-the-director"
                  onClick={(e) => handleNavClick(e, '/about-the-director')}
                  className="dropdown-link"
                >
                  About The Director
                </a>
                <a
                  href="/careers"
                  onClick={(e) => handleNavClick(e, '/careers')}
                  className="dropdown-link"
                >
                  Careers
                </a>
              </div>
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Inline Search Bar */}
            <div className="header-search-wrapper">
              <input
                type="text"
                placeholder="Search..."
                className="header-search-input"
                value={searchQuery}
                onChange={(e) => {
                  handleSearchChange(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
              />
              <svg
                className="header-search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>

              {showResults && searchQuery.length >= 2 && (
                <div className="search-dropdown-results">
                  {searchResults.length > 0 ? (
                    searchResults.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        className="search-result-item"
                        onClick={(e) => handleResultClick(e, res)}
                      >
                        <div className="search-result-title">{res.title}</div>
                        {res.snippet && <div className="search-result-snippet">{res.snippet}</div>}
                        <span className="search-result-badge">{res.badge}</span>
                      </a>
                    ))
                  ) : (
                    <div className="search-no-results">No results found for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>

            <button className="action-btn" onClick={onOpenLang} aria-label="Select Language">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </button>
            <button
              className="action-btn mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <nav className="drawer-nav" style={{ paddingBottom: '30px' }}>
              <div style={{ padding: '0 20px', marginBottom: '15px' }}>
                <div className="header-search-wrapper">
                  <input
                    type="text"
                    placeholder="Search website..."
                    className="header-search-input"
                    style={{ width: '100%', paddingLeft: '36px' }}
                    value={searchQuery}
                    onChange={(e) => {
                      handleSearchChange(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                  />
                  <svg
                    className="header-search-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>

                  {showResults && searchQuery.length >= 2 && (
                    <div className="search-dropdown-results">
                      {searchResults.length > 0 ? (
                        searchResults.map((res, rIdx) => (
                          <a
                            key={rIdx}
                            href={res.url}
                            className="search-result-item"
                            onClick={(e) => handleResultClick(e, res)}
                          >
                            <div className="search-result-title">{res.title}</div>
                            {res.snippet && <div className="search-result-snippet">{res.snippet}</div>}
                            <span className="search-result-badge">{res.badge}</span>
                          </a>
                        ))
                      ) : (
                        <div className="search-no-results">No results found for "{searchQuery}"</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <a href="/" className="drawer-link" onClick={(e) => handleNavClick(e, '/')}>Home</a>

              {/* Accordion Products for Mobile */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>
                <div style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Products
                </div>
                {productCategories.map((cat, idx) => (
                  <div key={idx} className="mobile-drawer-cat-item">
                    <button
                      className="drawer-cat-btn"
                      onClick={(e) => {
                        if (cat.products.length > 0) {
                          setActiveMobileCat(activeMobileCat === cat.name ? null : cat.name);
                        } else {
                          handleNavClick(e, `/products/${cat.slug || cat.id}`);
                        }
                      }}
                      style={{ width: '100%', textAlign: 'left', padding: '10px 20px', fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none' }}
                    >
                      {cat.name}
                      {cat.products.length > 0 && (
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{activeMobileCat === cat.name ? '▼' : '▶'}</span>
                      )}
                    </button>
                    {cat.products.length > 0 && activeMobileCat === cat.name && (
                      <div className="drawer-submenu" style={{ backgroundColor: '#F8F9FA', paddingLeft: '15px' }}>
                        <a
                          href={`/products/${cat.slug || cat.id}`}
                          className="drawer-submenu-link"
                          onClick={(e) => handleNavClick(e, `/products/${cat.slug || cat.id}`)}
                          style={{ display: 'block', padding: '8px 20px', fontSize: '13px', fontWeight: '600', color: 'var(--accent-blue)', borderBottom: 'none' }}
                        >
                          View All {cat.name}
                        </a>
                        {cat.products.map((prod, pIdx) => (
                          <a
                            key={pIdx}
                            href={`/products/${prod.slug}`}
                            className="drawer-submenu-link"
                            onClick={(e) => handleNavClick(e, `/products/${prod.slug}`)}
                            style={{ display: 'block', padding: '8px 20px', fontSize: '13px', color: 'var(--text-secondary)', borderBottom: 'none' }}
                          >
                            {prod.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <a href="/what-we-do" className="drawer-link" onClick={(e) => handleNavClick(e, '/what-we-do')}>What We Do</a>
              <a href="#services" className="drawer-link" onClick={(e) => handleNavClick(e, '/', 'services')}>Services</a>
              
              {/* Accordion About Us for Mobile */}
              <div className="mobile-drawer-cat-item" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '10px' }}>
                <button
                  className="drawer-cat-btn"
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none' }}
                >
                  About Us
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{mobileAboutOpen ? '▼' : '▶'}</span>
                </button>
                {mobileAboutOpen && (
                  <div className="drawer-submenu" style={{ backgroundColor: '#F8F9FA', paddingLeft: '15px' }}>
                    <a
                      href="/"
                      className="drawer-submenu-link"
                      onClick={(e) => handleNavClick(e, '/', 'highlights')}
                      style={{ display: 'block', padding: '8px 20px', fontSize: '13px', color: 'var(--text-secondary)', borderBottom: 'none' }}
                    >
                      Company Highlights
                    </a>
                    <a
                      href="/about-the-director"
                      className="drawer-submenu-link"
                      onClick={(e) => handleNavClick(e, '/about-the-director')}
                      style={{ display: 'block', padding: '8px 20px', fontSize: '13px', color: 'var(--text-secondary)', borderBottom: 'none' }}
                    >
                      About The Director
                    </a>
                    <a
                      href="/careers"
                      className="drawer-submenu-link"
                      onClick={(e) => handleNavClick(e, '/careers')}
                      style={{ display: 'block', padding: '8px 20px', fontSize: '13px', color: 'var(--text-secondary)', borderBottom: 'none' }}
                    >
                      Careers
                    </a>
                  </div>
                )}
              </div>
            </nav>

            <div className="drawer-utilities">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=shylender@skylifesciencessolutions.com" target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                📧 shylender@skylifesciencessolutions.com
              </a>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
              >
                Contact Us
              </button>
              <button
                className="btn btn-text"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLang();
                }}
              >
                🌐 Language: {currentLang}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
