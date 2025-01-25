import {API_BASE_URL} from '../../../utils/config';

const CategoryCard = ({ type, category }) => {
  const model = category.subcategories ? 'categories' : 'subcategories'; 
  const params = category.subcategories ? category.name.toLowerCase() : category._id; 
  const image = category.images && category.images[0];

  return (
    <div className="category-card position-relative overflow-hidden">
      <div className="image-container">
        <img src={`${API_BASE_URL}${image}`} alt={category.name} className="img-fluid" />
      </div>
      <div className="category-info position-absolute top-0 start-0 text-end p-4">
        <h2 className="text-dark fw-bold mb-0 fs-2">{category.name}</h2>
      </div>
      <div className="shop-now-container position-absolute bottom-0 start-0 p-3">
        <a href={`/shop/${model}/${params}`} className="btn btn-sm btn-dark shop-now d-none rounded-0">
          SHOP NOW
        </a>
      </div>
    </div>
  );
};

export default CategoryCard;
