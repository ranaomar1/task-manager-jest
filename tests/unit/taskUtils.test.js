// ============================================================
// tests/unit/taskUtils.test.js
// Unit Testing - Tests for all utility functions
// ============================================================

const {
  validateTask,
  generateTaskId,
  formatTask,
  filterTasks,
  sortTasksByTitle,
  countByPriority,
  completionPercentage,
} = require('../../src/taskUtils');

// ─── validateTask ────────────────────────────────────────────
describe('validateTask()', () => {
  test('returns true for a valid task', () => {
    expect(validateTask({ title: 'Buy groceries' })).toBe(true);
  });

  test('returns false when title is missing', () => {
    expect(validateTask({ priority: 'high' })).toBe(false);
  });

  test('returns false when title is empty string', () => {
    expect(validateTask({ title: '' })).toBe(false);
  });

  test('returns false when title is only whitespace', () => {
    expect(validateTask({ title: '   ' })).toBe(false);
  });

  test('returns false for null input', () => {
    expect(validateTask(null)).toBe(false);
  });

  test('returns false for non-object input', () => {
    expect(validateTask('string')).toBe(false);
    expect(validateTask(42)).toBe(false);
    expect(validateTask(undefined)).toBe(false);
  });

  test('returns false when title is not a string', () => {
    expect(validateTask({ title: 123 })).toBe(false);
  });
});

// ─── generateTaskId ──────────────────────────────────────────
describe('generateTaskId()', () => {
  test('returns a string starting with "task_"', () => {
    const id = generateTaskId(0);
    expect(typeof id).toBe('string');
    expect(id.startsWith('task_')).toBe(true);
  });

  test('increments ID based on existingCount', () => {
    const id = generateTaskId(5);
    expect(id.startsWith('task_6_')).toBe(true);
  });

  test('works with default parameter (0)', () => {
    const id = generateTaskId();
    expect(id.startsWith('task_1_')).toBe(true);
  });

  test('throws error for negative count', () => {
    expect(() => generateTaskId(-1)).toThrow('existingCount must be a non-negative number');
  });

  test('throws error for non-number input', () => {
    expect(() => generateTaskId('abc')).toThrow();
  });
});

// ─── formatTask ──────────────────────────────────────────────
describe('formatTask()', () => {
  test('formats a pending task with TODO label', () => {
    const task = { title: 'Write tests', completed: false };
    expect(formatTask(task)).toBe('[TODO] Write tests');
  });

  test('formats a completed task with DONE label', () => {
    const task = { title: 'Setup project', completed: true };
    expect(formatTask(task)).toBe('[DONE] Setup project');
  });

  test('trims whitespace from title', () => {
    const task = { title: '  Clean desk  ', completed: false };
    expect(formatTask(task)).toBe('[TODO] Clean desk');
  });

  test('throws error for invalid task', () => {
    expect(() => formatTask(null)).toThrow('Invalid task');
    expect(() => formatTask({ title: '' })).toThrow('Invalid task');
  });
});

// ─── filterTasks ─────────────────────────────────────────────
describe('filterTasks()', () => {
  const tasks = [
    { title: 'Task A', completed: true },
    { title: 'Task B', completed: false },
    { title: 'Task C', completed: true },
    { title: 'Task D', completed: false },
  ];

  test('filters completed tasks', () => {
    const result = filterTasks(tasks, true);
    expect(result).toHaveLength(2);
    expect(result.every(t => t.completed === true)).toBe(true);
  });

  test('filters pending tasks', () => {
    const result = filterTasks(tasks, false);
    expect(result).toHaveLength(2);
    expect(result.every(t => t.completed === false)).toBe(true);
  });

  test('returns empty array for empty input', () => {
    expect(filterTasks([], false)).toEqual([]);
  });

  test('returns empty array for non-array input', () => {
    expect(filterTasks(null, true)).toEqual([]);
    expect(filterTasks('invalid', true)).toEqual([]);
  });
});

// ─── sortTasksByTitle ─────────────────────────────────────────
describe('sortTasksByTitle()', () => {
  test('sorts tasks alphabetically', () => {
    const tasks = [
      { title: 'Zebra task' },
      { title: 'Apple task' },
      { title: 'Mango task' },
    ];
    const sorted = sortTasksByTitle(tasks);
    expect(sorted[0].title).toBe('Apple task');
    expect(sorted[1].title).toBe('Mango task');
    expect(sorted[2].title).toBe('Zebra task');
  });

  test('does not mutate the original array', () => {
    const tasks = [{ title: 'Z' }, { title: 'A' }];
    const sorted = sortTasksByTitle(tasks);
    expect(tasks[0].title).toBe('Z'); // original unchanged
    expect(sorted[0].title).toBe('A');
  });

  test('returns empty array for non-array input', () => {
    expect(sortTasksByTitle(null)).toEqual([]);
  });
});

// ─── countByPriority ──────────────────────────────────────────
describe('countByPriority()', () => {
  test('counts tasks by priority correctly', () => {
    const tasks = [
      { priority: 'high' },
      { priority: 'high' },
      { priority: 'medium' },
      { priority: 'low' },
    ];
    const result = countByPriority(tasks);
    expect(result).toEqual({ high: 2, medium: 1, low: 1 });
  });

  test('defaults missing priority to "low"', () => {
    const tasks = [{ title: 'No priority task' }];
    const result = countByPriority(tasks);
    expect(result.low).toBe(1);
  });

  test('returns zeros for empty array', () => {
    expect(countByPriority([])).toEqual({ high: 0, medium: 0, low: 0 });
  });

  test('returns zeros for non-array input', () => {
    expect(countByPriority(null)).toEqual({ high: 0, medium: 0, low: 0 });
  });
});

// ─── completionPercentage ─────────────────────────────────────
describe('completionPercentage()', () => {
  test('calculates correct percentage', () => {
    const tasks = [
      { completed: true },
      { completed: true },
      { completed: false },
      { completed: false },
    ];
    expect(completionPercentage(tasks)).toBe(50);
  });

  test('returns 100 when all completed', () => {
    const tasks = [{ completed: true }, { completed: true }];
    expect(completionPercentage(tasks)).toBe(100);
  });

  test('returns 0 when none completed', () => {
    const tasks = [{ completed: false }, { completed: false }];
    expect(completionPercentage(tasks)).toBe(0);
  });

  test('returns 0 for empty array', () => {
    expect(completionPercentage([])).toBe(0); //to be
  });

  test('returns 0 for non-array input', () => {
    expect(completionPercentage(null)).toBe(0);
  });

  test('rounds to nearest integer', () => {
    const tasks = [
      { completed: true },
      { completed: false },
      { completed: false },
    ];
    expect(completionPercentage(tasks)).toBe(33);
  });
});
