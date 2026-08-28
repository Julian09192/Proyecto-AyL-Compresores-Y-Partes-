import React from 'react';

function SkeletonLoader() {
  return (
    <div className="container py-5">
      <div className="placeholder-glow">
        <div className="placeholder col-12 bg-secondary opacity-25 mb-3" style={{ height: "40px", borderRadius: "8px" }}></div>
        <div className="row g-5">
          <div className="col-md-6">
            <div className="placeholder col-12 bg-secondary opacity-25" style={{ height: "350px", borderRadius: "16px" }}></div>
          </div>
          <div className="col-md-6">
            <div className="placeholder col-8 bg-secondary opacity-25 mb-4" style={{ height: "30px" }}></div>
            <div className="placeholder col-4 bg-secondary opacity-25 mb-3" style={{ height: "25px" }}></div>
            <div className="placeholder col-6 bg-secondary opacity-25 mb-5" style={{ height: "35px" }}></div>
            <div className="placeholder col-12 bg-secondary opacity-25" style={{ height: "100px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoader;