export const checkDocumentExists = async (model, id, fieldName) => {
  const document = await model.findById(id);
  if (!document) throw new Error(`Invalid ${fieldName}`);
  return document;
};
