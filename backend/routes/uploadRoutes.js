import express from 'express';
import multer from 'multer';
import path from 'path';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload', upload.array('images'), (req, res) => {
  const uploadedFiles = req.files.map((file) => ({
    url: `/uploads/${file.filename}`,
    originalName: file.originalname,
  }));

  res.json({ images: uploadedFiles.map((file) => file.url) });
});

export default router;
