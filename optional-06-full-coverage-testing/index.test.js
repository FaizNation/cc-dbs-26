import { test } from 'node:test';
import assert from 'node:assert';
import sum from './index.js';

test('sum function testing', (t) => {
  t.test('should add two positive numbers correctly', () => {
    assert.strictEqual(sum(5, 5), 10);
  });

  t.test('should return 0 if first argument is not a number', () => {
    assert.strictEqual(sum('5', 5), 0);
  });

  t.test('should return 0 if second argument is not a number', () => {
    assert.strictEqual(sum(5, '5'), 0);
  });

  t.test('should return 0 if both arguments are not numbers', () => {
    assert.strictEqual(sum('5', '5'), 0);
  });

  t.test('should return 0 if first argument is negative', () => {
    assert.strictEqual(sum(-5, 5), 0);
  });

  t.test('should return 0 if second argument is negative', () => {
    assert.strictEqual(sum(5, -5), 0);
  });

  t.test('should return 0 if both arguments are negative', () => {
    assert.strictEqual(sum(-5, -5), 0);
  });

  t.test('should return 0 if arguments are missing', () => {
    assert.strictEqual(sum(), 0);
  });

  t.test('should handle zero correctly', () => {
    assert.strictEqual(sum(0, 5), 5);
    assert.strictEqual(sum(5, 0), 5);
    assert.strictEqual(sum(0, 0), 0);
  });
});
