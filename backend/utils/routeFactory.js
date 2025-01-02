// utils/routeFactory.js
import express from 'express';
import { verifyToken, checkAdmin } from '../middleware/auth.js';
import { getAll, getById, getByQuery, updateById, deleteById, deleteBySub, updateListFieldById, updateItemById, deleteProductById, createItem, deleteBulk } from '../controllers/commonController.js';


export const generateRoute = (childModel, parentModel) => {
  const router = express.Router();

  // Public
  router.get('/', getAll(childModel));
  router.get('/findBy', getByQuery(childModel));
  router.get('/:id', getById(childModel));
  // Admin Only
  router.post('/', verifyToken, checkAdmin, createItem(childModel, parentModel));
  // router.put('/:id', verifyToken, checkAdmin, updateById(childModel));
  // router.put('/:id/add-item', verifyToken, checkAdmin, updateListFieldById(childModel));
  router.put('/:id', verifyToken, checkAdmin, updateItemById(childModel, parentModel));
  router.delete('/delete', verifyToken, checkAdmin, deleteProductById(childModel));
  router.delete('/bulk-delete', verifyToken, checkAdmin, deleteBulk(childModel));
  if (parentModel) {
    router.delete('/:id', verifyToken, checkAdmin, deleteBySub(childModel, parentModel));
  } else {
    router.delete('/:id', verifyToken, checkAdmin, deleteById(childModel));
  }

  return router;
};
