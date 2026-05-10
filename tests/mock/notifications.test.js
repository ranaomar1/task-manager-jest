// ============================================================
// tests/mock/notifications.test.js
// Mocking - Tests using jest.fn() and jest.mock()
// ============================================================

// ─── Mock entire module ───────────────────────────────────────
jest.mock('../../src/notificationService');

const { sendEmail, sendSMS } = require('../../src/notificationService');
const { resetDB } = require('../../src/taskDB');
const TaskManager = require('../../src/taskManager');

// ─── jest.fn() - Manual function mocking ─────────────────────
describe('jest.fn() - manual mock functions', () => {
  test('mock function can be called and tracked', () => {
    const mockFn = jest.fn();
    mockFn('hello');
    mockFn('world');
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('hello');
    expect(mockFn).toHaveBeenLastCalledWith('world');
  });

  test('mock function returns configured value', () => {
    const mockFn = jest.fn().mockReturnValue(42);
    expect(mockFn()).toBe(42);
    expect(mockFn()).toBe(42);
  });

  test('mock function returns different values per call', () => {
    const mockFn = jest.fn()
      .mockReturnValueOnce('first')
      .mockReturnValueOnce('second')
      .mockReturnValue('default');
    expect(mockFn()).toBe('first');
    expect(mockFn()).toBe('second');
    expect(mockFn()).toBe('default');
  });

  test('mock async function resolves correctly', async () => {
    const mockAsync = jest.fn().mockResolvedValue({ status: 'ok' });
    const result = await mockAsync();
    expect(result).toEqual({ status: 'ok' }); //inliuabvuip;ha
  });

  test('mock async function can reject', async () => {
    const mockAsync = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(mockAsync()).rejects.toThrow('Network error');
  });

  test('mock function captures all arguments', () => {
    const mockFn = jest.fn();
    mockFn(1, 'two', { three: 3 });
    expect(mockFn.mock.calls[0]).toEqual([1, 'two', { three: 3 }]);
  });
});

// ─── jest.mock() - Module mocking ────────────────────────────
describe('jest.mock() - notificationService module is mocked', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetDB();
    // Set up default mock implementations
    sendEmail.mockResolvedValue({ success: true, messageId: 'mock_123' });
    sendSMS.mockResolvedValue({ success: true, sid: 'mock_sms_456' });
  });

  test('sendEmail is replaced by a mock', () => {
    expect(jest.isMockFunction(sendEmail)).toBe(true);
    expect(jest.isMockFunction(sendSMS)).toBe(true);
  });

  test('TaskManager calls sendEmail when adding a task with email', async () => {
    const manager = new TaskManager('user@example.com');
    await manager.addTask({ title: 'Email notification task' });

    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      'user@example.com',
      'New Task Added',
      expect.stringContaining('Email notification task')
    );
  });

  test('TaskManager does NOT call sendEmail without user email', async () => {
    const manager = new TaskManager(); // no email
    await manager.addTask({ title: 'Silent task' });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  test('TaskManager still works when sendEmail fails (mock rejection)', async () => {
    sendEmail.mockRejectedValueOnce(new Error('Email server down'));
    const manager = new TaskManager('fail@example.com');

    // Should propagate the error
    await expect(manager.addTask({ title: 'Test task' })).rejects.toThrow('Email server down');
  });

  test('mock returns configured success response', async () => {
    const result = await sendEmail('a@b.com', 'Subject', 'Body');
    expect(result).toEqual({ success: true, messageId: 'mock_123' });
  });

  test('can verify how many times each function was called', async () => {
    const manager = new TaskManager('a@b.com');
    await manager.addTask({ title: 'Task 1' });
    await manager.addTask({ title: 'Task 2' });
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });
});

// ─── Spy with jest.spyOn ──────────────────────────────────────
describe('jest.spyOn() - spying on methods', () => {
  beforeEach(() => {
    resetDB();
    jest.clearAllMocks();
    sendEmail.mockResolvedValue({ success: true });
  });

  test('spyOn can observe method calls without replacing them', () => {
    const obj = {
      greet: (name) => `Hello, ${name}!`,
    };
    const spy = jest.spyOn(obj, 'greet');
    const result = obj.greet('Jest');
    expect(result).toBe('Hello, Jest!');     // original behavior
    expect(spy).toHaveBeenCalledWith('Jest');
    spy.mockRestore();
  });

  test('spyOn can override return value', () => {
    const obj = { compute: () => 100 };
    const spy = jest.spyOn(obj, 'compute').mockReturnValue(999);
    expect(obj.compute()).toBe(999);
    spy.mockRestore();
    expect(obj.compute()).toBe(100); // restored
  });
});
