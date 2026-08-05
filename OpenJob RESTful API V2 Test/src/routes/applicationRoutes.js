const express = require('express');
const ApplicationService = require('../services/ApplicationService');
const ApplicationsValidator = require('../validator/Applications');
const authMiddleware = require('../middlewares/authMiddleware');
const CacheService = require('../cache/CacheService');
const ProducerService = require('../services/rabbitmq/ProducerService');

const router = express.Router();
const applicationService = new ApplicationService();
const cacheService = new CacheService();

router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    ApplicationsValidator.validateApplicationPayload(req.body);
    const application = await applicationService.addApplication(req.body);

    await cacheService.delete(`applications:user:${req.body.user_id}`);
    await cacheService.delete(`applications:job:${req.body.job_id}`);

    await ProducerService.sendMessage('application:create', JSON.stringify({ application_id: application.id }));

    res.status(201).json({
      status: 'success',
      data: {
        ...application,
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
    const cacheKey = `applications:${req.params.id}`;
    try {
      const cachedData = await cacheService.get(cacheKey);
      return res.set('X-Data-Source', 'cache').json({
        status: 'success',
        data: JSON.parse(cachedData),
      });
    } catch (error) {
      const application = await applicationService.getApplicationById(req.params.id);
      await cacheService.set(cacheKey, JSON.stringify(application));
      res.set('X-Data-Source', 'database').json({
        status: 'success',
        data: {
          ...application,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId', async (req, res, next) => {
  try {
    const cacheKey = `applications:user:${req.params.userId}`;
    try {
      const cachedData = await cacheService.get(cacheKey);
      return res.set('X-Data-Source', 'cache').json({
        status: 'success',
        data: {
          applications: JSON.parse(cachedData),
        },
      });
    } catch (error) {
      const applications = await applicationService.getApplicationsByUser(req.params.userId);
      await cacheService.set(cacheKey, JSON.stringify(applications));
      res.set('X-Data-Source', 'database').json({
        status: 'success',
        data: {
          applications,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/job/:jobId', async (req, res, next) => {
  try {
    const cacheKey = `applications:job:${req.params.jobId}`;
    try {
      const cachedData = await cacheService.get(cacheKey);
      return res.set('X-Data-Source', 'cache').json({
        status: 'success',
        data: {
          applications: JSON.parse(cachedData),
        },
      });
    } catch (error) {
      const applications = await applicationService.getApplicationsByJob(req.params.jobId);
      await cacheService.set(cacheKey, JSON.stringify(applications));
      res.set('X-Data-Source', 'database').json({
        status: 'success',
        data: {
          applications,
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    ApplicationsValidator.validateUpdateStatusPayload(req.body);
    const appData = await applicationService.getApplicationById(req.params.id);
    await applicationService.updateApplicationStatus(req.params.id, req.body.status);
    
    await cacheService.delete(`applications:${req.params.id}`);
    await cacheService.delete(`applications:user:${appData.user_id}`);
    await cacheService.delete(`applications:job:${appData.job_id}`);

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
    const appData = await applicationService.getApplicationById(req.params.id);
    await applicationService.deleteApplication(req.params.id);
    
    await cacheService.delete(`applications:${req.params.id}`);
    await cacheService.delete(`applications:user:${appData.user_id}`);
    await cacheService.delete(`applications:job:${appData.job_id}`);

    res.json({
      status: 'success',
      message: 'Lamaran berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
