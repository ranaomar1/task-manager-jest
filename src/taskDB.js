// ============================================================
// taskDB.js - Simulated database layer for tasks
// ============================================================

let tasks = [];
let nextId = 1;

/**
 * Saves a new task to the database
 * @param {Object} taskData
 * @returns {Promise<Object>}
 */
async function saveTask(taskData) {
  if (!taskData || !taskData.title) {
    throw new Error('Task title is required');
  }
  const task = {
    id: nextId++,
    title: taskData.title,
    completed: taskData.completed || false,
    priority: taskData.priority || 'low',
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

/**
 * Gets all tasks from the database
 * @returns {Promise<Array>}
 */
async function getAllTasks() {
  return [...tasks];
}

/**
 * Gets a task by ID
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function getTaskById(id) {
  const task = tasks.find(t => t.id === id);
  return task || null;
}

/**
 * Updates a task
 * @param {number} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
async function updateTask(id, updates) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error(`Task with id ${id} not found`);
  tasks[index] = { ...tasks[index], ...updates };
  return tasks[index];
}

/**
 * Deletes a task
 * @param {number} id
 * @returns {Promise<boolean>}
 */
async function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error(`Task with id ${id} not found`);
  tasks.splice(index, 1);
  return true;
}

/**
 * Resets the database (for testing)
 */
function resetDB() {
  tasks = [];
  nextId = 1;
}

module.exports = { saveTask, getAllTasks, getTaskById, updateTask, deleteTask, resetDB };
