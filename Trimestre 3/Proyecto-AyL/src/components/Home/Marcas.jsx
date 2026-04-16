import { useState, useEffect, useRef } from "react";

const TOTAL_IMAGENES = 6;

const IMAGENES_CARRUSEL = Array.from({ length: TOTAL_IMAGENES }, (_, i) => ({
  id: i + 1,

  src: `/images/Marcas/marca-${i + 1}.png`,
  alt: `Marca A&L ${i + 1}`
}));

const Marcas = () => {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const autoScroll = () => {
      if (trackRef.current && !isDragging.current) {
        trackRef.current.scrollLeft += 0.8;
        if (trackRef.current.scrollLeft >= trackRef.current.scrollWidth / 2) {
          trackRef.current.scrollLeft = 0;
        }
      }
      requestAnimationFrame(autoScroll);
    };
    const anim = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(anim);
  }, []);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (

    <section className="py-5 bg-dark overflow-hidden">
      <div className="container mb-4 text-center">
        <h3 className="text-white fw-bold" style={{ letterSpacing: "2px" }}>NUESTRAS MARCAS</h3>
      </div>

      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => isDragging.current = false}
        onMouseLeave={() => isDragging.current = false}
        className="d-flex align-items-center"
        style={{
          cursor: "grab",
          userSelect: "none",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        {[...IMAGENES_CARRUSEL, ...IMAGENES_CARRUSEL].map((img, idx) => (
          <div key={idx} className="px-3" style={{ flex: "0 0 18%", minWidth: "220px" }}>
            <div
              className="rounded-4 shadow-lg border border-secondary bg-white"
              style={{
                height: "180px", 
                backgroundImage: `url(${img.src})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                padding: '15px', 
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Marcas;