import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    const project = new Project({
      name,
      description,
      dueDate,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'Admin' }]
    });

    await project.save();
    await project.populate(['owner', 'members.user']);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project'
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    }).populate(['owner', 'members.user']);

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate(['owner', 'members.user']);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access
    const hasAccess = project.owner._id.toString() === req.user.id ||
      project.members.some(m => m.user._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project'
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { name, description, status, dueDate } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permission
    if (project.owner.toString() !== req.user.id && 
        !project.members.some(m => m.user.toString() === req.user.id && m.role === 'Admin')) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update project'
      });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.status = status || project.status;
    project.dueDate = dueDate || project.dueDate;
    project.updatedAt = Date.now();

    await project.save();
    await project.populate(['owner', 'members.user']);

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project'
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only owner can delete project'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project'
    });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permission
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only owner can add members'
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found. Ask them to sign up first.'
      });
    }

    // Check if already member
    if (project.members.some(m => m.user.toString() === user._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member'
      });
    }

    project.members.push({
      user: user._id,
      role: role || 'Member'
    });

    await project.save();
    await project.populate(['owner', 'members.user']);

    res.json({
      success: true,
      message: 'Member added successfully',
      project
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding member'
    });
  }
};
