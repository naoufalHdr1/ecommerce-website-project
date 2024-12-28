// controllers/BaseController.js

class BaseController {
  constructor(model) {
    this.model = model;
  }

  /*
   * GET /items
   * Retrieve a list of items (with pagination).
   */
  static async getAll(req, res) {
    const { page = 0 } = req.query;
    const PAGE_SIZE = 20;

    try {
      const items = await this.model.aggregate([
        { $skip: parseInt(page, 10) * PAGE_SIZE },
        { $limit: PAGE_SIZE },
      ]);
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /*
   * GET /items/:id
   * Retrieve details of a specific item.
   */
  static async getById(req, res) {
    const { id } = req.params;

    try {
      const item = await this.model.findById(id);
      if (!item) return res.status(404).json({ error: 'Item not found' });

      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /*
   * POST /items
   * Add a new item.
   */
  static async create(req, res) {
    try {
      const newItem = new this.model(req.body);
      await newItem.save();

      res.status(201).json(newItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /*
   * PUT /items/:id
   * Update an item.
   */
  static async update(req, res) {
    const { id } = req.params;

    try {
      const updatedItem = await this.model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedItem)
        return res.status(404).json({ error: 'Item not found' });

      res.json(updatedItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /*
   * DELETE /items/:id
   * Delete an item.
   */
  static async delete(req, res) {
    const { id } = req.params;

    try {
      const deletedItem = await this.model.findByIdAndDelete(id);
      if (!deletedItem)
        return res.status(404).json({ error: 'Item not found' });

      res.status(200).json({});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default BaseController;
