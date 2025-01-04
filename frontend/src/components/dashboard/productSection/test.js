import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

const useDataManagement = ({ fetchEndpoints, transformData }) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          fetchEndpoints.map((endpoint) => api.get(endpoint))
        );
        const [categoriesRes, subcategoriesRes, dataRes] = responses;

        setCategories(categoriesRes?.data || []);
        setSubcategories(subcategoriesRes?.data || []);
        setData(transformData(dataRes?.data || [], categoriesRes?.data, subcategoriesRes?.data));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [fetchEndpoints, transformData]);

  return { data, categories, subcategories, setData };
};

export default useDataManagement;
