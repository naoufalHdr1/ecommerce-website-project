import React from "react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: "bi-shield-check", // Bootstrap Icon
      title: "Quality Guarantee",
      description: "Our products are crafted with premium materials ensuring durability and superior quality.",
    },
    {
      icon: "bi-truck",
      title: "Fast & Free Shipping",
      description: "Enjoy free shipping on all orders and quick delivery to your doorstep.",
    },
    {
      icon: "bi-people",
      title: "Customer Satisfaction",
      description: "Your happiness is our priority. We provide 24/7 support for all your queries.",
    },
  ];

  return (
    <div className="benefits-section container py-5">
      {/* Benefits List */}
      <div className="row text-center g-4">
        {benefits.map((benefit, index) => (
          <div className="col-md-4" key={index}>
            <div className="benefit-card p-1 shadow-sm h-100">
              <div className="icon-container mb-3">
                <i className={`bi ${benefit.icon} benefit-icon fs-1 text-muted`}></i>
              </div>
              <h5 className="benefit-title">{benefit.title}</h5>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection;
