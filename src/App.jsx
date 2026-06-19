import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import WhoWeAre from './components/WhoWeAre';
import Products from './components/Products';
import Services from './components/Services';
import WhatWeDo from './components/WhatWeDo';
import Statistics from './components/Statistics';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Interactive Overlays
import ContactModal from './components/ContactModal';
import LangModal from './components/LangModal';
import AdminDashboard from './components/AdminDashboard';

// Routed Views
import ProductsView from './components/ProductsView';
import CategoryView from './components/CategoryView';
import ProductDetailView from './components/ProductDetailView';
import DynamicSections from './components/DynamicSections';
import AboutDirector from './components/AboutDirector';
import Careers from './components/Careers';

import './App.css';

function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactContext, setContactContext] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English (Global)");
  const [content, setContent] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const openContactWithContext = (context = null) => {
    setContactContext(context);
    setContactOpen(true);
  };

  // Fetch dynamic content on mount
  useEffect(() => {
    fetch('/content.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setContent(data);
      })
      .catch((err) => {
        console.warn('Could not load content.json, public pages will use local fallbacks.', err);
      });
  }, []);

  // Listen for browser back/forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path, targetId = null) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
    }
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLanguageChange = (langName, langCode) => {
    setCurrentLang(langName);
    const translateSelect = document.querySelector('.goog-te-combo');
    if (translateSelect) {
      translateSelect.value = langCode;
      translateSelect.dispatchEvent(new Event('change'));
    } else {
      setTimeout(() => {
        const retrySelect = document.querySelector('.goog-te-combo');
        if (retrySelect) {
          retrySelect.value = langCode;
          retrySelect.dispatchEvent(new Event('change'));
        }
      }, 500);
    }
  };

  // Derive routing state from currentPath and content during render
  const parts = currentPath.split('/').filter(Boolean);
  let currentView = 'home'; // 'home', 'sales', 'admin', 'products-index', 'category', 'product-detail'
  let activeCategorySlug = null;
  let activeProductSlug = null;

  if (currentPath === '/admin') {
    currentView = 'admin';
  } else if (currentPath === '/sales' || currentPath === '/what-we-do') {
    currentView = 'what-we-do';
  } else if (currentPath === '/about-the-director') {
    currentView = 'about-the-director';
  } else if (currentPath === '/careers') {
    currentView = 'careers';
  } else if (parts[0] === 'products') {
    if (parts.length === 1) {
      currentView = 'products-index';
    } else if (parts.length === 2) {
      const slug = parts[1];
      const isCat = content?.categories?.some(c => c.slug === slug || c.id === slug);
      const isProd = content?.products?.some(p => p.slug === slug || p.id === slug);

      if (isCat) {
        currentView = 'category';
        activeCategorySlug = slug;
      } else if (isProd) {
        currentView = 'product-detail';
        activeProductSlug = slug;
      } else {
        // Fallback to index if slug not found
        currentView = 'products-index';
      }
    }
  }

  // If viewing the admin route, render only the AdminDashboard
  if (currentView === 'admin') {
    return (
      <AdminDashboard
        key={content ? 'loaded' : 'loading'}
        content={content}
        onUpdateContent={setContent}
        onGoHome={() => navigateTo('/')}
      />
    );
  }

  return (
    <>
      {/* Premium Sticky Navigation */}
      <Header 
        onOpenContact={() => setContactOpen(true)}
        onOpenLang={() => setLangOpen(true)}
        currentLang={currentLang}
        currentView={currentView}
        currentPath={currentPath}
        navigateTo={navigateTo}
        categories={content?.categories}
        products={content?.products}
        services={content?.services}
      />

      <main style={{ position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%' }}
          >
            {currentView === 'home' ? (
              <>
                {(content?.homepageLayout || [
                  { id: 'hero', visible: true },
                  { id: 'who-we-are', visible: true },
                  { id: 'products', visible: true },
                  { id: 'services', visible: true },
                  { id: 'dynamic-sections', visible: true },
                  { id: 'statistics', visible: true },
                  { id: 'cta', visible: true }
                ])
                  .filter(sec => sec.visible !== false)
                  .map(sec => {
                    switch (sec.id) {
                      case 'hero':
                        return <Hero key="hero" content={content?.hero} onOpenContact={() => setContactOpen(true)} />;
                      case 'highlights':
                        return (
                          <WhoWeAre 
                            key="highlights" 
                            mode="highlights"
                            highlights={content?.highlights} 
                          />
                        );
                      case 'who-we-are':
                        return (
                          <WhoWeAre 
                            key="who-we-are" 
                            mode="profile"
                            description={content?.aboutUs?.description} 
                            profileImage={content?.aboutUs?.profileImage}
                          />
                        );
                      case 'products':
                        return (
                          <Products 
                            key="products" 
                            categories={content?.categories} 
                            onSelectCategory={(slug) => navigateTo(`/products/${slug}`)}
                          />
                        );
                      case 'services':
                        return (
                          <Services 
                            key="services" 
                            services={content?.services}
                            navigateTo={navigateTo}
                            onOpenContact={() => setContactOpen(true)}
                          />
                        );
                      case 'dynamic-sections':
                        return (
                          <DynamicSections 
                            key="dynamic-sections" 
                            sections={content?.dynamicSections}
                            onOpenContact={() => setContactOpen(true)}
                          />
                        );
                      case 'statistics':
                        return (
                          <Statistics 
                            key="statistics" 
                            stats={content?.statistics}
                          />
                        );
                      case 'cta':
                        return <CTA key="cta" ctaContent={content?.cta} onOpenContact={() => setContactOpen(true)} />;
                      default:
                        return null;
                    }
                  })}
              </>
            ) : currentView === 'what-we-do' ? (
              /* What We Do solutions and innovation commitments */
              <WhatWeDo content={content} onOpenContact={() => openContactWithContext()} />
            ) : currentView === 'about-the-director' ? (
              <AboutDirector content={content?.director} onOpenContact={openContactWithContext} />
            ) : currentView === 'careers' ? (
              <Careers content={content?.careers} onOpenContact={openContactWithContext} />
            ) : currentView === 'products-index' ? (
              /* Products Index View */
              <ProductsView
                categories={content?.categories}
                onSelectCategory={(slug) => navigateTo(`/products/${slug}`)}
              />
            ) : currentView === 'category' ? (
              /* Category detail list view */
              <CategoryView
                category={content?.categories?.find(c => c.slug === activeCategorySlug || c.id === activeCategorySlug)}
                products={content?.products?.filter(p => p.category === (content?.categories?.find(c => c.slug === activeCategorySlug || c.id === activeCategorySlug)?.id))}
                onSelectProduct={(slug) => navigateTo(`/products/${slug}`)}
                onBackToCategories={() => navigateTo('/products')}
              />
            ) : currentView === 'product-detail' ? (
              /* Product individual sheet view */
              <ProductDetailView
                product={content?.products?.find(p => p.slug === activeProductSlug || p.id === activeProductSlug)}
                category={content?.categories?.find(c => c.id === content?.products?.find(p => p.slug === activeProductSlug || p.id === activeProductSlug)?.category)}
                onOpenContact={openContactWithContext}
                onBackToCategory={() => {
                  const prod = content?.products?.find(p => p.slug === activeProductSlug || p.id === activeProductSlug);
                  const cat = content?.categories?.find(c => c.id === prod?.category);
                  if (cat) {
                    navigateTo(`/products/${cat.slug || cat.id}`);
                  } else {
                    navigateTo('/products');
                  }
                }}
                onBackToCategories={() => navigateTo('/products')}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer 
        footerContent={content?.footer}
        onOpenContact={() => setContactOpen(true)} 
        navigateTo={navigateTo}
        categories={content?.categories}
        services={content?.services}
        serviceCategories={content?.serviceCategories}
        whatWeDo={content?.whatWeDo}
      />

      <ContactModal 
        isOpen={contactOpen} 
        onClose={() => { setContactOpen(false); setContactContext(null); }} 
        context={contactContext}
      />
      
      <LangModal 
        isOpen={langOpen} 
        onClose={() => setLangOpen(false)} 
        currentLang={currentLang}
        onChangeLang={handleLanguageChange}
      />
    </>
  );
}

export default App;

