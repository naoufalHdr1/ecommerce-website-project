import ItemList from './productSection';
import { StateProvider } from './stateContext';

const ProductOverview = () => {
  return (
    <StateProvider>
      <ItemList type="products"/>
      <hr/>
      <ItemList type="subcategories"/>
      <hr/>
      <ItemList type="categories"/>
    </StateProvider>
  );
};

export default ProductOverview;
