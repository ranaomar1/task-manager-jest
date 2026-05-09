// ============================================================
// tests/integration/taskManager.test.js
// Integration Testing - Tests interaction between modules
// ============================================================

jest.mock('../../src/notificationService', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true }),
  sendSMS:  jest.fn().mockResolvedValue({ success: true }),
}));

const TaskManager = require('../../src/taskManager');
const { resetDB } = require('../../src/taskDB');

// Reset DB before each test for isolation
beforeEach(() => {
  resetDB();
  jest.clearAllMocks();
});

// ─── Full workflow: add → get → complete → remove ─────────────
describe('Full task lifecycle - integration', () => {
  test('adds a task and retrieves it correctly', async () => {
    const manager = new TaskManager();
    const task = await manager.addTask({ title: 'Integration task', priority: 'high' });

    expect(task.id).toBeDefined();
    expect(task.title).toBe('Integration task');

    const fetched = await manager.getTask(task.id);
    expect(fetched).toEqual(task);
  });

  test('completes a task and reflects status in stats', async () => {
    const manager = new TaskManager();
    const t1 = await manager.addTask({ title: 'Task A' });
    const t2 = await manager.addTask({ title: 'Task B' });

    await manager.completeTask(t1.id);

    const stats = await manager.getStats();
    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(1);
    expect(stats.percentage).toBe(50);
  });

  test('removes a task and updates the task list', async () => {
    const manager = new TaskManager();
    const t1 = await manager.addTask({ title: 'Keep me' });
    const t2 = await manager.addTask({ title: 'Delete me' });

    await manager.removeTask(t2.id);

    const tasks = await manager.getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Keep me');
  });

  test('getFormattedTasks returns correct format for mixed tasks', async () => {
    const manager = new TaskManager();
    const t1 = await manager.addTask({ title: 'Pending task' });
    const t2 = await manager.addTask({ title: 'Done task' });
    await manager.completeTask(t2.id);

    const formatted = await manager.getFormattedTasks();
    expect(formatted).toContain('[TODO] Pending task');
    expect(formatted).toContain('[DONE] Done task');
  });

  test('getPendingTasks returns only incomplete tasks', async () => {
    const manager = new TaskManager();
    await manager.addTask({ title: 'Alpha' });
    await manager.addTask({ title: 'Beta' });
    const t3 = await manager.addTask({ title: 'Gamma' });
    await manager.completeTask(t3.id);

    const pending = await manager.getPendingTasks();
    expect(pending).toHaveLength(2);
    expect(pending.every(t => t.completed === false)).toBe(true);
  });
});

// ─── Error propagation across modules ────────────────────────
describe('Error propagation across modules', () => {
  test('addTask throws for invalid data and does not save', async () => {
    const manager = new TaskManager();
    await expect(manager.addTask({ title: '' })).rejects.toThrow('Invalid task data');
    const tasks = await manager.getTasks();
    expect(tasks).toHaveLength(0);
  });

  test('getTask throws when task does not exist', async () => {
    const manager = new TaskManager();
    await expect(manager.getTask(999)).rejects.toThrow('Task 999 not found');
  });

  test('completeTask throws for non-existent task', async () => {
    const manager = new TaskManager();
    await expect(manager.completeTask(999)).rejects.toThrow('not found');
  });

  test('removeTask throws for non-existent task', async () => {
    const manager = new TaskManager();
    await expect(manager.removeTask(999)).rejects.toThrow('not found');
  });
});

// ─── Stats integrity with multiple operations ─────────────────
describe('Stats integrity', () => {
  test('stats show 0% before any task is completed', async () => {
    const manager = new TaskManager();
    await manager.addTask({ title: 'Task 1' });
    await manager.addTask({ title: 'Task 2' });
    const stats = await manager.getStats();
    expect(stats.percentage).toBe(0);
  });

  test('stats show 100% after all tasks are completed', async () => {
    const manager = new TaskManager();
    const t1 = await manager.addTask({ title: 'Task 1' });
    const t2 = await manager.addTask({ title: 'Task 2' });
    await manager.completeTask(t1.id);
    await manager.completeTask(t2.id);
    const stats = await manager.getStats();
    expect(stats.percentage).toBe(100);
  });

  test('stats return zeros for empty task list', async () => {
    const manager = new TaskManager();
    const stats = await manager.getStats();
    expect(stats).toEqual({ total: 0, completed: 0, pending: 0, percentage: 0 });
  });
});

// ─── Multiple manager instances share the same DB ────────────
describe('Multiple TaskManager instances', () => {
  test('two manager instances operate on the same data store', async () => {
    const manager1 = new TaskManager();
    const manager2 = new TaskManager('admin@example.com');

    await manager1.addTask({ title: 'Shared task' });
    const tasks = await manager2.getTasks();

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Shared task');
  });
});
