// ============================================================
// taskUtils.js - Core utility functions for Task Manager
// ============================================================

/**
 * Validates a task object
 * @param {Object} task
 * @returns {boolean}
 */
function validateTask(task) {
  if (!task || typeof task !== 'object') return false;
  if (!task.title || typeof task.title !== 'string') return false;
  if (task.title.trim() === '') return false;
  return true;
}

/**
 * Generates a unique task ID
 * @param {number} existingCount
 * @returns {string}
 */
function generateTaskId(existingCount = 0) {
  if (typeof existingCount !== 'number' || existingCount < 0) {
    throw new Error('existingCount must be a non-negative number');
  }
  return `task_${existingCount + 1}_${Date.now()}`;
}

/**
 * Formats a task for display
 * @param {Object} task
 * @returns {string}
 */
function formatTask(task) {
  if (!validateTask(task)) throw new Error('Invalid task');
  const status = task.completed ? 'DONE' : 'TODO';
  return `[${status}] ${task.title.trim()}`;
}

/**
 * Filters tasks by status
 * @param {Array} tasks
 * @param {boolean} completed
 * @returns {Array}
 */
function filterTasks(tasks, completed) {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter(t => t.completed === completed);
}

/**
 * Sorts tasks alphabetically by title
 * @param {Array} tasks
 * @returns {Array}
 */
function sortTasksByTitle(tasks) {
  if (!Array.isArray(tasks)) return [];
  return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Counts tasks by priority
 * @param {Array} tasks
 * @returns {Object}
 */
function countByPriority(tasks) {
  if (!Array.isArray(tasks)) return { high: 0, medium: 0, low: 0 };
  return tasks.reduce((acc, task) => {
    const p = task.priority || 'low';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, { high: 0, medium: 0, low: 0 });
}

/**
 * Calculates completion percentage
 * @param {Array} tasks
 * @returns {number}
 */
function completionPercentage(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;
  const done = tasks.filter(t => t.completed).length;
  return Math.round((done / tasks.length) * 100);
}

module.exports = {
  validateTask,
  generateTaskId,
  formatTask,
  filterTasks,
  sortTasksByTitle,
  countByPriority,
  completionPercentage,
};
