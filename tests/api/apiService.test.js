// ============================================================
// tests/api/apiService.test.js
// API Testing - Tests for GET, POST, PUT, DELETE endpoints
// ============================================================

const {
  fetchTodos,
  fetchTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  BASE_URL,
} = require('../../src/apiService');

// ─── Mock global fetch ────────────────────────────────────────
// We mock fetch globally so no real HTTP calls are made
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Helper to create a mock response
function mockResponse(data, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  mockFetch.mockClear();
});

// ─── GET - fetchTodos ───────────────────────────────
describe('GET /todos - fetchTodos()', () => {
  test('fetches all todos successfully', async () => {
    const mockData = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true },
    ];
    mockFetch.mockReturnValueOnce(mockResponse(mockData));

    const todos = await fetchTodos();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/todos`);
    expect(todos).toHaveLength(2);
    expect(todos[0].title).toBe('Task 1');
  });

  test('throws error on HTTP failure (500)', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, 500));
    await expect(fetchTodos()).rejects.toThrow('HTTP error: 500');
  });

  test('throws error on HTTP 404', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, 404));
    await expect(fetchTodos()).rejects.toThrow('HTTP error: 404');
  });
});

// ─── GET - fetchTodoById ───────────────────────
describe('GET /todos/:id - fetchTodoById()', () => {
  test('fetches a single todo by ID', async () => {
    const mockTodo = { id: 5, title: 'Specific Task', completed: false };
    mockFetch.mockReturnValueOnce(mockResponse(mockTodo));

    const todo = await fetchTodoById(5);

    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/todos/5`);
    expect(todo.id).toBe(5);
    expect(todo.title).toBe('Specific Task');
  });

  test('throws error when todo not found (404)', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, 404));
    await expect(fetchTodoById(9999)).rejects.toThrow('HTTP error: 404');
  });
});

// ─── POST - createTodo ─────────────────────────
describe('POST /todos - createTodo()', () => {
  test('creates a new todo and returns it with ID', async () => {
    const newTodo = { title: 'New Task', completed: false, userId: 1 };
    const createdTodo = { ...newTodo, id: 201 };
    mockFetch.mockReturnValueOnce(mockResponse(createdTodo, 201));

    const result = await createTodo(newTodo);

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/todos`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      })
    );
    expect(result.id).toBe(201);
    expect(result.title).toBe('New Task'); //new task
  });

  test('sends correct Content-Type header', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ id: 1 }));
    await createTodo({ title: 'Test' });

    const callArgs = mockFetch.mock.calls[0][1];
    expect(callArgs.headers['Content-Type']).toBe('application/json');
  });

  test('throws error on server failure (500)', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, 500));
    await expect(createTodo({ title: 'Fail' })).rejects.toThrow('HTTP error: 500');
  });
});

// ─── PUT - updateTodo ───────────────────────────
describe('PUT /todos/:id - updateTodo()', () => {
  test('updates a todo and returns updated data', async () => {
    const updates = { title: 'Updated Title', completed: true };
    const updatedTodo = { id: 1, ...updates };
    mockFetch.mockReturnValueOnce(mockResponse(updatedTodo));

    const result = await updateTodo(1, updates);

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/todos/1`,
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updates),
      })
    );
    expect(result.title).toBe('Updated Title');
    expect(result.completed).toBe(true);
  });

  test('throws error when update target not found (404)', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, 404));
    await expect(updateTodo(9999, { title: 'Ghost' })).rejects.toThrow('HTTP error: 404');
  });

  test('sends correct HTTP method (PUT)', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({ id: 1, title: 'x' }));
    await updateTodo(1, { title: 'x' });

    const callArgs = mockFetch.mock.calls[0][1];
    expect(callArgs.method).toBe('PUT');
  });
});

// ─── DELETE - deleteTodo ─────────────────────────────────────
describe('DELETE /todos/:id - deleteTodo()', () => {
  test('deletes a todo and returns true', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, 200));

    const result = await deleteTodo(1);

    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/todos/1`,
      expect.objectContaining({ method: 'DELETE' })
    );
    expect(result).toBe(true);
  });

  test('throws error when delete target not found (404)', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, 404));
    await expect(deleteTodo(9999)).rejects.toThrow('HTTP error: 404');
  });

  test('sends correct HTTP method (DELETE)', async () => {
    mockFetch.mockReturnValueOnce(mockResponse({}, 200));
    await deleteTodo(5);

    const callArgs = mockFetch.mock.calls[0][1];
    expect(callArgs.method).toBe('DELETE');
  });
});

// ─── Multiple API calls in sequence ──────────────────────────
describe('Chained API operations', () => {
  test('creates then updates a todo', async () => {
    const created = { id: 1, title: 'Original', completed: false };
    const updated = { id: 1, title: 'Modified', completed: true };

    mockFetch
      .mockReturnValueOnce(mockResponse(created, 201))
      .mockReturnValueOnce(mockResponse(updated));

    const newTodo = await createTodo({ title: 'Original' });
    const editedTodo = await updateTodo(newTodo.id, { title: 'Modified', completed: true });

    expect(newTodo.title).toBe('Original');
    expect(editedTodo.title).toBe('Modified');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test('creates then deletes a todo', async () => {
    const created = { id: 2, title: 'To be deleted', completed: false };
    mockFetch
      .mockReturnValueOnce(mockResponse(created, 201))
      .mockReturnValueOnce(mockResponse({}, 200));

    const newTodo = await createTodo({ title: 'To be deleted' });
    const deleted = await deleteTodo(newTodo.id);

    expect(deleted).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
