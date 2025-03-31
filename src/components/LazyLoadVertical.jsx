// src/components/LazyLoadVertical.jsx
import React, { useState, useEffect, useRef } from 'react';

const LazyLoadVertical = ({ children, height = '300px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '200px 0px', // Load when 200px away vertically
        threshold: 0.01
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {isVisible ? children : (
        <div className="section-skeleton" style={{ height }} />
      )}
    </div>
  );
};

export default LazyLoadVertical;