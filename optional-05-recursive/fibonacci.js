function fibonacci(n) {
  if (n === 0) {
    return [0];
  }
  if (n === 1) {
    return [0, 1];
  }
  const result = fibonacci(n - 1);
  const nextValue = result[result.length - 1] + result[result.length - 2];
  return [...result, nextValue];
}

// Jangan hapus kode di bawah ini!
export default fibonacci;
