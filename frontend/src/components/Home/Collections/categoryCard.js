import {API_BASE_URL} from '../../../utils/config';

const CategoryCard = ({ type, categories, categoryName }) => {
  return (
    <div className="categories-section container py-5">
      {/* Category Cards */}
      <div className="row g-4">
        {categories.map((category) => (
          <div className="col-md-4" key={category._id}>
            <div className="category-card position-relative overflow-hidden">
              <div className="image-container">
                <img src={`${API_BASE_URL}${category.images && category.images[0]}`} alt={category.name} className="img-fluid" />
              </div>
              <div className="category-info position-absolute top-0 start-0 text-end p-4">
                <h2 className="text-dark fw-bold mb-0 fs-2">{category.name}</h2>
              </div>
              <div className="shop-now-container position-absolute bottom-0 start-0 p-3">
                <a href={type === 'cat' ? `categories/${category.name}` : `${categoryName}/${category.name}/${category._id}`} className="btn btn-sm btn-dark shop-now d-none rounded-0">
                  SHOP NOW
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
