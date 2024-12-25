import React from "react";

const ProductsGrid = ({ products }) => {
  return (
    <div className="products-grid container py-4">
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={product.id}>
            <div className="product-card">
              <img
                src={product.img}
                alt={product.title}
                className="product-image"
              />
              <div className="product-details">
                <h6 className="product-title">{product.title}</h6>
                <p className="product-price">${product.price}</p>
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;
