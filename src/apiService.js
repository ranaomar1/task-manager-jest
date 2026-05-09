// ============================================================
// apiService.js - Simulated API service (fetch-based)
// ============================================================

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Fetches all todos from API
 * @returns {Promise<Array>}
 */
async function fetchTodos() {
  const response = await fetch(`${BASE_URL}/todos`);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

/**
 * Fetches a single todo by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
async function fetchTodoById(id) {
  const response = await fetch(`${BASE_URL}/todos/${id}`);
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

/**
 * Creates a new todo via API
 * @param {Object} todo
 * @returns {Promise<Object>}
 */
async function createTodo(todo) {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

/**
 * Updates a todo via API
 * @param {number} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
async function updateTodo(id, updates) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return response.json();
}

/**
 * Deletes a todo via API
 * @param {number} id
 * @returns {Promise<boolean>}
 */
async function deleteTodo(id) {
  const response = await fetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  return true;
}

module.exports = { fetchTodos, fetchTodoById, createTodo, updateTodo, deleteTodo, BASE_URL };
