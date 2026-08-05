import { test } from 'node:test';
import assert from 'node:assert';
import { sum } from './index.js';

test('Should add two numbers correctly', () => {
  const operandA = 1;
  const operandB = 2;

  const actualValue = sum(operandA, operandB);
  const expectedValue = 3;

  assert.strictEqual(actualValue, expectedValue);
});
