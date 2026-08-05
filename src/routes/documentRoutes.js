const express = require('express');
const multer = require('multer');
const path = require('path');
const DocumentService = require('../services/DocumentService');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const documentService = new DocumentService();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/', async (req, res, next) => {
  try {
    const documents = await documentService.getDocuments();
    res.json({
      status: 'success',
      data: {
        documents,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const document = await documentService.getDocumentById(req.params.id);
    res.json({
      status: 'success',
      data: {
        ...document,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, upload.single('document'), async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    if (!req.file) {
      throw new Error('Document field is required');
    }
    const { path: filePath, originalname } = req.file;
    const documentId = await documentService.addDocument(userId, filePath, originalname);

    res.status(201).json({
      status: 'success',
      data: {
        id: documentId,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await documentService.deleteDocument(req.params.id);
    res.json({
      status: 'success',
      message: 'Dokumen berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
