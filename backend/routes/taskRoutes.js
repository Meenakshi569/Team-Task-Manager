const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTasksByProject,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// @route   GET /api/tasks/stats
// @access  Private
router.get('/stats', getTaskStats);

// @route   GET /api/tasks
// @access  Private
router.get('/', getTasks);

// @route   GET /api/tasks/project/:projectId
// @access  Private
router.get('/project/:projectId', getTasksByProject);

// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', getTask);

// @route   POST /api/tasks
// @access  Private (Admin only)
router.post(
  '/',
  adminOnly,
  [
    body('title').not().isEmpty().withMessage('Task title is required'),
    body('project').not().isEmpty().withMessage('Project is required'),
    body('assignedTo').not().isEmpty().withMessage('Assignee is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required')
  ],
  createTask
);

// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', updateTask);

// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
router.delete('/:id', adminOnly, deleteTask);

module.exports = router;