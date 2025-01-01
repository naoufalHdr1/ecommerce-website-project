// utils/routeFactory.js
import express from 'express';
import { verifyToken, checkAdmin } from '../middleware/auth.js';
import { create, getAll, getById, getByQuery, updateById, deleteById, deleteBySub, updateListFieldById, updateProductById, deleteProductById } from '../controllers/commonController.js';


export const generateRoute = (model, subModel = null) => {
  const router = express.Router();

  // Public
  router.get('/', getAll(model));
  router.get('/findBy', getByQuery(model));
  router.get('/:id', getById(model));
  // Admin Only
  router.post('/', verifyToken, checkAdmin, create(model));
  router.put('/:id', verifyToken, checkAdmin, updateById(model));
  router.put('/:id/add-item', verifyToken, checkAdmin, updateListFieldById(model));
  router.put('/:id/add', verifyToken, checkAdmin, updateProductById(model));
  router.delete('/delete', verifyToken, checkAdmin, deleteProductById(model));
  if (subModel) {
    router.delete('/:id', verifyToken, checkAdmin, deleteBySub(model, subModel));
  } else {
    router.delete('/:id', verifyToken, checkAdmin, deleteById(model));
  }

  return router;
};
