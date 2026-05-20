import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuth } from '../services/useAuth';
import './Projects.css';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', dueDate: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectAPI.getProjects();
      setProjects(res.data.projects || []);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.createProject(formData);
      setFormData({ name: '', description: '', dueDate: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await projectAPI.deleteProject(projectId);
        fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">Ethara</div>
          <div className="navbar-menu">
            <a href="/projects">Projects</a>
            <a href="/dashboard">Dashboard</a>
          </div>
          <div className="navbar-user">
            <span>{user?.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="page-header">
          <h1 className="page-title">Projects</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Project'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {showForm && (
          <div className="card form-container">
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">Create</button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="projects-grid">
            {projects.length === 0 ? (
              <div className="empty-state">No projects yet. Create one to get started!</div>
            ) : (
              projects.map(project => (
                <div key={project._id} className="project-card">
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-meta">
                    <span className="badge">{project.members.length} members</span>
                    <span className="badge">{project.status}</span>
                  </div>
                  {project.dueDate && (
                    <p className="due-date">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                  )}
                  <div className="project-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/projects/${project._id}`)}
                    >
                      View
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
