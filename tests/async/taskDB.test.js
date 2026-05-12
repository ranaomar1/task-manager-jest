// ============================================================
// tests/async/taskDB.test.js
// Async Testing - Tests for async database operations
// ============================================================

const {
  saveTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  resetDB,
} = require('../../src/taskDB');

// Reset the in-memory DB before each test
beforeEach(() => {
  resetDB();
});

// ─── saveTask ─────────────────────────────────────
describe('saveTask() - async', () => {
  test('saves a task and returns it with an ID', async () => {
    const task = await saveTask({ title: 'Learn Jest', priority: 'high' });
    expect(task).toHaveProperty('id');
    expect(task.title).toBe('Learn Jest');
    expect(task.priority).toBe('high');
    expect(task.completed).toBe(false);
    expect(task).toHaveProperty('createdAt'); //jknu;'jiv
  });

  test('defaults completed to false', async () => {
    const task = await saveTask({ title: 'Default task' });
    expect(task.completed).toBe(false);
  });

  test('defaults priority to "low" if not provided', async () => {
    const task = await saveTask({ title: 'Low priority task' });
    expect(task.priority).toBe('low');
  });

  test('rejects if title is missing', async () => {
    await expect(saveTask({})).rejects.toThrow('Task title is required');
  });

  test('rejects if task data is null', async () => {
    await expect(saveTask(null)).rejects.toThrow();
  });

  test('assigns incrementing IDs to multiple tasks', async () => {
    const t1 = await saveTask({ title: 'Task 1' });
    const t2 = await saveTask({ title: 'Task 2' });
    const t3 = await saveTask({ title: 'Task 3' });
    expect(t1.id).toBe(1);
    expect(t2.id).toBe(2);
    expect(t3.id).toBe(3);
  });
});

// ─── getAllTasks ──────────────────────────────────────────────
describe('getAllTasks() - async', () => {
  test('returns empty array when no tasks exist', async () => {
    const tasks = await getAllTasks();
    expect(tasks).toEqual([]);
  });

  test('returns all saved tasks', async () => {
    await saveTask({ title: 'Task A' });
    await saveTask({ title: 'Task B' });
    const tasks = await getAllTasks();
    expect(tasks).toHaveLength(2);
  });

  test('returns a copy, not the original array', async () => {
    await saveTask({ title: 'Task A' });
    const tasks = await getAllTasks();
    tasks.push({ title: 'Injected' });
    const tasks2 = await getAllTasks();
    expect(tasks2).toHaveLength(1); // DB unaffected
  });
});

// ─── getTaskById ─────────────────────────────────────────────
describe('getTaskById() - async', () => {
  test('returns the correct task by ID', async () => {
    const saved = await saveTask({ title: 'Find me' });
    const found = await getTaskById(saved.id);
    expect(found.title).toBe('Find me');
  });

  test('returns null for non-existent ID', async () => {
    const result = await getTaskById(999);
    expect(result).toBeNull();
  });
});

// ─── updateTask ─────────────────────────────────────
describe('updateTask() - async', () => {
  test('updates a task successfully', async () => {
    const task = await saveTask({ title: 'Old title' });
    const updated = await updateTask(task.id, { title: 'New title', completed: true });
    expect(updated.title).toBe('New title');
    expect(updated.completed).toBe(true);
  });

  test('rejects if task ID does not exist', async () => {
    await expect(updateTask(999, { title: 'Ghost' })).rejects.toThrow('not found');
  });

  test('preserves original fields not in the update', async () => {
    const task = await saveTask({ title: 'Keep me', priority: 'high' });
    const updated = await updateTask(task.id, { completed: true });
    expect(updated.priority).toBe('high');
    expect(updated.title).toBe('Keep me');
  });
});

// ─── deleteTask ────────────────────────────────────────
describe('deleteTask() - async', () => {
  test('deletes a task and returns true', async () => {
    const task = await saveTask({ title: 'Delete me' });
    const result = await deleteTask(task.id);
    expect(result).toBe(true);
  });

  test('task is no longer retrievable after deletion', async () => {
    const task = await saveTask({ title: 'Gone soon' });
    await deleteTask(task.id);
    const found = await getTaskById(task.id);
    expect(found).toBeNull();
  });

  test('rejects if task does not exist', async () => {
    await expect(deleteTask(999)).rejects.toThrow('not found');
  });
});

// ─── Promise-based syntax ─────────────────────────────────────
describe('Promise-based syntax (alternative to async/await)', () => {
  test('saveTask works with .then()', () => {
    return saveTask({ title: 'Promise task' }).then(task => {
      expect(task.title).toBe('Promise task');
    });
  });

  test('saveTask rejection works with .catch()', () => {
    return saveTask(null).catch(err => {
      expect(err).toBeTruthy();
    });
  });
});
