import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    x_name: '',
    x_email: '',
    x_org: '',
    x_ind: '',
    x_msg: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.x_name.trim()) newErrors.x_name = 'Name is required';
    if (!formData.x_email.trim()) {
      newErrors.x_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.x_email)) {
      newErrors.x_email = 'Invalid email address';
    }
    if (!formData.x_org.trim()) newErrors.x_org = 'Organization is required';
    if (!formData.x_ind) newErrors.x_ind = 'Please select your industry';
    if (!formData.x_msg.trim()) newErrors.x_msg = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Mock submit
      setIsSubmitted(true);
      setTimeout(() => {
        // Clear form after success
        setFormData({
          x_name: '',
          x_email: '',
          x_org: '',
          x_ind: '',
          x_msg: ''
        });
      }, 500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {!isSubmitted ? (
              <>
                <h3 className="modal-title">Connect with <strong>Skylife Solutions</strong></h3>
                <p className="modal-subtitle">Write to us regarding your Requirements </p>

                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="x_name"
                      value={formData.x_name}
                      onChange={handleChange}
                      className="form-control"
                      autoComplete="off"
                    />
                    {errors.x_name && <span className="form-error">{errors.x_name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Email</label>
                    <input
                      type="email"
                      name="x_email"
                      value={formData.x_email}
                      onChange={handleChange}
                      className="form-control"
                      autoComplete="off"
                    />
                    {errors.x_email && <span className="form-error">{errors.x_email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Organization</label>
                    <input
                      type="text"
                      name="x_org"
                      value={formData.x_org}
                      onChange={handleChange}
                      className="form-control"
                      autoComplete="off"
                    />
                    {errors.x_org && <span className="form-error">{errors.x_org}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Industry Segment</label>
                    <select
                      name="x_ind"
                      value={formData.x_ind}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">Select Industry...</option>
                      <option value="Pharmaceuticals">Pharmaceuticals</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Research Laboratories">Research Laboratories</option>
                      <option value="Vaccine Manufacturers">Vaccine Manufacturers</option>
                      <option value="Healthcare Innovators">Healthcare Innovators</option>
                      <option value="Academic Research">Academic Research Institutions</option>
                      <option value="Manufacturing">Industrial Manufacturing</option>
                      <option value="Other">Other Life Sciences</option>
                    </select>
                    {errors.x_ind && <span className="form-error">{errors.x_ind}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Inquiry Details</label>
                    <textarea
                      name="x_msg"
                      value={formData.x_msg}
                      onChange={handleChange}
                      rows="4"
                      className="form-control"
                      autoComplete="off"
                    ></textarea>
                    {errors.x_msg && <span className="form-error">{errors.x_msg}</span>}
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Submit Inquiry
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                className="form-success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="form-success-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="modal-title" style={{ marginBottom: '10px' }}>Inquiry Submitted</h3>
                <p className="modal-subtitle" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  Thank you for contacting Skylife Sciences Solutions. A technical representative will review your request and contact you shortly.
                </p>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '30px' }}
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                >
                  Close Window
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
