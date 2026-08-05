const express = require('express');
const multer = require('multer');
const path = require('path');
const DocumentService = require('../services/DocumentService');
const authMiddleware = require('../middlewares/authMiddleware');
const InvariantError = require('../utils/InvariantError');

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

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('File is required'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

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
    const absolutePath = path.resolve(document.path);
    res.download(absolutePath, document.original_name);
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
}, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    if (!req.file) {
      throw new InvariantError('File is required');
    }
    const { path: filePath, originalname, size } = req.file;
    const document = await documentService.addDocument(userId, filePath, originalname);

    res.status(201).json({
      status: 'success',
      data: {
        documentId: document.id,
        filename: path.basename(document.path),
        originalName: document.original_name,
        size: size,
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
