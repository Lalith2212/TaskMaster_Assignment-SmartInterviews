import React, { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../api';
import TaskModal from '../components/TaskModal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import './Tasks.css';

const statusLabel = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done'
};

const priorityLabel = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

const TaskCard = ({ task, onEdit, onDelete, onToggleDone }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`task-card card ${task.status === 'done' ? 'done' : ''}`}>
      <div className="task-card-top">
        <div className="task-check">
          <input
            type="checkbox"
            checked={task.status === 'done'}
            onChange={() => onToggleDone(task)}
            title={task.status === 'done' ? 'Mark as incomplete' : 'Mark as complete'}
          />
        </div>
        <div className="task-main">
          <h4 className="task-title">{task.title}</h4>
          {task.description && <p className="task-desc">{task.description}</p>}
        </div>
        <div className="task-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(task)}>Edit</button>
          <button className="btn btn-ghost btn-sm danger-hover" onClick={() => onDelete(task._id)}>Remove</button>
        </div>
      </div>
      <div className="task-meta">
        <span className={`badge badge-${task.status}`}>{statusLabel[task.status]}</span>
        <span className={`badge badge-${task.priority}`}>{priorityLabel[task.priority]}</span>
        {task.dueDate && (
          <span className={`badge ${isOverdue ? 'badge-overdue' : 'badge-date'}`}>
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
            {isOverdue && ' — Overdue'}
          </span>
        )}
      </div>
    </div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all', priority: 'all', search: '', sortBy: 'createdAt', order: 'desc'
  });
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [page, setPage] = useState(1);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 8 };
      if (filters.status === 'all') delete params.status;
      if (filters.priority === 'all') delete params.priority;
      if (!filters.search) delete params.search;
      const res = await taskAPI.getAll(params);
      setTasks(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { setPage(1); }, [filters]);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleEdit = (task) => { setEditTask(task); setShowModal(true); };
  const handleNew = () => { setEditTask(null); setShowModal(true); };

  const handleDelete = async (id) => {
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted.');
      setDeleteConfirm(null);
      fetchTasks();
    } catch {
      toast.error('Failed to delete task.');
    }
  };

  const handleToggleDone = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      await taskAPI.update(task._id, { ...task, status: newStatus });
      toast.success(newStatus === 'done' ? 'Task marked as complete.' : 'Task marked as pending.');
      fetchTasks();
    } catch {
      toast.error('Failed to update task.');
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>My Tasks</h1>
          <p>{pagination.total} task{pagination.total !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn btn-primary" onClick={handleNew}>New Task</button>
      </div>

      <div className="filters card">
        <input
          className="input search-input"
          name="search"
          placeholder="Search by title"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select className="input filter-select" name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select className="input filter-select" name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className="input filter-select" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value="createdAt">Sort: Date Created</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
        </select>
        <select className="input filter-select" name="order" value={filters.order} onChange={handleFilterChange}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {loading ? (
        <div className="tasks-loading"><div className="spinner" /></div>
      ) : tasks.length === 0 ? (
        <div className="card empty-tasks">
          <h3>No tasks found</h3>
          <p>Adjust your filters or create a new task.</p>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handleNew}>Create Task</button>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteConfirm(id)}
              onToggleDone={handleToggleDone}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </button>
          <span className="page-info">Page {page} of {pagination.totalPages}</span>
          <button className="btn btn-ghost btn-sm" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </button>
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editTask}
          onClose={() => { setShowModal(false); setEditTask(null); }}
          onSaved={fetchTasks}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h2>Delete Task</h2>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
