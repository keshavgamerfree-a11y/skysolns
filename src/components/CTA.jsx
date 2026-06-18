import { motion } from 'framer-motion';

export default function CTA({ ctaContent, onOpenContact }) {
  const title = ctaContent?.title || "Let's <strong>Advance Scientific Innovation</strong> Together";
  const buttonText = ctaContent?.buttonText || "Contact Us";

  return (
    <section className="cta-banner">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 
            className="cta-title" 
            style={{ marginBottom: 'var(--whitespace-lg)' }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <button className="btn btn-primary" onClick={onOpenContact}>
            {buttonText}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
