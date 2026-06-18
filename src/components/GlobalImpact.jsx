import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalImpact() {
  const [activeHub, setActiveHub] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const hubs = [
    {
      id: "boston",
      city: "Boston, USA",
      type: "collab",
      role: "Life Sciences R&D & Preclinical Development Center",
      cx: "260",
      cy: "140",
      details: "Supporting Northeast biotechnology clusters with advanced formulation assays and custom synthesis systems."
    },
    {
      id: "london",
      city: "London, UK",
      type: "collab",
      role: "European Regulatory Affairs & Technical Support",
      cx: "480",
      cy: "110",
      details: "Providing compliance validation audits (EMA, ISO) and distribution of scientific consumables."
    },
    {
      id: "frankfurt",
      city: "Frankfurt, Germany",
      type: "distrib",
      role: "Global Logistics & Calibration Hub",
      cx: "515",
      cy: "125",
      details: "State-of-the-art warehousing facility coordinating rapid instrumentation dispatch across EMEA."
    },
    {
      id: "mumbai",
      city: "Mumbai, India",
      type: "collab",
      role: "Analytical Testing & Calibration Labs",
      cx: "700",
      cy: "210",
      details: "Fortune 500 equivalent quality control testing center providing HPLC, spectroscopy, and validation services."
    },
    {
      id: "singapore",
      city: "Singapore",
      type: "distrib",
      role: "Asia-Pacific Regional Headquarters & Logistics Hub",
      cx: "780",
      cy: "250",
      details: "Coordinating clinical research support and biotechnology equipment integrations across APAC markets."
    }
  ];

  const handleMouseMove = (e, hub) => {
    const rect = e.currentTarget.parentNode.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // adjust tooltip positions slightly
    setTooltipPos({ x: x + 15, y: y - 10 });
    setActiveHub(hub);
  };

  return (
    <section className="section alt-bg" id="global-impact">
      <div className="container">
        <div className="map-section-container">
          
          <motion.div 
            className="map-info"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-meta">Global Footprint</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Connecting Science, Globally</h2>
            <p className="who-lead" style={{ fontSize: '18px' }}>
              Our analytical solutions and distribution networks serve life sciences organizations in 40+ countries.
            </p>
            <p className="who-desc" style={{ marginBottom: '30px' }}>
              Skylife Sciences Solutions maintains strategically situated technical centers, calibration laboratories, and logistics networks to ensure seamless compound tracking, rapid instrument validation, and uninterrupted delivery of scientific consumables.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--accent-purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }}>
                  ✓
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>R&D Collaboration Centers</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Close integration with regional bioscience clusters to enable drug and vaccine development workflows.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--accent-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }}>
                  ✓
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>Logistics & Calibration Hubs</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Preventive instrumentation calibration, rapid dispatch, and local stocking for minimized downtime.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="map-viz"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Tooltip Overlay */}
            <AnimatePresence>
              {activeHub && (
                <motion.div 
                  className="map-tooltip"
                  style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <strong style={{ display: 'block', fontSize: '13px', color: '#FFF', marginBottom: '2px' }}>{activeHub.city}</strong>
                  <span style={{ display: 'block', fontSize: '11px', color: activeHub.type === 'collab' ? '#D6C7FF' : '#BCE3FF', fontWeight: '600', marginBottom: '6px' }}>{activeHub.role}</span>
                  <p style={{ fontSize: '11px', color: '#CCC', lineHeight: '1.4' }}>{activeHub.details}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stylized Minimal Vector Map */}
            <svg 
              className="map-svg" 
              viewBox="0 0 1000 450" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simplified dotted background representing world continents */}
              {/* North America */}
              <rect x="80" y="80" width="320" height="180" rx="4" fill="none" />
              <path d="M120 100h120v40H120zm20 40h160v40H140zm40 40h140v40H180zm40 40h60v20H220z" fill="#EAEAEA" opacity="0.6"/>
              
              {/* South America */}
              <path d="M260 220h80v40H260zm20 40h60v40H280zm20 40h40v40H300zm10 40h20v40h-20z" fill="#EAEAEA" opacity="0.6"/>

              {/* Europe & Africa */}
              <path d="M460 90h120v40H460zm20 40h80v40H480zm-20 40h60v40H460zm10 40h40v60h-40zm10 60h40v40h-40zm10 40h20v30h-20z" fill="#EAEAEA" opacity="0.6"/>

              {/* Asia & Australia */}
              <path d="M620 90h220v40H620zm20 40h240v40H640zm-20 40h220v40H600zm40 40h140v40H640zm40 40h80v40H680zm120 40h60v40H800zm20 40h40v20H820z" fill="#EAEAEA" opacity="0.6"/>

              {/* Connecting flight lines (elegant curved arcs) */}
              <path d="M 260 140 Q 370 70 480 110" stroke="#DFE3FF" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M 480 110 Q 497 117 515 125" stroke="#DFE3FF" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M 515 125 Q 607 167 700 210" stroke="#DFE3FF" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M 700 210 Q 740 230 780 250" stroke="#DFE3FF" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M 260 140 Q 520 230 780 250" stroke="#E2DBF7" strokeWidth="1" strokeDasharray="4 4" />

              {/* Hub Nodes */}
              {hubs.map((hub) => (
                <g 
                  key={hub.id} 
                  className="map-node"
                  onMouseEnter={(e) => handleMouseMove(e, hub)}
                  onMouseMove={(e) => handleMouseMove(e, hub)}
                  onMouseLeave={() => setActiveHub(null)}
                >
                  {/* Pulsing ring */}
                  <circle 
                    cx={hub.cx} 
                    cy={hub.cy} 
                    r="12" 
                    fill={hub.type === "collab" ? "rgba(90, 45, 191, 0.2)" : "rgba(35, 71, 168, 0.2)"} 
                    className="map-node-pulse"
                  />
                  {/* Solid dot */}
                  <circle 
                    cx={hub.cx} 
                    cy={hub.cy} 
                    r="5" 
                    fill={hub.type === "collab" ? "var(--accent-purple)" : "var(--accent-blue)"} 
                    stroke="#FFFFFF" 
                    strokeWidth="1.5"
                  />
                </g>
              ))}
            </svg>

            {/* Map Legend */}
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-dot collab"></span>
                <span>R&D / Testing Centers</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot distrib"></span>
                <span>Logistics & Services Hubs</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
