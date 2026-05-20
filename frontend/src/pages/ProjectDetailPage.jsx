import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI } from '../services/api';
import { useAuth } from '../services/useAuth';
import './ProjectDetail.css';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const projectRes = await projectAPI.getProjectById(id);
      setProject(projectRes.data.project);

      const tasksRes = await taskAPI.getTasks({ projectId: id });
      setTasks(tasksRes.data.tasks || []);

      const statsRes = await taskAPI.getProjectStats(id);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError('Failed to fetch project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.createTask({
        ...taskForm,
        projectId: id
      });
      setTaskForm({ title: '', description: '', priority: 'Medium', dueDate: '' });
      setShowTaskForm(false);
      fetchProjectData();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMember(id, { email: memberEmail });
      setMemberEmail('');
      setShowMemberForm(false);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        fetchProjectData();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isProjectAdmin = project && (project.owner._id === user?.id || 
    project.members.some(m => m.user._id === user?.id && m.role === 'Admin'));

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
        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : project ? (
          <>
            <div className="project-header">
              <div>
                <h1 className="page-title">{project.name}</h1>
                <p className="project-description">{project.description}</p>
              </div>
              <button className="btn btn-outline" onClick={() => navigate('/projects')}>
                Back to Projects
              </button>
            </div>

            {stats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: '#10b981' }}>{stats.completed}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.inProgress}</div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: '#ef4444' }}>{stats.overdue}</div>
                  <div className="stat-label">Overdue</div>
                </div>
              </div>
            )}

            <div className="project-content">
              <section className="project-section">
                <div className="section-header">
                  <h2>Tasks</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowTaskForm(!showTaskForm)}
                  >
                    {showTaskForm ? 'Cancel' : 'New Task'}
                  </button>
                </div>

                {showTaskForm && (
                  <div className="card form-container">
                    <form onSubmit={handleCreateTask}>
                      <div className="form-group">
                        <label>Task Title</label>
                        <input
                          type="text"
                          value={taskForm.title}
                          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={taskForm.description}
                          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                          rows="3"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Priority</label>
                          <select
                            value={taskForm.priority}
                            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                          >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Due Date</label>
                          <input
                            type="date"
                            value={taskForm.dueDate}
                            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary">Create Task</button>
                    </form>
                  </div>
                )}

                <div className="tasks-container">
                  {tasks.length === 0 ? (
                    <p className="empty-state">No tasks yet</p>
                  ) : (
                    tasks.map(task => (
                      <div key={task._id} className="task-card">
                        <div className="task-header">
                          <div>
                            <h4>{task.title}</h4>
                            <p className="task-meta">{task.description}</p>
                          </div>
                          <div className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                            {task.priority}
                          </div>
                        </div>
                        <div className="task-footer">
                          <select 
                            value={task.status}
                            onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                            className="status-select"
                          >
                            <option>Todo</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>On Hold</option>
                          </select>
                          {isProjectAdmin && (
                            <button 
                              className="btn btn-danger btn-small"
                              onClick={() => handleDeleteTask(task._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="project-section">
                <div className="section-header">
                  <h2>Team Members</h2>
                  {isProjectAdmin && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowMemberForm(!showMemberForm)}
                    >
                      {showMemberForm ? 'Cancel' : 'Add Member'}
                    </button>
                  )}
                </div>

                {showMemberForm && (
                  <div className="card form-container">
                    <form onSubmit={handleAddMember}>
                      <div className="form-group">
                        <label>Member Email</label>
                        <input
                          type="email"
                          value={memberEmail}
                          onChange={(e) => setMemberEmail(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-secondary">Add Member</button>
                    </form>
                  </div>
                )}

                <div className="members-list">
                  {project.members.map(member => (
                    <div key={member.user._id} className="member-item">
                      <div>
                        <h4>{member.user.name}</h4>
                        <p className="member-email">{member.user.email}</p>
                      </div>
                      <span className={`role-badge role-${member.role.toLowerCase()}`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="error">Project not found</div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
