const express = require('express');
const dotenv = require('dotenv');
const ClientError = require('./src/utils/ClientError');

dotenv.config();

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

app.use(express.json());

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
  if (error instanceof ClientError) {
    return res.status(error.statusCode).json({
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
