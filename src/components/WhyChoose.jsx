import { motion } from 'framer-motion';

export default function WhyChoose() {
  const points = [
    {
      num: "01",
      title: "Scientific Excellence",
      desc: "Our scientific advisors and technical support personnel hold advanced degrees and decades of combined pharmaceutical laboratory and R&D engineering expertise."
    },
    {
      num: "02",
      title: "Global Standards",
      desc: "All products, installations, and validation audits comply with strict standards set by international regulatory bodies including FDA, EMA, ISO, and USP."
    },
    {
      num: "03",
      title: "Innovation Leadership",
      desc: "We continuously scan emerging fields in bioscience, chromatography, and automated synthesis to bring next-generation equipment and workflows to our clients."
    },
    {
      num: "04",
      title: "Uncompromising Quality",
      desc: "From analytical consumables to complex bioreactors, our quality assurance systems verify performance specifications and stability metrics before deployment."
    },
    {
      num: "05",
      title: "Global Supply & Services",
      desc: "With distribution points in key continents and a robust logistics network, we ensure reliable delivery timelines and fast localized technical support."
    },
    {
      num: "06",
      title: "Customer Commitment",
      desc: "We build long-term relationships, offering bespoke equipment integration, preventive calibration programs, and 24/7 technical query management."
    }
  ];

  return (
    <section className="section" id="why-choose">
      <div className="container">
        <div className="section-header-centered">
          <span className="section-meta">Corporate Integrity</span>
          <h2 className="section-title">Why Skylife Sciences</h2>
          <p className="section-subtitle">
            Pioneering precision in laboratory solutions through scientific integrity, regulatory compliance, and a global collaboration model.
          </p>
        </div>

        <div className="why-grid" style={{ gridTemplateRows: 'auto auto' }}>
          {points.map((pt, idx) => (
            <motion.div 
              className="why-item" 
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <span className="why-num">{pt.num}</span>
              <h3 className="why-title">{pt.title}</h3>
              <p className="why-desc">{pt.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
