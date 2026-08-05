const express = require('express');
const CompanyService = require('../services/CompanyService');
const CompaniesValidator = require('../validator/Companies');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const companyService = new CompanyService();

router.get('/', async (req, res, next) => {
  try {
    const companies = await companyService.getCompanies();
    res.json({
      status: 'success',
      data: {
        companies,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    res.json({
      status: 'success',
      data: {
        ...company,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    CompaniesValidator.validateCompanyPayload(req.body);
    const companyId = await companyService.addCompany(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        id: companyId,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    CompaniesValidator.validateCompanyPayload(req.body);
    await companyService.editCompanyById(req.params.id, req.body);
    res.json({
      status: 'success',
      message: 'Perusahaan berhasil diperbarui',
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await companyService.deleteCompanyById(req.params.id);
    res.json({
      status: 'success',
      message: 'Perusahaan berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
