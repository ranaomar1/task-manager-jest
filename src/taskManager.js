// ============================================================
// taskManager.js - Main Task Manager integrating all modules
// ============================================================

const { validateTask, formatTask, filterTasks, completionPercentage } = require('./taskUtils');
const { saveTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('./taskDB');
const { sendEmail } = require('./notificationService');

class TaskManager {
  constructor(userEmail = null) {
    this.userEmail = userEmail;
  }

  /**
   * Adds a new task
   * @param {Object} taskData
   * @returns {Promise<Object>}
   */
  async addTask(taskData) {
    if (!validateTask(taskData)) {
      throw new Error('Invalid task data');
    }
    const task = await saveTask(taskData);

    // Notify user if email is set
    if (this.userEmail) {
      await sendEmail(
        this.userEmail,
        'New Task Added',
        `Task "${task.title}" has been added.`
      );
    }
    return task;
  }

  /**
   * Gets all tasks
   * @returns {Promise<Array>}
   */
  async getTasks() {
    return getAllTasks();
  }

  /**
   * Gets a task by ID
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getTask(id) {
    const task = await getTaskById(id);
    if (!task) throw new Error(`Task ${id} not found`);
    return task;
  }

  /**
   * Marks a task as complete
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async completeTask(id) {
    return updateTask(id, { completed: true });
  }

  /**
   * Removes a task
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async removeTask(id) {
    return deleteTask(id);
  }

  /**
   * Gets formatted task list
   * @returns {Promise<Array<string>>}
   */
  async getFormattedTasks() {
    const tasks = await getAllTasks();
    return tasks.map(formatTask);
  }

  /**
   * Gets pending tasks
   * @returns {Promise<Array>}
   */
  async getPendingTasks() {
    const tasks = await getAllTasks();
    return filterTasks(tasks, false);
  }

  /**
   * Gets completion stats
   * @returns {Promise<Object>}
   */
  async getStats() {
    const tasks = await getAllTasks();
    return {
      total: tasks.length,
      completed: filterTasks(tasks, true).length,
      pending: filterTasks(tasks, false).length,
      percentage: completionPercentage(tasks),
    };
  }
}

module.exports = TaskManager;
