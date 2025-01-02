import fs from 'fs';
import path from 'path';
import { __dirname } from '../server.js';

/**
 * Deletes files from the file system.
 * @param {string[]} files - Array of file paths to delete.
 */
export const deleteFiles = (files) => {
  files.forEach((file) => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  });
};


export const checkDocumentExists = async (model, id, fieldName) => {
  const document = await model.findById(id);
  if (!document) throw new Error(`Invalid ${fieldName}`);
  return document;
};
