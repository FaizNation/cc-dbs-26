const express = require('express');
const ApplicationService = require('../services/ApplicationService');
const ApplicationsValidator = require('../validator/Applications');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const applicationService = new ApplicationService();

router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    ApplicationsValidator.validateApplicationPayload(req.body);
    const applicationId = await applicationService.addApplication(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        id: applicationId,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const applications = await applicationService.getApplications();
    res.json({
      status: 'success',
      data: {
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    res.json({
      status: 'success',
      data: {
        ...application,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsByUser(req.params.userId);
    res.json({
      status: 'success',
      data: {
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/job/:jobId', async (req, res, next) => {
  try {
    const applications = await applicationService.getApplicationsByJob(req.params.jobId);
    res.json({
      status: 'success',
      data: {
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    ApplicationsValidator.validateUpdateStatusPayload(req.body);
    await applicationService.updateApplicationStatus(req.params.id, req.body.status);
    res.json({
      status: 'success',
      message: 'Status lamaran berhasil diperbarui',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await applicationService.deleteApplication(req.params.id);
    res.json({
      status: 'success',
      message: 'Lamaran berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
