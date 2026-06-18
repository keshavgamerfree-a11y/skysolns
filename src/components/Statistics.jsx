import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function Counter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(target);
      if (start === end) return;

      const totalMiliseconds = duration;
      // Calculate elapsed using performance timestamp
      
      const startTime = performance.now();
      
      const updateCount = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / totalMiliseconds, 1);
        
        // Ease out quadratic
        const easeProgress = progress * (2 - progress);
        const currentCount = Math.floor(easeProgress * end);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, target, duration]);

  // Format count with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return <span ref={ref}>{formatNumber(count)}</span>;
}

export default function Statistics({ stats: propStats }) {
  const defaultStats = [
    {
      target: "250000",
      suffix: "+",
      label: "Products Delivered"
    },
    {
      target: "50000",
      suffix: "+",
      label: "Customers Supported"
    },
    {
      target: "40",
      suffix: "+",
      label: "Countries Served"
    },
    {
      target: "100",
      suffix: "+",
      label: "Strategic Partners"
    }
  ];

  const stats = propStats || defaultStats;

  return (
    <section className="section" id="statistics" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="stats-row">
          {stats.map((stat, idx) => (
            <motion.div 
              className="stat-item" 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <span className="stat-num">
                <Counter target={stat.target} />
                {stat.suffix}
              </span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
