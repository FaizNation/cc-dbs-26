const express = require('express');
const dotenv = require('dotenv');
const ClientError = require('./src/utils/ClientError');

dotenv.config();

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const bookmarkRoutes = require('./src/routes/bookmarkRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const profileRoutes = require('./src/routes/profileRoutes');

app.use('/users', userRoutes);
app.use('/authentications', authRoutes);
app.use('/companies', companyRoutes);
app.use('/categories', categoryRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/documents', documentRoutes);
app.use('/profile', profileRoutes);

app.use((error, req, res, next) => {
  console.log('Error encountered:', error.name, error.message, error.statusCode, error.code);

  if (error.name === 'AuthenticationError' || error.statusCode === 401) {
    return res.status(401).json({
      status: 'failed',
      message: error.message,
    });
  }

  if (error.code === '23503') {
    return res.status(400).json({
      status: 'failed',
      message: 'Gagal memproses data. Referensi ID (User/Job/Company) tidak ditemukan di database.',
    });
  }

  if (error instanceof ClientError || error.statusCode || error.name === 'AuthenticationError' || error.name === 'InvariantError' || error.name === 'NotFoundError') {
    const statusCode = error.statusCode || (error.name === 'AuthenticationError' ? 401 : 400);
    return res.status(statusCode).json({
      status: 'failed',
      message: error.message,
    });
  }

  if (error.name === 'MulterError' && error.message === 'File too large') {
    return res.status(400).json({
      status: 'failed',
      message: 'Ukuran berkas terlalu besar (Maksimal 5MB)',
    });
  }

  if (error.message === 'File is required') {
    return res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }

  console.error(error);
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
