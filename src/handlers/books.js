const { nanoid } = require('nanoid');
const books = require('../books');

const addBook = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
};

const getAllBooks = (req, res) => {
  const { name, reading, finished } = req.query;

  let filteredBooks = books;

  if (name !== undefined) {
    const lowerName = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(lowerName));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
  }

  const result = filteredBooks.map(({ id, name: bookName, publisher }) => ({
    id,
    name: bookName,
    publisher,
  }));

  return res.status(200).json({
    status: 'success',
    data: {
      books: result,
    },
  });
};

const getBookById = (req, res) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
};

const updateBookById = (req, res) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

const deleteBookById = (req, res) => {
  const { bookId } = req.params;
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(bookIndex, 1);

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
