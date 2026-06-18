import { useState, useEffect, useRef, useCallback } from 'react';
import '../admin.css';

function IntelligentMediaInput({ value, onChange, placeholder, onBrowseLibrary, onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const isVideoUrl = (url) => {
    if (!url) return false;
    const cleanUrl = url.toLowerCase();
    return cleanUrl.includes('youtube.com') ||
      cleanUrl.includes('youtu.be') ||
      cleanUrl.includes('vimeo.com') ||
      cleanUrl.endsWith('.mp4') ||
      cleanUrl.endsWith('.webm') ||
      cleanUrl.endsWith('.ogg');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadFile = (file) => {
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('skylife_admin_token')}`
      },
      body: formData
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          onChange(data.url);
          if (onUploadComplete) onUploadComplete();
        } else {
          setError(data.error || 'Upload failed');
        }
      })
      .catch(err => {
        setError('Network error: ' + err.message);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        uploadFile(file);
      } else {
        setError('Only image or video files are supported');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('video') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            uploadFile(file);
            return;
          }
        }
      }
    }

    const text = e.clipboardData?.getData('text');
    if (text) {
      const trimmed = text.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') ||
        trimmed.match(/\.(jpeg|jpg|gif|png|webp|svg|mp4|webm|ogg)/i) ||
        trimmed.includes('youtube.com') || trimmed.includes('youtu.be') || trimmed.includes('vimeo.com')) {
        e.preventDefault();
        onChange(trimmed);
      }
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="intelligent-image-input" onPaste={handlePaste}>
      {error && <div className="admin-alert admin-alert-danger" style={{ padding: '8px 12px', marginBottom: '8px', fontSize: '12px' }}>{error}</div>}

      <div
        className={`intelligent-image-dropzone ${dragActive ? 'drag-active' : ''} ${value ? 'has-preview' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileBrowser}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        {uploading ? (
          <div className="intelligent-uploading-overlay">
            <div className="admin-spinner" style={{ width: '28px', height: '28px' }}></div>
            <span style={{ fontSize: '13px', marginTop: '8px' }}>Uploading Media...</span>
          </div>
        ) : value ? (
          <div className="intelligent-image-preview-wrapper" onClick={(e) => e.stopPropagation()}>
            {isVideoUrl(value) ? (
              value.includes('youtube.com') || value.includes('youtu.be') ? (
                <iframe
                  src={value.replace('watch?v=', 'embed/')}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title="Video Preview"
                />
              ) : (
                <video src={value} controls style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              )
            ) : (
              <img src={value} alt="Preview" className="intelligent-image-preview" />
            )}
            <div className="intelligent-image-hover-overlay" onClick={triggerFileBrowser}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Click or drop media to replace</span>
            </div>
            <button
              type="button"
              className="intelligent-image-clear"
              title="Clear Media"
              onClick={() => onChange('')}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="intelligent-image-prompt">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: '500' }}>
              <span style={{ color: '#38BDF8' }}>Click to browse</span>, drag media, or paste (Ctrl+V)
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              Supports PNG, JPG, JPEG, SVG, WebP, MP4, WEBM
            </div>
          </div>
        )}
      </div>

      <div className="intelligent-image-url-row">
        <input
          type="text"
          className="admin-form-control"
          style={{ fontSize: '12px', padding: '8px 12px' }}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder={placeholder || "Or paste direct media URL here..."}
        />
        {onBrowseLibrary && (
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: '12px', padding: '8px 12px', whiteSpace: 'nowrap' }}
            onClick={onBrowseLibrary}
          >
            📁 Browse Media
          </button>
        )}
      </div>
    </div>
  );
}

// API calls helper
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('skylife_admin_token')}`
  };
};

const defaultLayout = [
  { id: "hero", name: "Hero Banner", visible: true },
  { id: "highlights", name: "Recent Highlights & Achievements", visible: true },
  { id: "who-we-are", name: "Who We Are", visible: true },
  { id: "products", name: "Our Products", visible: true },
  { id: "services", name: "Our Services", visible: true },
  { id: "dynamic-sections", name: "Flexible Content Blocks", visible: true },
  { id: "statistics", name: "Statistics Counters", visible: true },
  { id: "cta", name: "Call to Action Banner", visible: true }
];

export default function AdminDashboard({ content, onUpdateContent, onGoHome }) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('skylife_admin_token') === 'fake-jwt-token-skylife-123';
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CMS state (local draft copy before clicking Save Changes)
  const [localContent, setLocalContent] = useState(() => {
    return content ? JSON.parse(JSON.stringify(content)) : null;
  });
  const [activeTab, setActiveTab] = useState('homepage');
  const [homepageSubTab, setHomepageSubTab] = useState('hero');
  const [productsSubTab, setProductsSubTab] = useState('products-list');


  // Media items list
  const [mediaList, setMediaList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Notification banner
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved', 'error'
  const isFirstRender = useRef(true);
  const saveTimerRef = useRef(null);

  const cleanText = (text) => {
    if (!text) return '';
    return text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  const handlePasteTextarea = (e, callback) => {
    e.preventDefault();
    const pastedText = e.clipboardData?.getData('text') || '';
    const cleaned = cleanText(pastedText);
    const target = e.target;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const value = target.value;
    const newValue = value.substring(0, start) + cleaned + value.substring(end);
    callback(newValue);
    setTimeout(() => {
      target.selectionStart = target.selectionEnd = start + cleaned.length;
    }, 0);
  };

  const triggerAutoSave = useCallback((contentToSave = null) => {
    const data = contentToSave || localContent;
    if (!data) return;

    setSaveStatus('saving');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    fetch('/api/content', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    })
      .then(async res => {
        if (res.ok) {
          onUpdateContent(data);
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
        }
      })
      .catch(err => {
        console.error('Auto-save network error:', err);
        setSaveStatus('error');
      });
  }, [localContent, onUpdateContent]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaveStatus('unsaved');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      triggerAutoSave();
    }, 3000);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [localContent, triggerAutoSave]);

  const handleFieldBlur = () => {
    if (saveStatus === 'unsaved') {
      triggerAutoSave();
    }
  };

  // Edit forms state
  const [editingHighlight, setEditingHighlight] = useState(null); // highlight object being added/edited
  const [editingProduct, setEditingProduct] = useState(null); // product object being added/edited
  const [editingService, setEditingService] = useState(null); // service object being added/edited
  const [editingCategory, setEditingCategory] = useState(null); // category object being added/edited
  const [editingSection, setEditingSection] = useState(null); // dynamic section block being added/edited
  const [editingWhatWeDoSection, setEditingWhatWeDoSection] = useState(null); // whatWeDo section being added/edited

  // Inline Category Creator States
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [isCreatingNewCategoryInline, setIsCreatingNewCategoryInline] = useState(false);

  // Media Picker state (when selecting an image from media library instead of uploading)
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // { type: 'highlight'|'product', id: string, field: 'img'|'pdf', index: number }

  // Temporary list input states
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newAppText, setNewAppText] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Drag-and-drop reordering state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedCatIndex, setDraggedCatIndex] = useState(null);
  const [draggedLayoutIndex, setDraggedLayoutIndex] = useState(null);
  const [deletingCategoryTarget, setDeletingCategoryTarget] = useState(null);
  const [targetCategoryForMove, setTargetCategoryForMove] = useState('');

  // Per-tab live search query states
  const [highlightSearch, setHighlightSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [mediaSearch, setMediaSearch] = useState('');

  // Product URL Import states
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importProductName, setImportProductName] = useState('');
  const [importCategory, setImportCategory] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importPreview, setImportPreview] = useState(null);

  // Fetch all media from library
  const fetchMedia = () => {
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMediaList(data);
        }
      })
      .catch(err => console.error('Failed to fetch media library:', err));
  };

  // Fetch media if authenticated on mount / token change
  useEffect(() => {
    if (isAuthenticated) {
      fetchMedia();
    }
  }, [isAuthenticated]);

  // Show notification alert helper
  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const updateHeroField = (field, value) => {
    const heroCopy = { ...(localContent.hero || {}) };
    heroCopy[field] = value;
    const updated = { ...localContent, hero: heroCopy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const updateCTAField = (field, value) => {
    const ctaCopy = { ...(localContent.cta || {}) };
    ctaCopy[field] = value;
    const updated = { ...localContent, cta: ctaCopy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const updateFooterField = (field, value) => {
    const footerCopy = { ...(localContent.footer || {}) };
    footerCopy[field] = value;
    const updated = { ...localContent, footer: footerCopy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const updateFooterSocial = (social, value) => {
    const footerCopy = { ...(localContent.footer || {}) };
    footerCopy.socials = { ...(footerCopy.socials || {}) };
    footerCopy.socials[social] = value;
    const updated = { ...localContent, footer: footerCopy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const updateSalesField = (field, value) => {
    const salesCopy = { ...(localContent.sales || {}) };
    salesCopy[field] = value;
    const updated = { ...localContent, sales: salesCopy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const updateSalesSolution = (index, field, value) => {
    const salesCopy = { ...(localContent.sales || {}) };
    const sols = [...(salesCopy.solutions || [])];
    sols[index] = { ...sols[index], [field]: value };
    salesCopy.solutions = sols;
    const updated = { ...localContent, sales: salesCopy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const addSalesSolution = () => {
    const salesCopy = { ...(localContent.sales || {}) };
    const sols = [...(salesCopy.solutions || [])];
    sols.push({ title: "New Solution Area", points: ["New point"] });
    salesCopy.solutions = sols;
    const updated = { ...localContent, sales: salesCopy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const deleteSalesSolution = (index) => {
    const salesCopy = { ...(localContent.sales || {}) };
    const sols = [...(salesCopy.solutions || [])];
    sols.splice(index, 1);
    salesCopy.solutions = sols;
    const updated = { ...localContent, sales: salesCopy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const moveSalesSolution = (index, direction) => {
    const salesCopy = { ...(localContent.sales || {}) };
    const sols = [...(salesCopy.solutions || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= sols.length) return;
    const temp = sols[index];
    sols[index] = sols[targetIdx];
    sols[targetIdx] = temp;
    salesCopy.solutions = sols;
    const updated = { ...localContent, sales: salesCopy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  // ─── SERVICE REORDER ─────────────────────────────────────────────────────
  const moveService = (index, direction) => {
    const svcs = [...(localContent.services || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= svcs.length) return;
    [svcs[index], svcs[targetIdx]] = [svcs[targetIdx], svcs[index]];
    const updated = { ...localContent, services: svcs };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  // ─── WHAT WE DO HELPERS ───────────────────────────────────────────────────
  const updateWhatWeDoField = (field, value) => {
    const copy = { ...(localContent.whatWeDo || {}) };
    copy[field] = value;
    const updated = { ...localContent, whatWeDo: copy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const updateWhatWeDoWhyUs = (index, value) => {
    const copy = { ...(localContent.whatWeDo || {}) };
    const list = [...(copy.whyUs || [])];
    list[index] = { ...list[index], title: value };
    copy.whyUs = list;
    const updated = { ...localContent, whatWeDo: copy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const addWhatWeDoWhyUs = () => {
    const copy = { ...(localContent.whatWeDo || {}) };
    const list = [...(copy.whyUs || []), { title: 'New Advantage Point' }];
    copy.whyUs = list;
    const updated = { ...localContent, whatWeDo: copy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const deleteWhatWeDoWhyUs = (index) => {
    const copy = { ...(localContent.whatWeDo || {}) };
    const list = [...(copy.whyUs || [])].filter((_, i) => i !== index);
    copy.whyUs = list;
    const updated = { ...localContent, whatWeDo: copy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const moveWhatWeDoSection = (index, direction) => {
    const copy = { ...(localContent.whatWeDo || {}) };
    const list = [...(copy.sections || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    [list[index], list[targetIdx]] = [list[targetIdx], list[index]];
    copy.sections = list;
    const updated = { ...localContent, whatWeDo: copy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const deleteWhatWeDoSection = (index) => {
    const copy = { ...(localContent.whatWeDo || {}) };
    const list = [...(copy.sections || [])].filter((_, i) => i !== index);
    copy.sections = list;
    const updated = { ...localContent, whatWeDo: copy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };

  const saveWhatWeDoSection = (section) => {
    const copy = { ...(localContent.whatWeDo || {}) };
    const list = [...(copy.sections || [])];
    if (section.id === 'new') {
      list.push({ ...section, id: `wwds-${Date.now()}` });
    } else {
      const idx = list.findIndex(s => s.id === section.id);
      if (idx !== -1) list[idx] = section;
      else list.push(section);
    }
    copy.sections = list;
    const updated = { ...localContent, whatWeDo: copy };
    setLocalContent(updated);
    triggerAutoSave(updated);
  };



  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('skylife_admin_token', data.token);
          setIsAuthenticated(true);
          fetchMedia();
          triggerNotification('Authenticated successfully', 'success');
        } else {
          setAuthError(data.error || 'Invalid credentials');
        }
      })
      .catch(err => {
        setAuthError('Network error connecting to backend: ' + err.message);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('skylife_admin_token');
    setIsAuthenticated(false);
    triggerNotification('Logged out successfully', 'success');
  };



  // File uploading handler
  const handleFileUpload = (e, onComplete) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('skylife_admin_token')}`
      },
      body: formData
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          fetchMedia(); // Refresh media library list
          if (onComplete) {
            onComplete(data.url);
          }
          triggerNotification('File uploaded successfully: ' + data.filename, 'success');
        } else {
          setUploadError(data.error || 'Failed to upload file');
        }
      })
      .catch(err => {
        setUploadError('Network error uploading file: ' + err.message);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // Delete media item handler
  const handleDeleteMedia = (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}? This cannot be undone.`)) return;

    fetch(`/api/media?name=${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
      .then(async res => {
        if (res.ok) {
          fetchMedia(); // refresh list
          triggerNotification('Media file deleted', 'success');
        } else {
          const data = await res.json();
          triggerNotification(data.error || 'Failed to delete file', 'danger');
        }
      })
      .catch(err => {
        triggerNotification('Network error: ' + err.message, 'danger');
      });
  };

  // Product URL Importer handler
  const handleImportProduct = async () => {
    if (!importUrl.trim()) { setImportError('Please enter a product URL.'); return; }
    if (!importCategory) { setImportError('Please select a category.'); return; }

    setImportLoading(true);
    setImportError('');
    setImportPreview(null);

    try {
      const res = await fetch('/api/import-product', {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      // Show preview so the user can confirm
      setImportPreview(data);
    } catch (err) {
      setImportError(err.message);
    } finally {
      setImportLoading(false);
    }
  };

  // Confirm and create the imported product immediately
  const handleConfirmImport = () => {
    if (!importPreview) return;

    const finalName = importProductName.trim() || importPreview.title || 'Imported Product';
    const slug = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    // Build combined description from all extracted text sections
    let fullDesc = importPreview.description || '';
    if (importPreview.features)     fullDesc += (fullDesc ? '\n\n' : '') + 'Features\n' + importPreview.features;
    if (importPreview.applications) fullDesc += (fullDesc ? '\n\n' : '') + 'Applications\n' + importPreview.applications;
    if (importPreview.faq)          fullDesc += (fullDesc ? '\n\n' : '') + 'FAQ\n' + importPreview.faq;

    const newProduct = {
      id:               'p-' + Date.now(),
      name:             finalName,
      slug:             slug,
      category:         importCategory,
      desc:             fullDesc.trim(),
      technicalOverview: importPreview.specifications || '',
      img:              importPreview.images[0] || '',
      images:           importPreview.images.slice(0, 10),
      videos:           importPreview.videos || [],
      pdf:              importPreview.pdfLinks[0] || '',
      sourceUrl:        importPreview.sourceUrl || importUrl,
    };

    const updatedContent = {
      ...localContent,
      products: [...(localContent.products || []), newProduct]
    };

    setLocalContent(updatedContent);
    triggerAutoSave(updatedContent);
    triggerNotification(`✅ "${finalName}" imported and created!`, 'success');

    // Reset import panel and open editor for quick review
    setShowImportPanel(false);
    setImportUrl('');
    setImportProductName('');
    setImportPreview(null);
    setImportError('');

    // Open the product editor immediately for any refinements
    setTimeout(() => setEditingProduct(newProduct), 300);
  };

  // HTML5 Drag and Drop Handlers for highlights
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Store index to satisfy older Firefox versions
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const list = [...localContent.highlights];
    const [removed] = list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, removed);

    const updatedContent = { ...localContent, highlights: list };
    setLocalContent(updatedContent);
    triggerAutoSave(updatedContent);
    setDraggedIndex(null);
  };

  // Category Drag and Drop Handlers
  const handleCatDragStart = (e, index) => {
    setDraggedCatIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleCatDragOver = (e) => {
    e.preventDefault();
  };

  const handleCatDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedCatIndex === null || draggedCatIndex === targetIndex) return;

    const list = [...(localContent.categories || [])];
    const [removed] = list.splice(draggedCatIndex, 1);
    list.splice(targetIndex, 0, removed);

    const updatedContent = { ...localContent, categories: list };
    setLocalContent(updatedContent);
    triggerAutoSave(updatedContent);
    setDraggedCatIndex(null);
  };

  // Homepage Layout Drag and Drop Handlers
  const handleLayoutDragStart = (e, index) => {
    setDraggedLayoutIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleLayoutDragOver = (e) => {
    e.preventDefault();
  };

  const handleLayoutDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedLayoutIndex === null || draggedLayoutIndex === targetIndex) return;

    const list = [...(localContent.homepageLayout || defaultLayout)];
    const [removed] = list.splice(draggedLayoutIndex, 1);
    list.splice(targetIndex, 0, removed);

    const updatedContent = { ...localContent, homepageLayout: list };
    setLocalContent(updatedContent);
    triggerAutoSave(updatedContent);
    setDraggedLayoutIndex(null);
  };

  // Media selection callbacks
  const openMediaPicker = (targetType, id, fieldName, index = null) => {
    setMediaPickerTarget({ type: targetType, id, field: fieldName, index });
    setActiveTab('media');
    triggerNotification('Choose a file from the media list to apply.', 'success');
  };

  const handleSelectMediaItem = (url) => {
    if (!mediaPickerTarget) return;

    const { type, field, index } = mediaPickerTarget;

    if (type === 'highlight') {
      if (field === 'media' && index !== null) {
        setEditingHighlight(prev => {
          if (!prev) return prev;
          const mList = [...(prev.media || [])];
          mList[index] = { ...mList[index], url };
          return { ...prev, media: mList };
        });
      } else {
        setEditingHighlight(prev => prev ? { ...prev, [field]: url } : null);
      }
    } else if (type === 'product') {
      if (field === 'images' && index !== null) {
        setEditingProduct(prev => {
          if (!prev) return prev;
          const imgs = [...(prev.images || [])];
          imgs[index] = url;
          return { ...prev, images: imgs };
        });
      } else {
        setEditingProduct(prev => prev ? { ...prev, [field]: url } : null);
      }
    } else if (type === 'category') {
      setEditingCategory(prev => prev ? { ...prev, [field]: url } : null);
    } else if (type === 'category-inline') {
      setNewCategoryImage(url);
    } else if (type === 'section') {
      setEditingSection(prev => prev ? { ...prev, [field]: url } : null);
    } else if (type === 'hero') {
      setLocalContent(prev => {
        const hero = { ...(prev.hero || {}) };
        hero[field] = url;
        const updated = { ...prev, hero };
        triggerAutoSave(updated);
        return updated;
      });
    } else if (type === 'hero-bg') {
      setLocalContent(prev => {
        const hero = { ...(prev.hero || {}) };
        hero.bgUrl = url;
        const updated = { ...prev, hero };
        triggerAutoSave(updated);
        return updated;
      });
    } else if (type === 'slideshow') {
      setLocalContent(prev => {
        const hero = { ...(prev.hero || {}) };
        const imgs = [...(hero.slideshowImages || [])];
        if (index !== null) {
          imgs[index] = url;
        }
        hero.slideshowImages = imgs;
        const updated = { ...prev, hero };
        triggerAutoSave(updated);
        return updated;
      });
    } else if (type === 'profile') {
      setLocalContent(prev => {
        const aboutUs = { ...(prev.aboutUs || {}) };
        aboutUs.profileImage = url;
        const updated = { ...prev, aboutUs };
        triggerAutoSave(updated);
        return updated;
      });
    }

    setMediaPickerTarget(null);
    
    if (type === 'highlight') {
      setActiveTab('highlights');
    } else if (type === 'category' || type === 'category-inline') {
      setProductsSubTab('categories-list');
      setActiveTab('products');
    } else if (type === 'section') {
      setHomepageSubTab('blocks');
      setActiveTab('homepage');
    } else if (type === 'hero' || type === 'hero-bg' || type === 'slideshow') {
      setHomepageSubTab('hero');
      setActiveTab('homepage');
    } else if (type === 'profile') {
      setActiveTab('about-us');
    } else {
      setProductsSubTab('products-list');
      setActiveTab('products');
    }
    triggerNotification('Media applied successfully', 'success');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-cms-root">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h2 className="admin-login-title">SKY LIFE SCIENCES</h2>
            <p className="admin-login-subtitle">Admin CMS Content Manager Login</p>

            {authError && (
              <div className="admin-alert admin-alert-danger" style={{ padding: '10px 14px', marginBottom: '20px' }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Username</label>
                <input
                  type="text"
                  className="admin-form-control"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Password</label>
                <input
                  type="password"
                  className="admin-form-control"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Verifying...' : 'Login to Dashboard'}
              </button>

              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                onClick={onGoHome}
              >
                ← Back to Home
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!localContent) {
    return (
      <div className="admin-cms-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="admin-spinner"></div>
        <p style={{ marginLeft: '12px' }}>Loading CMS Configuration...</p>
      </div>
    );
  }

  return (
    <div className="admin-cms-root">
      {/* Top Banner Alert */}
      {notification.show && (
        <div
          className={`admin-alert admin-alert-${notification.type}`}
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '2000', minWidth: '300px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
        >
          <span>{notification.message}</span>
          <button style={{ color: 'inherit', marginLeft: '16px', fontWeight: 'bold' }} onClick={() => setNotification(prev => ({ ...prev, show: false }))}>✕</button>
        </div>
      )}

      <div className="admin-dashboard-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            <img src="/logo.jpg" alt="Skylife logo" style={{ borderRadius: '5px' }} />
            <div>
              <div className="admin-sidebar-logo-text">SKY LIFE SCIENCES</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>CMS Editor v1.0</div>
            </div>
          </div>

          <nav className="admin-nav-list">
            <button
              className={`admin-nav-item ${activeTab === 'homepage' ? 'active' : ''}`}
              onClick={() => { setActiveTab('homepage'); setMediaPickerTarget(null); }}
            >
              🏠 Homepage
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => { setActiveTab('products'); setMediaPickerTarget(null); setProductSearch(''); setCategorySearch(''); }}
            >
              📦 Products
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => { setActiveTab('services'); setMediaPickerTarget(null); setServiceSearch(''); }}
            >
              ⚙️ Services
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => { setActiveTab('sales'); setMediaPickerTarget(null); }}
            >
              💼 What We Do
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'about-us' ? 'active' : ''}`}
              onClick={() => { setActiveTab('about-us'); setMediaPickerTarget(null); }}
            >
              🏢 About Us
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'highlights' ? 'active' : ''}`}
              onClick={() => { setActiveTab('highlights'); setMediaPickerTarget(null); setHighlightSearch(''); }}
            >
              ⭐ Recent Highlights
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'footer' ? 'active' : ''}`}
              onClick={() => { setActiveTab('footer'); setMediaPickerTarget(null); }}
            >
              👣 Footer
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('settings'); setMediaPickerTarget(null); setMediaSearch(''); }}
            >
              🛠️ Settings
            </button>

            <div className="admin-nav-logout">
              <button
                className="admin-nav-item"
                style={{ color: '#F87171' }}
                onClick={handleLogout}
              >
                🚪 Logout CMS
              </button>
              <button
                className="admin-nav-item"
                style={{ color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.2)', marginTop: '8px' }}
                onClick={onGoHome}
              >
                👁️ View Live Website
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Panel Content */}
        <main className="admin-main-content">
          {/* Header Row */}
          <div className="admin-panel-header">
            <div>
              <h1 className="admin-panel-title">
                {activeTab === 'homepage' && 'Homepage Content & Section Manager'}
                {activeTab === 'products' && 'Product Catalog & Category Manager'}
                {activeTab === 'services' && 'Services Management'}
                {activeTab === 'sales' && 'What We Do Page Solutions'}
                {activeTab === 'about-us' && 'Company Profile & Statistics Counters'}
                {activeTab === 'highlights' && 'Recent Highlights & Achievements'}
                {activeTab === 'footer' && 'Footer Settings — Contact, Socials & Map'}
                {activeTab === 'settings' && (mediaPickerTarget ? 'Choose File from Media Library' : 'CMS Settings & Media Library')}
              </h1>
              <p className="admin-panel-subtitle">
                {activeTab === 'homepage' && 'Edit Hero content, background, reorder layout sections, manage dynamic content blocks and CTA.'}
                {activeTab === 'products' && 'Add, edit, delete catalog products, manage dynamic categories, and import products.'}
                {activeTab === 'services' && 'Create, edit, reorder and delete services. No defaults — only services you add will appear.'}
                {activeTab === 'sales' && 'Configure and manage solution areas presented on the What We Do capabilities page.'}
                {activeTab === 'about-us' && 'Manage Corporate profile description, profile picture, and dynamic counter targets.'}
                {activeTab === 'highlights' && 'Manage carousel highlights cards, titles, descriptions, and media contents.'}
                {activeTab === 'footer' && 'Update email, phone, LinkedIn, Instagram, Google Map embed, and legal links.'}
                {activeTab === 'settings' && (mediaPickerTarget ? `Pick a file to set as ${mediaPickerTarget.field} for ${mediaPickerTarget.type}.` : 'Upload and delete images, specification sheets, and browse assets.')}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: saveStatus === 'saving' ? '#38BDF8' : saveStatus === 'saved' ? '#34D399' : saveStatus === 'error' ? '#EF4444' : '#94A3B8' }}>
                {saveStatus === 'saving' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span className="admin-spinner" style={{ width: '12px', height: '12px', borderWidth: '2px', borderLeftColor: '#38BDF8' }}></span>
                    Saving...
                  </span>
                )}
                {saveStatus === 'saved' && 'Saved ✓'}
                {saveStatus === 'unsaved' && 'Unsaved Changes'}
                {saveStatus === 'error' && '⚠️ Auto-save failed'}
              </span>
              <button
                className="admin-btn admin-btn-primary"
                style={{ fontSize: '14px', padding: '12px 24px', backgroundColor: '#10B981', color: '#FFF' }}
                onClick={() => triggerAutoSave()}
                disabled={saveStatus === 'saving'}
              >
                💾 Force Save
              </button>
            </div>
          </div>

          {/* TAB 1: HIGHLIGHTS */}
          {activeTab === 'highlights' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flexGrow: 1, maxWidth: '420px' }}>
                  <input
                    type="text"
                    className="admin-form-control"
                    style={{ paddingLeft: '36px', fontSize: '13px' }}
                    placeholder="Search highlights by title or description..."
                    value={highlightSearch}
                    onChange={(e) => setHighlightSearch(e.target.value)}
                  />
                  <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  {highlightSearch && <button style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px', lineHeight: 1 }} onClick={() => setHighlightSearch('')}>✕</button>}
                </div>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setEditingHighlight({ id: 'new', title: '', desc: '', img: '', date: '' })}
                >
                  ➕ Add Highlight Card
                </button>
              </div>

              <div className="admin-highlights-list">
                {localContent.highlights
                  .filter(item => !highlightSearch ||
                    item.title?.toLowerCase().includes(highlightSearch.toLowerCase()) ||
                    item.desc?.toLowerCase().includes(highlightSearch.toLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      key={item.id || index}
                      className={`admin-highlight-item ${draggedIndex === index ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <div className="admin-drag-handle">
                        ☰
                      </div>
                      {item.img && (
                        <img src={item.img} alt={item.title} className="admin-highlight-thumb" />
                      )}
                      <div className="admin-highlight-info">
                        <div className="admin-highlight-title">{item.title}</div>
                        <div className="admin-highlight-desc">{item.desc}</div>
                        {item.date && (
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>📅 {item.date}</div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '6px 12px' }}
                          onClick={() => setEditingHighlight(item)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '6px 12px' }}
                          onClick={() => {
                            if (window.confirm('Delete this highlight card?')) {
                              setLocalContent(prev => ({
                                ...prev,
                                highlights: prev.highlights.filter(h => h.id !== item.id)
                              }));
                            }
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && productsSubTab === 'products-list' && (
            <div>
              {/* Products Sub-tab Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <button className="admin-btn admin-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>📦 Products Database</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setProductsSubTab('categories-list')}>📁 Categories Directory</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flexGrow: 1, maxWidth: '420px' }}>
                  <input
                    type="text"
                    className="admin-form-control"
                    style={{ paddingLeft: '36px', fontSize: '13px' }}
                    placeholder="Search products by name or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  {productSearch && <button style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px', lineHeight: 1 }} onClick={() => setProductSearch('')}>✕</button>}
                </div>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setEditingProduct({ id: 'new', name: '', category: localContent.categories[0]?.id || '', desc: '', img: '', pdf: '' })}
                >
                  ➕ Add Catalog Product
                </button>
                <button
                  className={`admin-btn ${showImportPanel ? 'admin-btn-danger' : 'admin-btn-secondary'}`}
                  style={{ gap: '6px', display: 'inline-flex', alignItems: 'center' }}
                  onClick={() => { setShowImportPanel(p => !p); setImportPreview(null); setImportError(''); }}
                >
                  {showImportPanel ? '✕ Close Importer' : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Import from URL
                    </>
                  )}
                </button>
              </div>

              {/* ── Import Product from URL Panel ─────────────────────────── */}
              {showImportPanel && (
                <div style={{
                  marginBottom: '24px',
                  background: 'linear-gradient(135deg, rgba(56,189,248,0.05) 0%, rgba(99,102,241,0.05) 100%)',
                  border: '1px solid rgba(56,189,248,0.2)',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#F1F5F9', margin: 0 }}>Import Product from URL</h3>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Paste a product URL from Zaiput, Corning, IKA, or any manufacturer.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    {/* Category Selector */}
                    <div>
                      <label className="admin-label">1. Select Category *</label>
                      <select
                        className="admin-form-control"
                        value={importCategory}
                        onChange={(e) => { setImportCategory(e.target.value); setImportError(''); }}
                      >
                        <option value="">— Choose category —</option>
                        {(localContent.categories || []).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Product Name Override */}
                    <div>
                      <label className="admin-label">2. Product Name <span style={{ color: '#64748B' }}>(optional — auto-detected)</span></label>
                      <input
                        type="text"
                        className="admin-form-control"
                        placeholder="Leave blank to use detected title..."
                        value={importProductName}
                        onChange={(e) => setImportProductName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* URL Input + Import Button */}
                  <div>
                    <label className="admin-label">3. Product Page URL *</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <input
                        type="url"
                        className="admin-form-control"
                        placeholder="https://www.zaiput.com/product/..."
                        value={importUrl}
                        onChange={(e) => { setImportUrl(e.target.value); setImportError(''); setImportPreview(null); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleImportProduct(); }}
                        style={{ flexGrow: 1 }}
                      />
                      <button
                        className="admin-btn admin-btn-primary"
                        style={{ whiteSpace: 'nowrap', minWidth: '140px', padding: '10px 20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        onClick={handleImportProduct}
                        disabled={importLoading || !importUrl.trim() || !importCategory}
                      >
                        {importLoading ? (
                          <>
                            <span className="admin-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderLeftColor: '#FFF' }}></span>
                            Fetching...
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            Import Product
                          </>
                        )}
                      </button>
                    </div>
                    {importError && (
                      <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {importError}
                      </p>
                    )}
                  </div>

                  {/* Preview Card — shown after successful scrape */}
                  {importPreview && (
                    <div style={{ marginTop: '20px', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '10px', background: 'rgba(52,211,153,0.04)', padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px' }}>
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style={{ fontSize: '12px', color: '#34D399', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Extraction Successful</span>
                          </div>
                          <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#F1F5F9', margin: '0 0 4px 0' }}>
                            {importProductName.trim() || importPreview.title || '(No title detected)'}
                          </h4>
                          <a href={importPreview.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#64748B', wordBreak: 'break-all' }}>
                            {importPreview.sourceUrl}
                          </a>
                        </div>
                        {importPreview.images[0] && (
                          <img src={importPreview.images[0]} alt="preview" style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} />
                        )}
                      </div>

                      {/* Extraction summary chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                        {[
                          { label: `${importPreview.images.length} Images`, active: importPreview.images.length > 0, icon: '🖼️' },
                          { label: `${importPreview.videos.length} Videos`, active: importPreview.videos.length > 0, icon: '🎬' },
                          { label: `${importPreview.pdfLinks.length} PDFs`, active: importPreview.pdfLinks.length > 0, icon: '📄' },
                          { label: 'Description', active: !!importPreview.description, icon: '📝' },
                          { label: 'Features', active: !!importPreview.features, icon: '✅' },
                          { label: 'Applications', active: !!importPreview.applications, icon: '🔬' },
                          { label: 'Specifications', active: !!importPreview.specifications, icon: '📐' },
                          { label: 'FAQ', active: !!importPreview.faq, icon: '❓' },
                        ].map(chip => (
                          <span key={chip.label} style={{
                            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500',
                            backgroundColor: chip.active ? 'rgba(52,211,153,0.12)' : 'rgba(100,116,139,0.1)',
                            color: chip.active ? '#34D399' : '#64748B',
                            border: `1px solid ${chip.active ? 'rgba(52,211,153,0.25)' : 'rgba(100,116,139,0.15)'}`,
                          }}>
                            {chip.icon} {chip.label}
                          </span>
                        ))}
                      </div>

                      {/* Description snippet */}
                      {importPreview.description && (
                        <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', margin: '0 0 16px 0', borderLeft: '2px solid rgba(52,211,153,0.3)', paddingLeft: '10px' }}>
                          {importPreview.description.slice(0, 280)}{importPreview.description.length > 280 ? '…' : ''}
                        </p>
                      )}

                      {/* Create Product Button */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                          className="admin-btn admin-btn-primary"
                          style={{ backgroundColor: '#34D399', color: '#0F172A', fontWeight: '700', padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                          onClick={handleConfirmImport}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Create Product Now
                        </button>
                        <button
                          className="admin-btn admin-btn-secondary"
                          style={{ fontSize: '12px' }}
                          onClick={() => { setImportPreview(null); setImportUrl(''); }}
                        >
                          Try Different URL
                        </button>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          The product editor will open automatically after creation.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Brochure</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {localContent.products
                    .filter(prod => {
                      if (!productSearch) return true;
                      const q = productSearch.toLowerCase();
                      const catObj = localContent.categories.find(c => c.id === prod.category);
                      return prod.name?.toLowerCase().includes(q) ||
                        catObj?.title?.toLowerCase().includes(q) ||
                        prod.desc?.toLowerCase().includes(q);
                    })
                    .map((prod, index) => {
                      const catObj = localContent.categories.find(c => c.id === prod.category);
                      return (
                        <tr key={prod.id || index}>
                          <td>
                            {prod.img ? (
                              <img src={prod.img} alt={prod.name} style={{ width: '50px', height: '40px', objectFit: 'contain', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#0B0F19' }} />
                            ) : (
                              <span style={{ fontSize: '11px', color: '#64748B' }}>No image</span>
                            )}
                          </td>
                          <td style={{ fontWeight: '500' }}>{prod.name}</td>
                          <td>
                            <span className="admin-badge admin-badge-info">
                              {catObj ? catObj.title : prod.category}
                            </span>
                          </td>
                          <td>
                            {prod.pdf ? (
                              <a href={prod.pdf} target="_blank" rel="noopener noreferrer" style={{ color: '#F87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📕 PDF Spec
                              </a>
                            ) : (
                              <span style={{ fontSize: '11px', color: '#64748B' }}>None</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '6px 12px' }}
                                onClick={() => setEditingProduct(prod)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="admin-btn admin-btn-danger"
                                style={{ padding: '6px 12px' }}
                                onClick={() => {
                                  if (window.confirm('Delete this product?')) {
                                    setLocalContent(prev => ({
                                      ...prev,
                                      products: prev.products.filter(p => p.id !== prod.id)
                                    }));
                                  }
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: ABOUT US & STATISTICS */}
          {activeTab === 'about-us' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
              {/* About Us Paragraph */}
              <div className="admin-card-box" style={{ background: '#1E293B', padding: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: '#FFF' }}>Edit Corporate Description</h3>

                <div className="admin-form-group">
                  <label className="admin-form-label">About Us Company Profile</label>
                  <textarea
                    className="admin-form-control"
                    rows="10"
                    value={localContent.aboutUs?.description || ''}
                    onChange={(e) => {
                      const desc = e.target.value;
                      setLocalContent(prev => ({
                        ...prev,
                        aboutUs: { ...(prev.aboutUs || {}), description: desc }
                      }));
                    }}
                    onPaste={(e) => handlePasteTextarea(e, (val) => {
                      setLocalContent(prev => ({
                        ...prev,
                        aboutUs: { ...(prev.aboutUs || {}), description: val }
                      }));
                    })}
                    onBlur={handleFieldBlur}
                  ></textarea>
                </div>

                <div className="admin-form-group" style={{ marginTop: '24px' }}>
                  <label className="admin-form-label">Corporate Profile Scientist Image</label>
                  <IntelligentMediaInput
                    value={localContent.aboutUs?.profileImage || ''}
                    onChange={(url) => {
                      setLocalContent(prev => {
                        const aboutUsCopy = { ...(prev.aboutUs || {}) };
                        aboutUsCopy.profileImage = url;
                        const updated = { ...prev, aboutUs: aboutUsCopy };
                        triggerAutoSave(updated);
                        return updated;
                      });
                    }}
                    placeholder="Upload or paste direct image URL..."
                    onBrowseLibrary={() => openMediaPicker('profile', 'aboutUs', 'profileImage')}
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="admin-card-box" style={{ background: '#1E293B', padding: '30px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', color: '#FFF' }}>Update Statistics Counters</h3>

                {localContent.statistics.map((stat, idx) => (
                  <div key={idx} style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: idx < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <h4 style={{ fontSize: '13px', color: '#38BDF8', marginBottom: '12px', textTransform: 'uppercase' }}>Counter {idx + 1}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '12px', marginBottom: '8px' }}>
                      <div>
                        <label className="admin-form-label" style={{ fontSize: '11px' }}>Numeric Target</label>
                        <input
                          type="text"
                          className="admin-form-control"
                          value={stat.target}
                          onChange={(e) => {
                            const val = e.target.value;
                            const statsCopy = [...localContent.statistics];
                            statsCopy[idx].target = val;
                            setLocalContent(prev => ({ ...prev, statistics: statsCopy }));
                          }}
                          onBlur={handleFieldBlur}
                        />
                      </div>
                      <div>
                        <label className="admin-form-label" style={{ fontSize: '11px' }}>Suffix</label>
                        <input
                          type="text"
                          className="admin-form-control"
                          value={stat.suffix}
                          onChange={(e) => {
                            const val = e.target.value;
                            const statsCopy = [...localContent.statistics];
                            statsCopy[idx].suffix = val;
                            setLocalContent(prev => ({ ...prev, statistics: statsCopy }));
                          }}
                          onBlur={handleFieldBlur}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="admin-form-label" style={{ fontSize: '11px' }}>Label Text</label>
                      <input
                        type="text"
                        className="admin-form-control"
                        value={stat.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          const statsCopy = [...localContent.statistics];
                          statsCopy[idx].label = val;
                          setLocalContent(prev => ({ ...prev, statistics: statsCopy }));
                        }}
                        onBlur={handleFieldBlur}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flexGrow: 1, maxWidth: '420px' }}>
                  <input
                    type="text"
                    className="admin-form-control"
                    style={{ paddingLeft: '36px', fontSize: '13px' }}
                    placeholder="Search services by title or description..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                  />
                  <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  {serviceSearch && <button style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px', lineHeight: 1 }} onClick={() => setServiceSearch('')}>✕</button>}
                </div>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setEditingService({ id: 'new', title: '', desc: '', iconKey: 'separation', img: '', learnMore: '' })}
                >
                  ➕ Add New Service
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(localContent.services || [])
                  .filter(svc => !serviceSearch ||
                    svc.title?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                    svc.desc?.toLowerCase().includes(serviceSearch.toLowerCase())
                  )
                  .map((svc, idx) => {
                    const realIdx = (localContent.services || []).findIndex(s => s.id === svc.id);
                    return (
                      <div key={svc.id || idx} style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Thumbnail */}
                        {svc.img && (
                          <div style={{ width: '64px', height: '64px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                            <img src={svc.img} alt={svc.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                        )}
                        {/* Info */}
                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#FFF' }}>{svc.title}</span>
                            <span style={{ fontSize: '11px', color: '#38BDF8', background: 'rgba(56,189,248,0.1)', padding: '2px 7px', borderRadius: '4px' }}>{svc.iconKey}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0, lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{svc.desc}</p>
                          {svc.learnMore && <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>Link: {svc.learnMore}</span>}
                        </div>
                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="admin-btn admin-btn-secondary" style={{ padding: '3px 8px', fontSize: '11px' }} disabled={realIdx === 0} onClick={() => moveService(realIdx, -1)}>▲</button>
                            <button className="admin-btn admin-btn-secondary" style={{ padding: '3px 8px', fontSize: '11px' }} disabled={realIdx === (localContent.services || []).length - 1} onClick={() => moveService(realIdx, 1)}>▼</button>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="admin-btn admin-btn-secondary" style={{ padding: '3px 8px', fontSize: '11px', color: '#38BDF8' }} onClick={() => setEditingService(svc)}>✏️ Edit</button>
                            <button className="admin-btn admin-btn-danger" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => { if (window.confirm('Delete this service?')) { const updated = { ...localContent, services: (localContent.services || []).filter(s => s.id !== svc.id) }; setLocalContent(updated); triggerAutoSave(updated); } }}>🗑️</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {(localContent.services || []).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', background: '#1E293B', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                    No services yet. Click <strong style={{ color: '#38BDF8' }}>➕ Add New Service</strong> to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: WHAT WE DO MANAGER */}
          {activeTab === 'sales' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Row 1: Page Header Settings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-card-box" style={{ background: '#1E293B', padding: '28px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>📄 Page Header Settings</h3>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Page Main Title</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    value={localContent.whatWeDo?.pageTitle || localContent.sales?.title || ''}
                    onChange={(e) => updateWhatWeDoField('pageTitle', e.target.value)}
                    onBlur={handleFieldBlur}
                    placeholder="Delivering Intelligent Manufacturing Solutions"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Introduction Text</label>
                  <textarea
                    className="admin-form-control"
                    rows="4"
                    value={localContent.whatWeDo?.introText || localContent.sales?.subtitle || ''}
                    onChange={(e) => updateWhatWeDoField('introText', e.target.value)}
                    onBlur={handleFieldBlur}
                    placeholder="We provide end-to-end technology solutions..."
                  />
                </div>
              </div>

              <div className="admin-card-box" style={{ background: '#1E293B', padding: '28px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '18px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>🏷️ Closing Tagline</h3>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">Tagline Text (shown in closing banner)</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    value={localContent.whatWeDo?.tagline || ''}
                    onChange={(e) => updateWhatWeDoField('tagline', e.target.value)}
                    onBlur={handleFieldBlur}
                    placeholder="Enabling the Next Generation of Smart Continuous Manufacturing"
                  />
                </div>
              </div>
              </div>

              {/* Row 2: Capability Sections Manager */}
              <div className="admin-card-box" style={{ background: '#1E293B', padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#FFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>⚙️ Capability Sections</h3>
                  <button
                    className="admin-btn admin-btn-primary"
                    style={{ fontSize: '12px', padding: '7px 14px' }}
                    onClick={() => setEditingWhatWeDoSection({ id: 'new', title: '', description: '', icon: 'activity', image: '', video: '', backgroundImage: '', ctaButtonText: 'Learn More', ctaButtonLink: '#contact' })}
                  >
                    ➕ Add Section
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(localContent.whatWeDo?.sections || localContent.sales?.solutions || []).map((sec, idx) => (
                    <div key={sec.id || idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Thumbnail */}
                      {sec.image && (
                        <div style={{ width: '52px', height: '52px', flexShrink: 0, backgroundColor: '#FFF', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={sec.image} alt={sec.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                      )}
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#FFF', marginBottom: '3px' }}>{sec.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sec.description || (sec.points ? sec.points.join(' ') : '')}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="admin-btn admin-btn-secondary" style={{ padding: '3px 8px', fontSize: '11px' }} disabled={idx === 0} onClick={() => moveWhatWeDoSection(idx, -1)}>▲</button>
                          <button className="admin-btn admin-btn-secondary" style={{ padding: '3px 8px', fontSize: '11px' }} disabled={idx === (localContent.whatWeDo?.sections || localContent.sales?.solutions || []).length - 1} onClick={() => moveWhatWeDoSection(idx, 1)}>▼</button>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="admin-btn admin-btn-secondary" style={{ padding: '3px 8px', fontSize: '11px', color: '#38BDF8' }} onClick={() => setEditingWhatWeDoSection({ ...sec, id: sec.id || `wwds-${idx}` })}>✏️</button>
                          <button className="admin-btn admin-btn-danger" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => { if (window.confirm('Delete this section?')) deleteWhatWeDoSection(idx); }}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(localContent.whatWeDo?.sections || []).length === 0 && !(localContent.sales?.solutions?.length) && (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>No sections yet. Click <strong style={{ color: '#38BDF8' }}>➕ Add Section</strong> to create your first.</div>
                  )}
                </div>
              </div>

              {/* Row 3: Why Us Editor */}
              <div className="admin-card-box" style={{ background: '#1E293B', padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#FFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>⭐ Partnership Value (Why Us)</h3>
                  <button className="admin-btn admin-btn-secondary" style={{ fontSize: '12px', padding: '7px 14px' }} onClick={addWhatWeDoWhyUs}>➕ Add Point</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(localContent.whatWeDo?.whyUs || []).map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="text"
                        className="admin-form-control"
                        value={item.title || ''}
                        onChange={(e) => updateWhatWeDoWhyUs(idx, e.target.value)}
                        onBlur={handleFieldBlur}
                        style={{ fontSize: '13px' }}
                      />
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '6px 10px', fontSize: '12px', flexShrink: 0 }}
                        onClick={() => deleteWhatWeDoWhyUs(idx)}
                      >🗑️</button>
                    </div>
                  ))}
                  {(localContent.whatWeDo?.whyUs || []).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>No points yet. Click <strong style={{ color: '#38BDF8' }}>➕ Add Point</strong> above.</div>
                  )}
                </div>
              </div>

            </div>
          )}



          {/* TAB: CATEGORIES */}
          {activeTab === 'products' && productsSubTab === 'categories-list' && (
            <div>
              {/* Products Sub-tab Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setProductsSubTab('products-list')}>📦 Products Database</button>
                <button className="admin-btn admin-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>📁 Categories Directory</button>
              </div>
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                  Click <strong style={{ color: '#38BDF8' }}>✏️ Edit</strong> on any row to change the category name, image, description, and URL slug. Drag rows to reorder.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flexGrow: 1, maxWidth: '420px' }}>
                  <input
                    type="text"
                    className="admin-form-control"
                    style={{ paddingLeft: '36px', fontSize: '13px' }}
                    placeholder="Search categories by name, description or slug..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                  <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  {categorySearch && <button style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px', lineHeight: 1 }} onClick={() => setCategorySearch('')}>✕</button>}
                </div>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setEditingCategory({ id: 'new', title: '', desc: '', img: '', slug: '' })}
                >
                  ➕ Add New Category
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Order</th>
                    <th>Cover Image</th>
                    <th>Category Title</th>
                    <th>Slug / ID</th>
                    <th>Description</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Products</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(localContent.categories || [])
                    .filter(cat => !categorySearch ||
                      cat.title?.toLowerCase().includes(categorySearch.toLowerCase()) ||
                      cat.desc?.toLowerCase().includes(categorySearch.toLowerCase()) ||
                      cat.slug?.toLowerCase().includes(categorySearch.toLowerCase())
                    )
                    .map((cat, index) => (
                      <tr
                        key={cat.id || index}
                        draggable
                        onDragStart={(e) => handleCatDragStart(e, index)}
                        onDragOver={handleCatDragOver}
                        onDrop={(e) => handleCatDrop(e, index)}
                        style={{ opacity: draggedCatIndex === index ? 0.4 : 1 }}
                      >
                        <td style={{ cursor: 'grab', textAlign: 'center', color: '#64748B', fontWeight: 'bold', userSelect: 'none' }}>☰</td>
                        <td>
                          {cat.img ? (
                            <img src={cat.img} alt={cat.title} style={{ width: '50px', height: '40px', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: '#0B0F19' }} />
                          ) : (
                            <span style={{ fontSize: '11px', color: '#64748B' }}>No image</span>
                          )}
                        </td>
                        <td style={{ fontWeight: '500' }}>{cat.title}</td>
                        <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>{cat.slug || cat.id}</td>
                        <td style={{ fontSize: '13px', color: '#94A3B8', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.desc}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            minWidth: '28px', height: '22px', padding: '0 6px',
                            borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                            backgroundColor: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.2)'
                          }}>
                            {(localContent.products || []).filter(p => p.category === cat.id).length}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="admin-btn admin-btn-primary"
                              style={{ padding: '6px 14px', fontSize: '12px' }}
                              title="Edit category name, image, description and URL slug"
                              onClick={() => setEditingCategory(cat)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="admin-btn admin-btn-danger"
                              style={{ padding: '6px 12px' }}
                              onClick={() => {
                                const associatedCount = (localContent.products || []).filter(p => p.category === cat.id).length;
                                if (associatedCount > 0) {
                                  setDeletingCategoryTarget(cat);
                                  setTargetCategoryForMove('');
                                } else {
                                  if (window.confirm(`Are you sure you want to delete empty category "${cat.title}"?`)) {
                                    const updatedContent = {
                                      ...localContent,
                                      categories: localContent.categories.filter(c => c.id !== cat.id)
                                    };
                                    setLocalContent(updatedContent);
                                    triggerAutoSave(updatedContent);
                                    triggerNotification(`Category "${cat.title}" deleted.`, 'success');
                                  }
                                }
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: DYNAMIC SECTIONS */}
          {activeTab === 'homepage' && homepageSubTab === 'blocks' && (
            <div>
              {/* Homepage Sub-tab Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', flexWrap: 'wrap' }}>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('hero')}>✨ Hero Section</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('reordering')}>🔄 Layout Ordering</button>
                <button className="admin-btn admin-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>🧩 Content Blocks</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('cta')}>📣 Bottom CTA</button>
              </div>
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                  Create and arrange landing page blocks. Dynamic sections appear in the order defined here. Use the <strong>▲ Up</strong> and <strong>▼ Down</strong> buttons to reorder.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => setEditingSection({ id: 'new', type: 'text', title: '', subtitle: '', text: '', img: '', align: 'right', videoUrl: '', buttonText: 'Learn More', buttonLink: 'contact', background: 'linear-gradient(135deg, #0f172a 0%, #136B36 100%)', stats: [] })}
                >
                  ➕ Add Custom Block
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '100px', textAlign: 'center' }}>Reorder</th>
                    <th style={{ width: '120px' }}>Type</th>
                    <th>Section Title</th>
                    <th>Subtitle/Meta</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(localContent.dynamicSections || []).map((sec, index) => (
                    <tr key={sec.id || index}>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            disabled={index === 0}
                            onClick={() => {
                              const list = [...(localContent.dynamicSections || [])];
                              const temp = list[index];
                              list[index] = list[index - 1];
                              list[index - 1] = temp;
                              const updated = { ...localContent, dynamicSections: list };
                              setLocalContent(updated);
                              triggerAutoSave(updated);
                            }}
                          >
                            ▲ Up
                          </button>
                          <button
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            disabled={index === (localContent.dynamicSections || []).length - 1}
                            onClick={() => {
                              const list = [...(localContent.dynamicSections || [])];
                              const temp = list[index];
                              list[index] = list[index + 1];
                              list[index + 1] = temp;
                              const updated = { ...localContent, dynamicSections: list };
                              setLocalContent(updated);
                              triggerAutoSave(updated);
                            }}
                          >
                            ▼ Down
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-info" style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                          {sec.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: '500' }}>{sec.title || <span style={{ color: '#64748B', fontStyle: 'italic' }}>Untitled Block</span>}</td>
                      <td style={{ fontSize: '13px', color: '#94A3B8' }}>{sec.subtitle || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="admin-btn admin-btn-primary"
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                            onClick={() => setEditingSection(sec)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '6px 12px' }}
                            onClick={() => {
                              if (window.confirm(`Delete content block "${sec.title || sec.type}"?`)) {
                                const list = (localContent.dynamicSections || []).filter(item => item.id !== sec.id);
                                const updated = { ...localContent, dynamicSections: list };
                                setLocalContent(updated);
                                triggerAutoSave(updated);
                                triggerNotification('Section deleted successfully', 'success');
                              }
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(localContent.dynamicSections || []).length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                        No custom content sections created yet. Click "Add Custom Block" above to begin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: HOMEPAGE HERO & CTA EDITORS */}
          {activeTab === 'homepage' && homepageSubTab === 'hero' && (
            <div>
              {/* Homepage Sub-tab Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', flexWrap: 'wrap' }}>
                <button className="admin-btn admin-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>✨ Hero Section</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('reordering')}>🔄 Layout Ordering</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('blocks')}>🧩 Content Blocks</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('cta')}>📣 Bottom CTA</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }}>
                <div className="admin-card-box" style={{ background: '#1E293B', padding: '30px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '20px', color: '#FFF' }}>Hero Typography & Action Links</h3>
                  
                  <div className="admin-form-group">
                    <label className="admin-form-label">Hero Title (HTML Supported)</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={localContent.hero?.title || ''}
                      onChange={(e) => updateHeroField('title', e.target.value)}
                      onBlur={handleFieldBlur}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Hero Description Paragraph</label>
                    <textarea
                      className="admin-form-control"
                      rows="6"
                      value={localContent.hero?.desc || ''}
                      onChange={(e) => updateHeroField('desc', e.target.value)}
                      onBlur={handleFieldBlur}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Button 1 Text</label>
                      <input
                        type="text"
                        className="admin-form-control"
                        value={localContent.hero?.btn1Text || ''}
                        onChange={(e) => updateHeroField('btn1Text', e.target.value)}
                        onBlur={handleFieldBlur}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Button 1 Link / Anchor</label>
                      <input
                        type="text"
                        className="admin-form-control"
                        value={localContent.hero?.btn1Link || ''}
                        onChange={(e) => updateHeroField('btn1Link', e.target.value)}
                        onBlur={handleFieldBlur}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Button 2 Text</label>
                      <input
                        type="text"
                        className="admin-form-control"
                        value={localContent.hero?.btn2Text || ''}
                        onChange={(e) => updateHeroField('btn2Text', e.target.value)}
                        onBlur={handleFieldBlur}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Button 2 Link / Anchor</label>
                      <input
                        type="text"
                        className="admin-form-control"
                        value={localContent.hero?.btn2Link || ''}
                        onChange={(e) => updateHeroField('btn2Link', e.target.value)}
                        onBlur={handleFieldBlur}
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-card-box" style={{ background: '#1E293B', padding: '30px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '20px', color: '#FFF' }}>Hero Media Management</h3>
                  
                  <div className="admin-form-group">
                    <label className="admin-form-label">Media Presentation Type</label>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '8px', marginBottom: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="heroMediaType"
                          value="video"
                          checked={localContent.hero?.mediaType === 'video'}
                          onChange={() => updateHeroField('mediaType', 'video')}
                        />
                        Video
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="heroMediaType"
                          value="image"
                          checked={localContent.hero?.mediaType === 'image'}
                          onChange={() => updateHeroField('mediaType', 'image')}
                        />
                        Single Image
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFF', fontSize: '13px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="heroMediaType"
                          value="slideshow"
                          checked={localContent.hero?.mediaType === 'slideshow'}
                          onChange={() => updateHeroField('mediaType', 'slideshow')}
                        />
                        Slideshow
                      </label>
                    </div>
                  </div>

                  {localContent.hero?.mediaType !== 'slideshow' ? (
                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        {localContent.hero?.mediaType === 'video' ? 'Hero Video Source (YouTube embed or direct video file)' : 'Hero Image Source'}
                      </label>
                      <IntelligentMediaInput
                        value={localContent.hero?.mediaUrl || ''}
                        onChange={(url) => updateHeroField('mediaUrl', url)}
                        placeholder={localContent.hero?.mediaType === 'video' ? 'YouTube link or direct MP4 URL...' : 'Direct image link or upload...'}
                        onBrowseLibrary={() => openMediaPicker('hero', 'hero', 'mediaUrl')}
                      />
                    </div>
                  ) : (
                    <div className="admin-form-group">
                      <label className="admin-form-label">Slideshow Images (max 5)</label>
                      {(localContent.hero?.slideshowImages || []).map((slideUrl, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>#{sIdx + 1}</span>
                          <div style={{ flexGrow: 1 }}>
                            <input
                              type="text"
                              className="admin-form-control"
                              value={slideUrl}
                              onChange={(e) => {
                                const list = [...localContent.hero.slideshowImages];
                                list[sIdx] = e.target.value;
                                updateHeroField('slideshowImages', list);
                              }}
                              onBlur={handleFieldBlur}
                              placeholder="Image URL..."
                            />
                          </div>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: '8px 12px' }}
                            onClick={() => openMediaPicker('slideshow', 'hero', 'slideshowImages', sIdx)}
                          >
                            📁
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '8px 12px' }}
                            onClick={() => {
                              const list = [...localContent.hero.slideshowImages];
                              list.splice(sIdx, 1);
                              updateHeroField('slideshowImages', list);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ width: '100%', marginTop: '10px', padding: '8px', fontSize: '12px' }}
                        onClick={() => {
                          const list = [...(localContent.hero?.slideshowImages || [])];
                          if (list.length >= 5) {
                            triggerNotification('Maximum of 5 slideshow images supported.', 'warning');
                            return;
                          }
                          list.push('');
                          updateHeroField('slideshowImages', list);
                        }}
                      >
                        ➕ Add Slideshow Image
                      </button>
                    </div>
                  )}

                  <div className="admin-form-group" style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                    <label className="admin-form-label">Hero Background Image</label>
                    <IntelligentMediaInput
                      value={localContent.hero?.bgUrl || ''}
                      onChange={(url) => updateHeroField('bgUrl', url)}
                      placeholder="Paste background URL or upload..."
                      onBrowseLibrary={() => openMediaPicker('hero-bg', 'hero', 'bgUrl')}
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                    <label className="admin-form-label">Complete Product Catalog PDF</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="admin-form-control"
                        value={localContent.hero?.catalogPdf || ''}
                        onChange={(e) => updateHeroField('catalogPdf', e.target.value)}
                        onBlur={handleFieldBlur}
                        placeholder="/sky solutions final catalogue.pdf..."
                      />
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        style={{ whiteSpace: 'nowrap' }}
                        onClick={() => openMediaPicker('hero', 'hero', 'catalogPdf')}
                      >
                        📁 Select PDF
                      </button>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <label className="admin-btn admin-btn-secondary" style={{ fontSize: '11px', padding: '6px 12px' }}>
                        📤 Direct Upload PDF
                        <input
                          type="file"
                          accept=".pdf"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, (url) => updateHeroField('catalogPdf', url))}
                        />
                      </label>
                      {localContent.hero?.catalogPdf && (
                        <span style={{ fontSize: '12px', color: '#34D399', marginLeft: '12px' }}>📕 catalog attached</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'homepage' && homepageSubTab === 'cta' && (
            <div>
              {/* Homepage Sub-tab Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', flexWrap: 'wrap' }}>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('hero')}>✨ Hero Section</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('reordering')}>🔄 Layout Ordering</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('blocks')}>🧩 Content Blocks</button>
                <button className="admin-btn admin-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>📣 Bottom CTA</button>
              </div>

              <div className="admin-card-box" style={{ background: '#1E293B', padding: '30px', maxWidth: '650px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '20px', color: '#FFF' }}>Bottom Call to Action Banner</h3>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">CTA Banner Title (HTML Supported)</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    value={localContent.cta?.title || ''}
                    onChange={(e) => updateCTAField('title', e.target.value)}
                    onBlur={handleFieldBlur}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Button Label</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    value={localContent.cta?.buttonText || ''}
                    onChange={(e) => updateCTAField('buttonText', e.target.value)}
                    onBlur={handleFieldBlur}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOMEPAGE LAYOUT MANAGER */}
          {activeTab === 'homepage' && homepageSubTab === 'reordering' && (
            <div>
              {/* Homepage Sub-tab Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', flexWrap: 'wrap' }}>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('hero')}>✨ Hero Section</button>
                <button className="admin-btn admin-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>🔄 Layout Ordering</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('blocks')}>🧩 Content Blocks</button>
                <button className="admin-btn admin-btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setHomepageSubTab('cta')}>📣 Bottom CTA</button>
              </div>
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                  Manage the sequence and visibility of the sections on your live homepage. Drag items using the <strong>☰</strong> handle or use the buttons to reorder.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset the homepage layout order to the factory defaults?')) {
                      const updated = { ...localContent, homepageLayout: defaultLayout };
                      setLocalContent(updated);
                      triggerAutoSave(updated);
                      triggerNotification('Homepage sections reset to default', 'success');
                    }
                  }}
                >
                  🔄 Reset Layout to Default
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Order</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Move</th>
                    <th>Section Name</th>
                    <th>Technical Description</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(localContent.homepageLayout || defaultLayout).map((sec, index) => {
                    const sectionsList = localContent.homepageLayout || defaultLayout;
                    return (
                      <tr
                        key={sec.id || index}
                        draggable
                        onDragStart={(e) => handleLayoutDragStart(e, index)}
                        onDragOver={handleLayoutDragOver}
                        onDrop={(e) => handleLayoutDrop(e, index)}
                        style={{ opacity: draggedLayoutIndex === index ? 0.4 : 1 }}
                      >
                        <td style={{ cursor: 'grab', textAlign: 'center', color: '#64748B', fontWeight: 'bold', userSelect: 'none' }}>☰</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <button
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              disabled={index === 0}
                              onClick={() => {
                                const list = [...sectionsList];
                                const temp = list[index];
                                list[index] = list[index - 1];
                                list[index - 1] = temp;
                                const updated = { ...localContent, homepageLayout: list };
                                setLocalContent(updated);
                                triggerAutoSave(updated);
                              }}
                            >
                              ▲
                            </button>
                            <button
                              className="admin-btn admin-btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              disabled={index === sectionsList.length - 1}
                              onClick={() => {
                                const list = [...sectionsList];
                                const temp = list[index];
                                list[index] = list[index + 1];
                                list[index + 1] = temp;
                                const updated = { ...localContent, homepageLayout: list };
                                setLocalContent(updated);
                                triggerAutoSave(updated);
                              }}
                            >
                              ▼
                            </button>
                          </div>
                        </td>
                        <td style={{ fontWeight: '600', color: '#FFF' }}>{sec.name}</td>
                        <td style={{ fontSize: '13px', color: '#94A3B8' }}>
                          {sec.id === 'hero' && 'Introductory banner with dynamic logo details, slider points, and quick inquiry pathways.'}
                          {sec.id === 'who-we-are' && 'Company highlights slider, award carousel, and standard description paragraph.'}
                          {sec.id === 'products' && 'Interactive catalog overview grid showcasing dynamic category cards.'}
                          {sec.id === 'services' && 'Optimization and laboratory engineering capabilities (liquid-liquid extraction, partition chromatography, etc.).'}
                          {sec.id === 'dynamic-sections' && 'Flexible custom layout blocks (Text, Image+Text, Video, Stats, CTA) created by administrators.'}
                          {sec.id === 'statistics' && 'Achievement indicators showing metrics like Countries Served, Strategic Partners, and Products Delivered.'}
                          {sec.id === 'cta' && 'Direct contact / booking inquiry banner styled with custom gradient highlights.'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span 
                            className={`admin-badge`}
                            style={{ 
                              backgroundColor: sec.visible !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: sec.visible !== false ? '#10B981' : '#EF4444',
                              fontSize: '11px',
                              padding: '4px 8px',
                              fontWeight: '600'
                            }}
                          >
                            {sec.visible !== false ? '👁️ Visible' : '🚫 Hidden'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="admin-btn"
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '12px', 
                              backgroundColor: sec.visible !== false ? '#EF4444' : '#10B981', 
                              color: '#FFF',
                              fontWeight: '500',
                              borderRadius: '4px'
                            }}
                            onClick={() => {
                              const list = [...sectionsList];
                              list[index] = { ...list[index], visible: sec.visible === false };
                              const updated = { ...localContent, homepageLayout: list };
                              setLocalContent(updated);
                              triggerAutoSave(updated);
                              triggerNotification(
                                `Section "${sec.name}" is now ${sec.visible === false ? 'visible' : 'hidden'}.`, 
                                'success'
                              );
                            }}
                          >
                            {sec.visible !== false ? '🚫 Hide' : '👁️ Show'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: FOOTER */}
          {activeTab === 'footer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Row 1: Connect With Us + Contact Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Connect With Us */}
                <div className="admin-card-box" style={{ background: '#1E293B', padding: '28px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🔗 Connect With Us
                  </h3>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Email Address</label>
                    <input
                      type="email"
                      className="admin-form-control"
                      value={localContent.footer?.email || ''}
                      onChange={(e) => updateFooterField('email', e.target.value)}
                      onBlur={handleFieldBlur}
                      placeholder="shylender@skylifesciencessolutions.com"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={localContent.footer?.socials?.linkedin || ''}
                      onChange={(e) => updateFooterSocial('linkedin', e.target.value)}
                      onBlur={handleFieldBlur}
                      placeholder="https://www.linkedin.com/company/..."
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Instagram Profile URL</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={localContent.footer?.socials?.instagram || ''}
                      onChange={(e) => updateFooterSocial('instagram', e.target.value)}
                      onBlur={handleFieldBlur}
                      placeholder="https://www.instagram.com/..."
                    />
                    <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                      Instagram link only shows in footer if URL is set (not #)
                    </p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="admin-card-box" style={{ background: '#1E293B', padding: '28px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📞 Contact Details
                  </h3>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Direct Phone Number</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={localContent.footer?.phone || ''}
                      onChange={(e) => updateFooterField('phone', e.target.value)}
                      onBlur={handleFieldBlur}
                      placeholder="+91 9908140066"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Support Link</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={localContent.footer?.supportLink || ''}
                      onChange={(e) => updateFooterField('supportLink', e.target.value)}
                      onBlur={handleFieldBlur}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Terms & Conditions Link</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={localContent.footer?.termsLink || ''}
                      onChange={(e) => updateFooterField('termsLink', e.target.value)}
                      onBlur={handleFieldBlur}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Privacy Policy Link</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={localContent.footer?.privacyLink || ''}
                      onChange={(e) => updateFooterField('privacyLink', e.target.value)}
                      onBlur={handleFieldBlur}
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Accessibility Link</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={localContent.footer?.accessibilityLink || ''}
                      onChange={(e) => updateFooterField('accessibilityLink', e.target.value)}
                      onBlur={handleFieldBlur}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Map Settings */}
              <div className="admin-card-box" style={{ background: '#1E293B', padding: '28px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px', color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🗺️ Footer Google Map
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '20px' }}>
                  Embed a Google Map in the footer. Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe code.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Google Maps Embed URL</label>
                    <textarea
                      className="admin-form-control"
                      rows="3"
                      value={localContent.footer?.mapEmbedUrl || ''}
                      onChange={(e) => updateFooterField('mapEmbedUrl', e.target.value)}
                      onBlur={handleFieldBlur}
                      placeholder="https://www.google.com/maps/embed?pb=..."
                      style={{ fontSize: '12px', lineHeight: '1.4' }}
                    />
                    <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                      Leave blank to hide the map from the footer.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-form-label">Location Label (shown on map overlay)</label>
                      <input
                        type="text"
                        className="admin-form-control"
                        value={localContent.footer?.mapLocation || ''}
                        onChange={(e) => updateFooterField('mapLocation', e.target.value)}
                        onBlur={handleFieldBlur}
                        placeholder="Hyderabad, Telangana, India"
                      />
                    </div>
                    {localContent.footer?.mapEmbedUrl && (
                      <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: '#94A3B8' }}>
                        ✅ Map is set. It will appear as a strip above the footer copyright bar.
                      </div>
                    )}
                    {!localContent.footer?.mapEmbedUrl && (
                      <div style={{ background: 'rgba(100,116,139,0.06)', border: '1px solid rgba(100,116,139,0.12)', borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: '#64748B' }}>
                        ℹ️ No map set. Paste a Google Maps embed URL to show the map.
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}



          {/* TAB 5: MEDIA MANAGER */}
          {activeTab === 'settings' && (
            <div>
              {/* Media Library Uploader */}
              <div className="admin-card-box" style={{ background: '#1E293B', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px', color: '#FFF' }}>Upload New File to Library</h3>

                {uploadError && (
                  <div className="admin-alert admin-alert-danger" style={{ padding: '10px 14px', marginBottom: '16px' }}>
                    {uploadError}
                  </div>
                )}

                <label className="admin-upload-dropzone">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <div>
                    <span style={{ color: '#38BDF8', fontWeight: '500' }}>Click to upload file</span> or drag & drop here
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Supports PNG, JPG, JPEG, SVG, WebP, and PDF specs</span>

                  {isUploading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                      <div className="admin-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div>
                      <span style={{ fontSize: '12px' }}>Uploading to workspace...</span>
                    </div>
                  )}

                  <input
                    type="file"
                    className="admin-upload-input"
                    onChange={(e) => handleFileUpload(e)}
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Media Search Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ position: 'relative', maxWidth: '420px' }}>
                  <input
                    type="text"
                    className="admin-form-control"
                    style={{ paddingLeft: '36px', fontSize: '13px' }}
                    placeholder="Search media files by filename..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                  />
                  <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  {mediaSearch && <button style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px', lineHeight: 1 }} onClick={() => setMediaSearch('')}>✕</button>}
                </div>
                {mediaSearch && <p style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>{mediaList.filter(f => f.name.toLowerCase().includes(mediaSearch.toLowerCase())).length} result(s) for "{mediaSearch}"</p>}
              </div>

              {/* Media File Grid */}
              <div className="admin-media-grid">
                {mediaList
                  .filter(file => !mediaSearch || file.name.toLowerCase().includes(mediaSearch.toLowerCase()))
                  .map((file, idx) => {
                    const isPdf = file.name.endsWith('.pdf');
                    return (
                      <div key={idx} className="admin-media-card">
                        {isPdf ? (
                          <div className="admin-media-pdf-placeholder">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <span style={{ fontSize: '11px', fontWeight: '500' }}>PDF Spec Sheet</span>
                          </div>
                        ) : (
                          <img src={file.url} alt={file.name} />
                        )}

                        <div className="admin-media-actions-overlay">
                          <span className="admin-media-name">{file.name}</span>
                          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {mediaPickerTarget ? (
                              <button
                                className="admin-btn admin-btn-primary"
                                style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: '#34D399', color: '#0F172A' }}
                                onClick={() => handleSelectMediaItem(file.url)}
                              >
                                ✓ Choose
                              </button>
                            ) : (
                              <button
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => {
                                  navigator.clipboard.writeText(window.location.origin + file.url);
                                  triggerNotification('File URL copied to clipboard!', 'success');
                                }}
                              >
                                📋 URL
                              </button>
                            )}
                            <button
                              className="admin-btn admin-btn-danger"
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              onClick={() => handleDeleteMedia(file.name)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL EDIT DRAWER: HIGHLIGHT CARD */}
      {editingHighlight && (
        <div className="admin-editor-overlay" onClick={() => setEditingHighlight(null)}>
          <div className="admin-editor-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-panel-title" style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              {editingHighlight.id === 'new' ? 'Add Highlight Card' : 'Edit Highlight Card'}
            </h3>

            <div className="admin-form-group">
              <label className="admin-form-label">Highlight Title</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingHighlight.title}
                onChange={(e) => setEditingHighlight(prev => ({ ...prev, title: e.target.value }))}
                placeholder="India Pharma Leaders Award..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Date Label (Optional)</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingHighlight.date || ''}
                onChange={(e) => setEditingHighlight(prev => ({ ...prev, date: e.target.value }))}
                placeholder="March 2026..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Description Text</label>
              <textarea
                className="admin-form-control"
                rows="4"
                value={editingHighlight.desc}
                onChange={(e) => setEditingHighlight(prev => ({ ...prev, desc: e.target.value }))}
                onPaste={(e) => handlePasteTextarea(e, (val) => setEditingHighlight(prev => ({ ...prev, desc: val })))}
                onBlur={handleFieldBlur}
                placeholder="Short recap description..."
              ></textarea>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Card Image Path (Cover / Legacy)</label>
              <IntelligentMediaInput
                value={editingHighlight.img || ''}
                onChange={(url) => setEditingHighlight(prev => ({ ...prev, img: url }))}
                placeholder="/uploads/award.png..."
                onBrowseLibrary={() => openMediaPicker('highlight', editingHighlight.id, 'img')}
                onUploadComplete={fetchMedia}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Card Gradient Background</label>
              <select
                className="admin-form-control"
                value={editingHighlight.gradientType || 'preset-1'}
                onChange={(e) => setEditingHighlight(prev => ({ ...prev, gradientType: e.target.value }))}
              >
                <option value="preset-1">Gradient Preset 1 (Dark Green/Blue Navy)</option>
                <option value="preset-2">Gradient Preset 2 (Deep Violet Purple)</option>
                <option value="preset-3">Gradient Preset 3 (Slate Metallic Blue)</option>
                <option value="custom">Custom CSS linear-gradient</option>
              </select>
            </div>

            {(editingHighlight.gradientType === 'custom') && (
              <div className="admin-form-group">
                <label className="admin-form-label">Custom Gradient String</label>
                <input
                  type="text"
                  className="admin-form-control"
                  value={editingHighlight.customGradient || ''}
                  onChange={(e) => setEditingHighlight(prev => ({ ...prev, customGradient: e.target.value }))}
                  placeholder="linear-gradient(135deg, #136B36 0%, #2347A8 100%)"
                />
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Must be a valid CSS linear-gradient declaration.</span>
              </div>
            )}

            <div className="admin-form-group" style={{ marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label className="admin-form-label" style={{ margin: 0 }}>Slideshow Media Gallery (Up to 10 items)</label>
                {(!editingHighlight.media || editingHighlight.media.length < 10) && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => {
                      const newMedia = [...(editingHighlight.media || [])];
                      newMedia.push({ type: 'image', url: '' });
                      setEditingHighlight(prev => ({ ...prev, media: newMedia }));
                    }}
                  >
                    ➕ Add Media Item
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {editingHighlight.media && editingHighlight.media.map((med, idx) => (
                  <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'bold' }}>#{idx + 1}</span>
                      <select
                        className="admin-form-control"
                        style={{ width: '100px', padding: '4px', fontSize: '12px' }}
                        value={med.type || 'image'}
                        onChange={(e) => {
                          const newMedia = [...editingHighlight.media];
                          newMedia[idx] = { ...newMedia[idx], type: e.target.value };
                          setEditingHighlight(prev => ({ ...prev, media: newMedia }));
                        }}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 8px', fontSize: '11px', marginLeft: 'auto' }}
                        onClick={() => {
                          const newMedia = editingHighlight.media.filter((_, mIdx) => mIdx !== idx);
                          setEditingHighlight(prev => ({ ...prev, media: newMedia }));
                        }}
                      >
                        🗑&nbsp;Remove
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {med.type === 'video' ? (
                        <input
                          type="text"
                          className="admin-form-control"
                          style={{ padding: '6px', fontSize: '12px' }}
                          value={med.url || ''}
                          onChange={(e) => {
                            const newMedia = [...editingHighlight.media];
                            newMedia[idx] = { ...newMedia[idx], url: e.target.value };
                            setEditingHighlight(prev => ({ ...prev, media: newMedia }));
                          }}
                          onBlur={handleFieldBlur}
                          placeholder="Paste direct video MP4 URL..."
                        />
                      ) : (
                        <IntelligentMediaInput
                          value={med.url || ''}
                          onChange={(url) => {
                            const newMedia = [...editingHighlight.media];
                            newMedia[idx] = { ...newMedia[idx], url };
                            setEditingHighlight(prev => ({ ...prev, media: newMedia }));
                          }}
                          placeholder="/uploads/image.png..."
                          onBrowseLibrary={() => openMediaPicker('highlight', editingHighlight.id, 'media', idx)}
                          onUploadComplete={fetchMedia}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-drawer-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditingHighlight(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  if (!editingHighlight.title.trim()) {
                    triggerNotification('Highlight title is required', 'danger');
                    return;
                  }

                  let finalHighlight = { ...editingHighlight };
                  if (finalHighlight.media && finalHighlight.media.length > 0) {
                    finalHighlight.img = finalHighlight.media[0].url;
                  }

                  let list = [...localContent.highlights];
                  if (finalHighlight.id === 'new') {
                    const newId = `hl-${Date.now()}`;
                    list.push({ ...finalHighlight, id: newId });
                  } else {
                    list = list.map(item => item.id === finalHighlight.id ? finalHighlight : item);
                  }

                  const updatedContent = { ...localContent, highlights: list };
                  setLocalContent(updatedContent);
                  triggerAutoSave(updatedContent);
                  setEditingHighlight(null);
                  triggerNotification('Highlight card saved successfully.', 'success');
                }}
              >
                Apply Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT DRAWER: PRODUCT */}
      {editingProduct && (
        <div className="admin-editor-overlay" onClick={() => setEditingProduct(null)}>
          <div className="admin-editor-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-panel-title" style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              {editingProduct.id === 'new' ? 'Add Catalog Product' : 'Edit Catalog Product'}
            </h3>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Name</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Corning Nebula Education Kits..."
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Category Assignment</label>
              <select
                className="admin-form-control"
                value={isCreatingNewCategoryInline ? '__new__' : (editingProduct.category || '')}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '__new__') {
                    setIsCreatingNewCategoryInline(true);
                    setEditingProduct(prev => ({ ...prev, category: '' }));
                  } else {
                    setIsCreatingNewCategoryInline(false);
                    setEditingProduct(prev => ({ ...prev, category: val }));
                  }
                }}
              >
                <option value="">-- Select Category --</option>
                {(localContent.categories || []).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
                <option value="__new__">+ Create New Category...</option>
              </select>
            </div>

            {isCreatingNewCategoryInline && (
              <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '4px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#38BDF8', marginBottom: '12px' }}>New Category Details</h4>
                <div className="admin-form-group">
                  <label className="admin-form-label">Category Title</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.target.value)}
                    placeholder="e.g. Analytical Instruments"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Category Description</label>
                  <textarea
                    className="admin-form-control"
                    rows="3"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    onPaste={(e) => handlePasteTextarea(e, (val) => setNewCategoryDesc(val))}
                    onBlur={handleFieldBlur}
                    placeholder="Brief description..."
                  ></textarea>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-form-label">Category Cover Image</label>
                  <IntelligentMediaInput
                    value={newCategoryImage}
                    onChange={(url) => setNewCategoryImage(url)}
                    placeholder="/uploads/my_category_cover.png..."
                    onBrowseLibrary={() => openMediaPicker('category-inline', 'new-inline', 'img')}
                    onUploadComplete={fetchMedia}
                  />
                </div>
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-form-label">Description Text</label>
              <textarea
                className="admin-form-control"
                rows="3"
                value={editingProduct.desc || ''}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, desc: e.target.value }))}
                onPaste={(e) => handlePasteTextarea(e, (val) => setEditingProduct(prev => ({ ...prev, desc: val })))}
                onBlur={handleFieldBlur}
                placeholder="Brief catalog summary..."
              ></textarea>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Cover Image Path (Legacy / Cover)</label>
              <IntelligentMediaInput
                value={editingProduct.img || ''}
                onChange={(url) => setEditingProduct(prev => ({ ...prev, img: url }))}
                placeholder="/uploads/my_product.png..."
                onBrowseLibrary={() => openMediaPicker('product', editingProduct.id, 'img')}
                onUploadComplete={fetchMedia}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Technical Overview</label>
              <textarea
                className="admin-form-control"
                rows="6"
                value={editingProduct.technicalOverview || ''}
                onChange={(e) => setEditingProduct(prev => ({ ...prev, technicalOverview: e.target.value }))}
                onPaste={(e) => handlePasteTextarea(e, (val) => setEditingProduct(prev => ({ ...prev, technicalOverview: val })))}
                onBlur={handleFieldBlur}
                placeholder="Deep dive explanation of the product's operation, physics, scaling metrics..."
              ></textarea>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Product Features</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                {(editingProduct.features || []).map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '13px', flexGrow: 1 }}>{feat}</span>
                    <button
                      type="button"
                      style={{ color: '#EF4444', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => {
                        setEditingProduct(prev => ({
                          ...prev,
                          features: prev.features.filter((_, idx) => idx !== fIdx)
                        }));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="admin-form-control"
                  style={{ padding: '6px' }}
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  placeholder="Add key feature..."
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => {
                    if (newFeatureText.trim()) {
                      setEditingProduct(prev => ({
                        ...prev,
                        features: [...(prev.features || []), newFeatureText.trim()]
                      }));
                      setNewFeatureText('');
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Typical Applications</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                {(editingProduct.applications || []).map((app, aIdx) => (
                  <div key={aIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '13px', flexGrow: 1 }}>{app}</span>
                    <button
                      type="button"
                      style={{ color: '#EF4444', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => {
                        setEditingProduct(prev => ({
                          ...prev,
                          applications: prev.applications.filter((_, idx) => idx !== aIdx)
                        }));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="admin-form-control"
                  style={{ padding: '6px' }}
                  value={newAppText}
                  onChange={(e) => setNewAppText(e.target.value)}
                  placeholder="Add application..."
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => {
                    if (newAppText.trim()) {
                      setEditingProduct(prev => ({
                        ...prev,
                        applications: [...(prev.applications || []), newAppText.trim()]
                      }));
                      setNewAppText('');
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Technical Specifications</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                {Object.entries(editingProduct.specifications || {}).map(([key, val], sIdx) => (
                  <div key={sIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{key}:</span>
                    <span style={{ fontSize: '13px', flexGrow: 1 }}>{val}</span>
                    <button
                      type="button"
                      style={{ color: '#EF4444', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => {
                        setEditingProduct(prev => {
                          const specs = { ...prev.specifications };
                          delete specs[key];
                          return { ...prev, specifications: specs };
                        });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="admin-form-control"
                  style={{ padding: '6px', flex: 1 }}
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Spec Key (e.g. Max Temp)"
                />
                <input
                  type="text"
                  className="admin-form-control"
                  style={{ padding: '6px', flex: 1 }}
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value (e.g. 200 °C)"
                />
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px', width: '100%' }}
                onClick={() => {
                  if (newSpecKey.trim() && newSpecValue.trim()) {
                    setEditingProduct(prev => ({
                      ...prev,
                      specifications: {
                        ...(prev.specifications || {}),
                        [newSpecKey.trim()]: newSpecValue.trim()
                      }
                    }));
                    setNewSpecKey('');
                    setNewSpecValue('');
                  }
                }}
              >
                Add Spec Key-Value
              </button>
            </div>

            <div className="admin-form-group" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label className="admin-form-label" style={{ margin: 0 }}>Product Images Gallery (Up to 5)</label>
                {(!editingProduct.images || editingProduct.images.length < 5) && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => {
                      const imgs = [...(editingProduct.images || [])];
                      imgs.push('');
                      setEditingProduct(prev => ({ ...prev, images: imgs }));
                    }}
                  >
                    ➕ Add Image Slot
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(editingProduct.images || []).map((imgUrl, imgIdx) => (
                  <div key={imgIdx} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'bold' }}>Slot #{imgIdx + 1}</span>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '4px 8px', fontSize: '11px', marginLeft: 'auto' }}
                        onClick={() => {
                          const imgs = editingProduct.images.filter((_, idx) => idx !== imgIdx);
                          setEditingProduct(prev => ({ ...prev, images: imgs }));
                        }}
                      >
                        🗑 Remove
                      </button>
                    </div>
                    <IntelligentMediaInput
                      value={imgUrl || ''}
                      onChange={(url) => {
                        const imgs = [...editingProduct.images];
                        imgs[imgIdx] = url;
                        setEditingProduct(prev => ({ ...prev, images: imgs }));
                      }}
                      placeholder="/uploads/product_img.png..."
                      onBrowseLibrary={() => openMediaPicker('product', editingProduct.id, 'images', imgIdx)}
                      onUploadComplete={fetchMedia}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label className="admin-form-label" style={{ margin: 0 }}>Product Demonstration Videos (Up to 5)</label>
                {(!editingProduct.videos || editingProduct.videos.length < 5) && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                    onClick={() => {
                      const vids = [...(editingProduct.videos || [])];
                      vids.push('');
                      setEditingProduct(prev => ({ ...prev, videos: vids }));
                    }}
                  >
                    ➕ Add Video Slot
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(editingProduct.videos || []).map((vidUrl, vidIdx) => (
                  <div key={vidIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', width: '50px' }}>Slot #{vidIdx + 1}</span>
                    <input
                      type="text"
                      className="admin-form-control"
                      style={{ padding: '6px', fontSize: '12px' }}
                      value={vidUrl || ''}
                      onChange={(e) => {
                        const vids = [...editingProduct.videos];
                        vids[vidIdx] = e.target.value;
                        setEditingProduct(prev => ({ ...prev, videos: vids }));
                      }}
                      placeholder="YouTube watch link or direct MP4 URL..."
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      onClick={() => {
                        const vids = editingProduct.videos.filter((_, idx) => idx !== vidIdx);
                        setEditingProduct(prev => ({ ...prev, videos: vids }));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-form-group" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <label className="admin-form-label">Specification Brochure PDF</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="admin-form-control"
                  value={editingProduct.pdf || ''}
                  onChange={(e) => setEditingProduct(prev => ({ ...prev, pdf: e.target.value }))}
                  placeholder="/uploads/specification_sheet.pdf..."
                />
                <button
                  className="admin-btn admin-btn-secondary"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => openMediaPicker('product', editingProduct.id, 'pdf')}
                >
                  📁 Select Brochure
                </button>
              </div>
              <div style={{ marginTop: '12px' }}>
                <label className="admin-btn admin-btn-secondary" style={{ fontSize: '11px', padding: '6px 12px' }}>
                  📤 Direct Upload PDF
                  <input
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, (url) => setEditingProduct(prev => ({ ...prev, pdf: url })))}
                  />
                </label>
                {editingProduct.pdf && (
                  <span style={{ fontSize: '12px', color: '#F87171', marginLeft: '12px' }}>📕 brochure attached</span>
                )}
              </div>
            </div>

            <div className="admin-drawer-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => { setEditingProduct(null); setIsCreatingNewCategoryInline(false); }}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  if (!editingProduct.name.trim()) {
                    triggerNotification('Product name is required', 'danger');
                    return;
                  }

                  let finalProd = { ...editingProduct };
                  let catList = [...(localContent.categories || [])];

                  if (isCreatingNewCategoryInline) {
                    if (!newCategoryTitle.trim()) {
                      triggerNotification('New Category Title is required', 'danger');
                      return;
                    }
                    const newCatId = newCategoryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const inlineCat = {
                      id: newCatId,
                      slug: newCatId,
                      title: newCategoryTitle,
                      desc: newCategoryDesc,
                      img: newCategoryImage
                    };
                    if (!catList.some(c => c.id === newCatId)) {
                      catList.push(inlineCat);
                    }
                    finalProd.category = newCatId;
                  }

                  if (finalProd.images && finalProd.images.length > 0) {
                    finalProd.img = finalProd.images[0];
                  }

                  // Compile slug from name if not present
                  if (!finalProd.slug) {
                    finalProd.slug = finalProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  }

                  let list = [...localContent.products];
                  if (finalProd.id === 'new') {
                    const newId = `p-${Date.now()}`;
                    list.push({ ...finalProd, id: newId });
                  } else {
                    list = list.map(p => p.id === finalProd.id ? finalProd : p);
                  }

                  const updatedContent = { ...localContent, categories: catList, products: list };
                  setLocalContent(updatedContent);
                  triggerAutoSave(updatedContent);

                  // Reset inline states
                  setNewCategoryTitle('');
                  setNewCategoryDesc('');
                  setNewCategoryImage('');
                  setIsCreatingNewCategoryInline(false);

                  setEditingProduct(null);
                  triggerNotification('Product saved successfully.', 'success');
                }}
              >
                Apply Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT DRAWER: SERVICE */}
      {editingService && (
        <div className="admin-editor-overlay" onClick={() => setEditingService(null)}>
          <div className="admin-editor-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-panel-title" style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              {editingService.id === 'new' ? 'Add New Service' : 'Edit Service'}
            </h3>

            <div className="admin-form-group">
              <label className="admin-form-label">Service Title *</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingService.title}
                onChange={(e) => setEditingService(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Optimization of Partition Chromatography..."
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Service Description</label>
              <textarea
                className="admin-form-control"
                rows="3"
                value={editingService.desc}
                onChange={(e) => setEditingService(prev => ({ ...prev, desc: e.target.value }))}
                placeholder="Description of capabilities..."
              ></textarea>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Icon Identifier</label>
              <select
                className="admin-form-control"
                value={editingService.iconKey}
                onChange={(e) => setEditingService(prev => ({ ...prev, iconKey: e.target.value }))}
              >
                <option value="separation">Separation (Search circle)</option>
                <option value="extraction">Extraction (People group)</option>
                <option value="chromatography">Chromatography (Document)</option>
                <option value="cpu">Digital / CPU</option>
                <option value="green">Green / Globe</option>
                <option value="engineering">Engineering (Wrench)</option>
                <option value="activity">Activity / Lab</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Service Image URL (optional)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="admin-form-control"
                  value={editingService.img || ''}
                  onChange={(e) => setEditingService(prev => ({ ...prev, img: e.target.value }))}
                  placeholder="https://... or /uploads/filename.jpg"
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ whiteSpace: 'nowrap', padding: '0 12px', fontSize: '12px' }}
                  onClick={() => {
                    setMediaPickerTarget({ type: 'service', id: editingService.id || 'new', field: 'img' });
                    setActiveTab('media');
                    setEditingService(null);
                  }}
                >
                  📷 Pick
                </button>
              </div>
              {editingService.img && (
                <div style={{ marginTop: '8px', padding: '8px', background: '#FFF', borderRadius: '4px', textAlign: 'center', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={editingService.img} alt="preview" style={{ maxWidth: '100%', maxHeight: '72px', objectFit: 'contain' }} />
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Learn More Link (optional)</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingService.learnMore || ''}
                onChange={(e) => setEditingService(prev => ({ ...prev, learnMore: e.target.value }))}
                placeholder="#contact, /services, or https://..."
              />
              <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                Leave blank to open Contact Us. Use <code>#contact</code>, a page path, or a full URL.
              </p>
            </div>

            <div className="admin-drawer-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditingService(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  if (!editingService.title.trim()) {
                    triggerNotification('Service title is required', 'danger');
                    return;
                  }

                  let list = [...(localContent.services || [])];
                  if (editingService.id === 'new') {
                    const newId = `svc-${Date.now()}`;
                    list.push({ ...editingService, id: newId });
                  } else {
                    list = list.map(s => s.id === editingService.id ? editingService : s);
                  }

                  const updatedContent = { ...localContent, services: list };
                  setLocalContent(updatedContent);
                  triggerAutoSave(updatedContent);
                  setEditingService(null);
                  triggerNotification('Service saved successfully.', 'success');
                }}
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT DRAWER: WHAT WE DO SECTION */}
      {editingWhatWeDoSection && (
        <div className="admin-editor-overlay" onClick={() => setEditingWhatWeDoSection(null)}>
          <div className="admin-editor-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-panel-title" style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              {editingWhatWeDoSection.id === 'new' ? 'Add Capability Section' : 'Edit Capability Section'}
            </h3>

            <div className="admin-form-group">
              <label className="admin-form-label">Section Title *</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingWhatWeDoSection.title || ''}
                onChange={(e) => setEditingWhatWeDoSection(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Continuous Manufacturing"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <textarea
                className="admin-form-control"
                rows="4"
                value={editingWhatWeDoSection.description || ''}
                onChange={(e) => setEditingWhatWeDoSection(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this capability area..."
              ></textarea>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Icon Key</label>
              <select
                className="admin-form-control"
                value={editingWhatWeDoSection.icon || 'activity'}
                onChange={(e) => setEditingWhatWeDoSection(prev => ({ ...prev, icon: e.target.value }))}
              >
                <option value="activity">Activity / Lab</option>
                <option value="cpu">Digital / AI</option>
                <option value="green">Green Chemistry / Globe</option>
                <option value="engineering">Engineering / Wrench</option>
                <option value="separation">Separation</option>
                <option value="extraction">Extraction</option>
                <option value="chromatography">Chromatography</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Section Image URL (optional)</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingWhatWeDoSection.image || ''}
                onChange={(e) => setEditingWhatWeDoSection(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://... or /uploads/filename.jpg"
              />
              {editingWhatWeDoSection.image && (
                <div style={{ marginTop: '8px', padding: '8px', background: '#FFF', borderRadius: '4px', textAlign: 'center', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={editingWhatWeDoSection.image} alt="preview" style={{ maxWidth: '100%', maxHeight: '72px', objectFit: 'contain' }} />
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Background Image URL (optional)</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingWhatWeDoSection.backgroundImage || ''}
                onChange={(e) => setEditingWhatWeDoSection(prev => ({ ...prev, backgroundImage: e.target.value }))}
                placeholder="/uploads/bg-pattern.jpg"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">CTA Button Text</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingWhatWeDoSection.ctaButtonText || 'Learn More'}
                onChange={(e) => setEditingWhatWeDoSection(prev => ({ ...prev, ctaButtonText: e.target.value }))}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">CTA Button Link</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingWhatWeDoSection.ctaButtonLink || '#contact'}
                onChange={(e) => setEditingWhatWeDoSection(prev => ({ ...prev, ctaButtonLink: e.target.value }))}
                placeholder="#contact"
              />
            </div>

            <div className="admin-drawer-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditingWhatWeDoSection(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  if (!editingWhatWeDoSection.title?.trim()) {
                    triggerNotification('Section title is required', 'danger');
                    return;
                  }
                  saveWhatWeDoSection(editingWhatWeDoSection);
                  setEditingWhatWeDoSection(null);
                  triggerNotification('Section saved successfully.', 'success');
                }}
              >
                Save Section
              </button>
            </div>
          </div>
        </div>
      )}



      {/* MODAL EDIT DRAWER: CATEGORY */}
      {editingCategory && (
        <div className="admin-editor-overlay" onClick={() => setEditingCategory(null)}>
          <div className="admin-editor-drawer" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-panel-title" style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              {editingCategory.id === 'new' ? 'Add New Category' : 'Edit Category Details'}
            </h3>

            <div className="admin-form-group">
              <label className="admin-form-label">Category Title</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingCategory.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setEditingCategory(prev => {
                    const slug = prev.id === 'new' ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug;
                    return { ...prev, title, slug };
                  });
                }}
                placeholder="Flow Chemistry..."
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Category Slug (URL Identifier)</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingCategory.slug || ''}
                onChange={(e) => setEditingCategory(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                placeholder="flow-chemistry"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Category Description</label>
              <textarea
                className="admin-form-control"
                rows="4"
                value={editingCategory.desc || ''}
                onChange={(e) => setEditingCategory(prev => ({ ...prev, desc: e.target.value }))}
                onPaste={(e) => handlePasteTextarea(e, (val) => setEditingCategory(prev => ({ ...prev, desc: val })))}
                onBlur={handleFieldBlur}
                placeholder="Brief summary description of the category's application areas..."
              ></textarea>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Category Cover Image</label>
              <IntelligentMediaInput
                value={editingCategory.img || ''}
                onChange={(url) => setEditingCategory(prev => ({ ...prev, img: url }))}
                placeholder="/uploads/category_cover.png..."
                onBrowseLibrary={() => openMediaPicker('category', editingCategory.id, 'img')}
                onUploadComplete={fetchMedia}
              />
            </div>

            <div className="admin-drawer-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditingCategory(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  if (!editingCategory.title.trim()) {
                    triggerNotification('Category title is required', 'danger');
                    return;
                  }

                  let list = [...(localContent.categories || [])];
                  let finalCat = { ...editingCategory };
                  if (!finalCat.slug) {
                    finalCat.slug = finalCat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  }

                  if (finalCat.id === 'new') {
                    finalCat.id = finalCat.slug;
                    if (list.some(c => c.id === finalCat.id)) {
                      triggerNotification('Category with this title/slug already exists', 'danger');
                      return;
                    }
                    list.push(finalCat);
                  } else {
                    list = list.map(c => c.id === finalCat.id ? finalCat : c);
                  }

                  const updatedContent = { ...localContent, categories: list };
                  setLocalContent(updatedContent);
                  triggerAutoSave(updatedContent);
                  setEditingCategory(null);
                  triggerNotification('Category saved successfully.', 'success');
                }}
              >
                Apply Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SAFE DELETE: CATEGORY WARNING */}
      {deletingCategoryTarget && (
        <div className="admin-editor-overlay" onClick={() => { setDeletingCategoryTarget(null); setTargetCategoryForMove(''); }}>
          <div className="admin-editor-drawer" style={{ maxWidth: '500px', height: 'auto', maxHeight: '95vh', padding: '30px', margin: 'auto', top: '50%', transform: 'translateY(-50%)', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-panel-title" style={{ color: '#FFF', marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>Safe Category Deletion</h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
              The category <strong>{deletingCategoryTarget.title}</strong> contains{' '}
              <strong>{(localContent.products || []).filter(p => p.category === deletingCategoryTarget.id).length}</strong> product(s).
              Please choose how you want to handle these products before deleting this category:
            </p>

            <div className="admin-form-group" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <label className="admin-form-label" style={{ fontWeight: '600', color: '#38BDF8' }}>Option A: Move products to another category</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <select
                  className="admin-form-control"
                  style={{ flexGrow: 1 }}
                  value={targetCategoryForMove}
                  onChange={(e) => setTargetCategoryForMove(e.target.value)}
                >
                  <option value="">-- Choose Target Category --</option>
                  {(localContent.categories || [])
                    .filter(c => c.id !== deletingCategoryTarget.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))
                  }
                </select>
                <button
                  className="admin-btn admin-btn-primary"
                  style={{ backgroundColor: '#2563EB', color: '#FFF', whiteSpace: 'nowrap' }}
                  disabled={!targetCategoryForMove}
                  onClick={() => {
                    const updatedProducts = (localContent.products || []).map(p => {
                      if (p.category === deletingCategoryTarget.id) {
                        return { ...p, category: targetCategoryForMove };
                      }
                      return p;
                    });
                    const updatedContent = {
                      ...localContent,
                      categories: localContent.categories.filter(c => c.id !== deletingCategoryTarget.id),
                      products: updatedProducts
                    };
                    setLocalContent(updatedContent);
                    triggerAutoSave(updatedContent);
                    setDeletingCategoryTarget(null);
                    setTargetCategoryForMove('');
                    triggerNotification(`Category deleted. Products moved successfully.`, 'success');
                  }}
                >
                  Move & Delete
                </button>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <label className="admin-form-label" style={{ fontWeight: '600', color: '#F87171' }}>Option B: Delete category and all its products</label>
              <button
                className="admin-btn admin-btn-danger"
                style={{ width: '100%', marginTop: '10px', backgroundColor: '#DC2626', color: '#FFF' }}
                onClick={() => {
                  if (window.confirm(`Are you absolutely sure you want to delete this category AND all its associated products? This action is permanent.`)) {
                    const updatedContent = {
                      ...localContent,
                      categories: localContent.categories.filter(c => c.id !== deletingCategoryTarget.id),
                      products: (localContent.products || []).filter(p => p.category !== deletingCategoryTarget.id)
                    };
                    setLocalContent(updatedContent);
                    triggerAutoSave(updatedContent);
                    setDeletingCategoryTarget(null);
                    triggerNotification(`Category and associated products deleted successfully.`, 'success');
                  }
                }}
              >
                💥 Delete Category & Products
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="admin-btn admin-btn-secondary" style={{ width: '100%' }} onClick={() => { setDeletingCategoryTarget(null); setTargetCategoryForMove(''); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT DRAWER: DYNAMIC SECTION */}
      {editingSection && (
        <div className="admin-editor-overlay" onClick={() => setEditingSection(null)}>
          <div className="admin-editor-drawer" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-panel-title" style={{ marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              {editingSection.id === 'new' ? 'Add Custom Block' : 'Edit Content Block'}
            </h3>

            <div className="admin-form-group">
              <label className="admin-form-label">Block Type *</label>
              <select
                className="admin-form-control"
                value={editingSection.type || 'text'}
                onChange={(e) => setEditingSection(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="text">Text Block</option>
                <option value="image-text">Image + Text Block</option>
                <option value="video">Video Block</option>
                <option value="statistics">Statistics Block</option>
                <option value="cta">Call to Action Block</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Section Title</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingSection.title || ''}
                onChange={(e) => setEditingSection(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Pioneering Continuous Manufacturing..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Subtitle / Metadata Label</label>
              <input
                type="text"
                className="admin-form-control"
                value={editingSection.subtitle || ''}
                onChange={(e) => setEditingSection(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="ADVANCING PHARMACEUTICAL DEVELOPMENT..."
              />
            </div>

            {/* TEXT & IMAGE-TEXT & CTA Description/Text content */}
            {(editingSection.type === 'text' || editingSection.type === 'image-text' || editingSection.type === 'cta') && (
              <div className="admin-form-group">
                <label className="admin-form-label">Block Text Content</label>
                <textarea
                  className="admin-form-control"
                  rows="6"
                  value={editingSection.text || ''}
                  onChange={(e) => setEditingSection(prev => ({ ...prev, text: e.target.value }))}
                  onPaste={(e) => handlePasteTextarea(e, (val) => setEditingSection(prev => ({ ...prev, text: val })))}
                  placeholder="Enter block text content..."
                ></textarea>
              </div>
            )}

            {/* IMAGE-TEXT Specific */}
            {editingSection.type === 'image-text' && (
              <>
                <div className="admin-form-group">
                  <label className="admin-form-label">Image Alignment</label>
                  <select
                    className="admin-form-control"
                    value={editingSection.align || 'right'}
                    onChange={(e) => setEditingSection(prev => ({ ...prev, align: e.target.value }))}
                  >
                    <option value="right">Image on Right</option>
                    <option value="left">Image on Left</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Block Cover Image</label>
                  <IntelligentMediaInput
                    value={editingSection.img || ''}
                    onChange={(url) => setEditingSection(prev => ({ ...prev, img: url }))}
                    placeholder="/uploads/block_image.png..."
                    onBrowseLibrary={() => openMediaPicker('section', editingSection.id, 'img')}
                    onUploadComplete={fetchMedia}
                  />
                </div>
              </>
            )}

            {/* VIDEO Specific */}
            {editingSection.type === 'video' && (
              <div className="admin-form-group">
                <label className="admin-form-label">Video Stream URL</label>
                <input
                  type="text"
                  className="admin-form-control"
                  value={editingSection.videoUrl || ''}
                  onChange={(e) => setEditingSection(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="YouTube watch link or direct MP4 URL..."
                />
              </div>
            )}

            {/* STATISTICS Specific */}
            {editingSection.type === 'statistics' && (
              <div className="admin-form-group">
                <label className="admin-form-label">Statistics Counters (Up to 4)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {(editingSection.stats || []).map((stat, sIdx) => (
                    <div key={sIdx} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'bold' }}>Counter #{sIdx + 1}</span>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '11px', marginLeft: 'auto' }}
                          onClick={() => {
                            const newStats = editingSection.stats.filter((_, idx) => idx !== sIdx);
                            setEditingSection(prev => ({ ...prev, stats: newStats }));
                          }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px', marginBottom: '8px' }}>
                        <div>
                          <label className="admin-form-label" style={{ fontSize: '11px' }}>Number</label>
                          <input
                            type="text"
                            className="admin-form-control"
                            style={{ padding: '6px' }}
                            value={stat.target || ''}
                            onChange={(e) => {
                              const newStats = [...editingSection.stats];
                              newStats[sIdx] = { ...newStats[sIdx], target: e.target.value };
                              setEditingSection(prev => ({ ...prev, stats: newStats }));
                            }}
                          />
                        </div>
                        <div>
                          <label className="admin-form-label" style={{ fontSize: '11px' }}>Suffix</label>
                          <input
                            type="text"
                            className="admin-form-control"
                            style={{ padding: '6px' }}
                            value={stat.suffix || ''}
                            onChange={(e) => {
                              const newStats = [...editingSection.stats];
                              newStats[sIdx] = { ...newStats[sIdx], suffix: e.target.value };
                              setEditingSection(prev => ({ ...prev, stats: newStats }));
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="admin-form-label" style={{ fontSize: '11px' }}>Label Text</label>
                        <input
                          type="text"
                          className="admin-form-control"
                          style={{ padding: '6px' }}
                          value={stat.label || ''}
                          onChange={(e) => {
                            const newStats = [...editingSection.stats];
                            newStats[sIdx] = { ...newStats[sIdx], label: e.target.value };
                            setEditingSection(prev => ({ ...prev, stats: newStats }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {(!editingSection.stats || editingSection.stats.length < 4) && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    style={{ fontSize: '12px', width: '100%', padding: '8px' }}
                    onClick={() => {
                      const newStats = [...(editingSection.stats || [])];
                      newStats.push({ target: '0', suffix: '+', label: 'Counter Label' });
                      setEditingSection(prev => ({ ...prev, stats: newStats }));
                    }}
                  >
                    ➕ Add Counter Item
                  </button>
                )}
              </div>
            )}

            {/* CTA Specific */}
            {editingSection.type === 'cta' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Button Label Text</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={editingSection.buttonText || 'Learn More'}
                      onChange={(e) => setEditingSection(prev => ({ ...prev, buttonText: e.target.value }))}
                      placeholder="Learn More..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Button Target Action</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={editingSection.buttonLink || 'contact'}
                      onChange={(e) => setEditingSection(prev => ({ ...prev, buttonLink: e.target.value }))}
                      placeholder="'contact' or URL link..."
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">CTA Background Styling</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    value={editingSection.background || 'linear-gradient(135deg, #0f172a 0%, #136B36 100%)'}
                    onChange={(e) => setEditingSection(prev => ({ ...prev, background: e.target.value }))}
                    placeholder="CSS background..."
                  />
                </div>
              </>
            )}

            <div className="admin-drawer-footer">
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditingSection(null)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => {
                  let list = [...(localContent.dynamicSections || [])];
                  let finalSec = { ...editingSection };

                  if (finalSec.id === 'new') {
                    finalSec.id = `ds-${Date.now()}`;
                    list.push(finalSec);
                  } else {
                    list = list.map(item => item.id === finalSec.id ? finalSec : item);
                  }

                  const updated = { ...localContent, dynamicSections: list };
                  setLocalContent(updated);
                  triggerAutoSave(updated);
                  setEditingSection(null);
                  triggerNotification('Content block saved successfully.', 'success');
                }}
              >
                Apply Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
