// Add a new item.
export const create = (model) => async (req, res) => {
  try {
    const data = await model.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a list of items (with pagination).
export const getAll = (model) => async (req, res) => {
  const { page = 0 } = req.query;
  const PAGE_SIZE = 20;
  
  try {
    const items = await model.aggregate([
      { $skip: parseInt(page, 10) * PAGE_SIZE },
      { $limit: PAGE_SIZE },
    ]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve details of a specific item by Id.
export const getById = (model) => async (req, res) => {
  const { id } = req.params;

  try {
    const data = await model.findById(id);
    if (!data) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an item by Id
export const updateById = (model) => async (req, res) => {
  const { id } = req.params;

  try {
    const updatedItem = await model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem)
      return res.status(404).json({ error: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an item.
export const deleteById = (model) => async (req, res) => {
  const { id } = req.params;

  try {
    const data = await model.findByIdAndDelete(id);
    if (!data) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an item with it's subData.
export const deleteBySub = (model, subModel) => async (req, res) => {
  const { id } = req.params;
  const { deleteSubData = false } = req.body

  try {
    const data = await model.findById(id);
    if (!data) return res.status(404).json({ error: 'Item not found' })

    if (deleteSubData) {
      const foreignKey = `${model.modelName.toLowerCase()}_id`;
      await subModel.deleteMany({ [foreignKey]: id });
    }

    await model.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
