import React, { useState, useEffect, useRef } from 'react';

const LazyLoadHorizontalItem = ({ children }) => {
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
        rootMargin: '200px',
        threshold: 0.1
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
    <div ref={ref} style={{ minWidth: '200px', flexShrink: 0 }}>
      {isVisible ? children : (
        <div className="product-card-skeleton">
          <div className="skeleton-image" />
          <div className="skeleton-text" />
          <div className="skeleton-text" />
        </div>
      )}
    </div>
  );
};

export default LazyLoadHorizontalItem;