const CategoryCard = ({ title, season, image }) => {
  return (
    <div className="category-card position-relative overflow-hidden">
      <div className="image-container">
        <img src={image} alt={title} className="img-fluid" />
      </div>
      <div className="category-info position-absolute top-0 start-0 text-end p-4">
        <h2 className="text-dark fw-bold mb-0 fs-2">{title}</h2>
        <p className="text-muted mb-0 fs-6">{season}</p>
      </div>
      <div className="shop-now-container position-absolute bottom-0 start-0 p-3">
        <a href={`/shop/subcategories/${title.toLowerCase()}`} className="btn btn-sm btn-dark shop-now d-none rounded-0">
          SHOP NOW
        </a>
      </div>
    </div>
  );
};

export default CategoryCard;
