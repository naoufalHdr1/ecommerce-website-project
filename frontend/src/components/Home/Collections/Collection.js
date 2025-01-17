import CategoryCard from "./categoryCard.js";
import {API_BASE_URL} from '../../../utils/config';

const CategoriesSection = ({ categories }) => {
  return (
    <div className="categories-section container py-5">
      {/* Category Cards */}
      <div className="row g-4">
        {categories.map((category) => (
          <div className="col-md-4" key={category._id}>
            <CategoryCard
              title={category.name}
              season={category.season}
              image={category.images && `${API_BASE_URL}${category.images[0]}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;

