import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Title and project ID are required'
      });
    }

    // Check project access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      priority: priority || 'Medium',
      dueDate,
      createdBy: req.user.id
    });

    await task.save();
    await task.populate(['project', 'assignedTo', 'createdBy']);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task'
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;

    let query = {};

    if (projectId) {
      query.project = projectId;

      // Check project access
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      const hasAccess = project.owner.toString() === req.user.id ||
        project.members.some(m => m.user.toString() === req.user.id);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate(['project', 'assignedTo', 'createdBy'])
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks'
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate(['project', 'assignedTo', 'createdBy']);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check project access
    const project = await Project.findById(task.project._id);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task'
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;
    task.updatedAt = Date.now();

    await task.save();
    await task.populate(['project', 'assignedTo', 'createdBy']);

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task'
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check project access
    const project = await Project.findById(task.project);
    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id && m.role === 'Admin');

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task'
    });
  }
};

export const getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check project access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const hasAccess = project.owner.toString() === req.user.id ||
      project.members.some(m => m.user.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const tasks = await Task.find({ project: projectId });

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      todo: tasks.filter(t => t.status === 'Todo').length,
      onHold: tasks.filter(t => t.status === 'On Hold').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
};
