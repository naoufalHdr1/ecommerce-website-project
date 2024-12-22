import React from "react";

const BannerSection = ({ imageLink, position}) => {
  return (
    <div
      className={`banner-side position-relative border-start border-dark ${position === 'right' ? "w-50" : "w-50 order-2"}`}
      style={{ backgroundImage: `url('${imageLink}')`, backgroundSize: "cover", backgroundPosition: "top" }}
    >
      <div
        className="position-absolute text-dark fw-bold p-4"
        style={{ bottom: "20px", left: "20px", borderRadius: "10px" }}
      >
        <p style={{ fontSize: "35px", marginBottom: "5px" }}>
          Discover the latest trends in fashion, with fresh styles added every week.
        </p>
        <h6 style={{ fontWeight: "600" }}>Alan Faena</h6>
        <p className="text-muted">Founder, Chic Fashion</p>
      </div>

      <div className="arrow-navigation position-absolute d-flex gap-2">
        <button className="btn btn-light btn-sm text-dark arrow">❮</button>
        <button className="btn btn-light btn-sm text-dark arrow">❯</button>
      </div>
    </div>
  );
};

export default BannerSection;
