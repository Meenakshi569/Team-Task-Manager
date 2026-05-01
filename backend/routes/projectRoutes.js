const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// @route   GET /api/projects
// @access  Private
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', getProject);

// @route   POST /api/projects
// @access  Private (Admin only)
router.post(
  '/',
  adminOnly,
  [
    body('name').not().isEmpty().withMessage('Project name is required'),
    body('description').optional()
  ],
  createProject
);

// @route   PUT /api/projects/:id
// @access  Private (Admin only)
router.put('/:id', adminOnly, updateProject);

// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
router.delete('/:id', adminOnly, deleteProject);

module.exports = router;