import React, { useState, useEffect } from 'react';
import { taskAPI } from '../api';
import toast from 'react-hot-toast';

const TaskModal = ({ task, onClose, onSaved }) => {
  const isEdit = !!task;
  const [form, setForm] = useState({
    title: '', description: '', status: 'todo', priority: 'medium', dueDate: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    }
  }, [task]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required.');
    setLoading(true);
    try {
      const payload = { ...form, dueDate: form.dueDate || null };
      if (isEdit) {
        await taskAPI.update(task._id, payload);
        toast.success('Task updated successfully.');
      } else {
        await taskAPI.create(payload);
        toast.success('Task created successfully.');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="label">Title</label>
              <input
                className="input"
                name="title"
                placeholder="Enter task title"
                value={form.title}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label className="label">Description</label>
              <textarea
                className="input"
                name="description"
                placeholder="Optional description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Status</label>
                <select className="input" name="status" value={form.status} onChange={handleChange}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Priority</label>
                <select className="input" name="priority" value={form.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Due Date</label>
              <input
                className="input"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Saving...</> : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
