const Product = ({ product }) => {
  return (
    <div
      key={product.id}
      className="col-6 col-md-6 col-lg-3">
      <div className="product d-flex flex-column">
        <a href="#" className="img-prod position-relative">
          <img
            className="img-fluid w-100"
            src={product.image}
            alt={product.name}
          />
          <div className="overlay position-absolute w-100 h-100"></div>
        </a>
        <div className="text py-3 pb-4 px-3">
            <div className="cat text-muted fs-6">
              <span>{product.category}</span>
            </div>
            <div className="rating mb-2">
              <p className="text-right mb-0">
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`bi ${
                      index < product.rating ? "bi-star-fill" : "bi-star"} fs-6`}
                  ></i>
                ))}
              </p>
            </div>
          <h3 className="product-name fs-6 fw-normal">
            <a href="#">{product.name}</a>
          </h3>
          <div className="pricing">
            <p className="price fs-6 fw-bold">
              <span>{product.price}$</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
