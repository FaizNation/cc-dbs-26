const express = require('express');
const JobService = require('../services/JobService');
const JobsValidator = require('../validator/Jobs');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const jobService = new JobService();

const BookmarkService = require('../services/BookmarkService');
const bookmarkService = new BookmarkService();

router.post('/:jobId/bookmark', authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { jobId } = req.params;
    const bookmarkId = await bookmarkService.addBookmark(userId, jobId);
    res.status(201).json({
      status: 'success',
      data: {
        id: bookmarkId,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:jobId/bookmark/:id', authMiddleware, async (req, res, next) => {
  try {
    const bookmark = await bookmarkService.getBookmarkById(req.params.id);
    res.json({
      status: 'success',
      data: {
        ...bookmark,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:jobId/bookmark', authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { jobId } = req.params;
    await bookmarkService.deleteBookmark(userId, jobId);
    res.json({
      status: 'success',
      message: 'Bookmark berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { title, 'company-name': companyName } = req.query;
    const jobs = await jobService.getJobs({ title, companyName });
    res.json({
      status: 'success',
      data: {
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json({
      status: 'success',
      data: {
        ...job,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/company/:companyId', async (req, res, next) => {
  try {
    const jobs = await jobService.getJobsByCompany(req.params.companyId);
    res.json({
      status: 'success',
      data: {
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/category/:categoryId', async (req, res, next) => {
  try {
    const jobs = await jobService.getJobsByCategory(req.params.categoryId);
    res.json({
      status: 'success',
      data: {
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    JobsValidator.validateJobPayload(req.body);
    const jobId = await jobService.addJob(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        id: jobId,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    JobsValidator.validateJobPayload(req.body);
    await jobService.editJobById(req.params.id, req.body);
    res.json({
      status: 'success',
      message: 'Lowongan berhasil diperbarui',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await jobService.deleteJobById(req.params.id);
    res.json({
      status: 'success',
      message: 'Lowongan berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
