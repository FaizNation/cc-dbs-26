const express = require('express');
const booksRouter = require('./routes/books');

const app = express();
const PORT = 9000;

app.use(express.json());
app.use('/books', booksRouter);

app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});
