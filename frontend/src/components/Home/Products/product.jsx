import {API_BASE_URL} from '../../../utils/config';
import { useStateContext } from '../../../components/dashboard/productSection/stateContext';

const Product = ({ product }) => {
  const { state } = useStateContext();
  const subcategory = state.subcategories.filter((sub) => sub._id === product.subcategory_id)[0];

  return (
    <div
      key={product._id}
      className="col-6 col-md-6 col-lg-3">
      <div className="product d-flex flex-column">
        <a href={`/shop/product/${product._id}`} className="img-prod position-relative">
          <img
            className="img-fluid w-100"
            src={product.images && `${API_BASE_URL}${product.images[0]}`}
            alt={product.name}
          />
          <div className="overlay position-absolute w-100 h-100"></div>
        </a>
        <div className="text py-3 pb-4 px-3">
            <div className="cat text-muted fs-6">
              <span>{subcategory?.name.toUpperCase()}</span>
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
            <a href={`/product/${product._id}`}>{product.name}</a>
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
