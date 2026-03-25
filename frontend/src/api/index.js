const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://taskmaster-assignment-smartinterviews.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const request = async (method, path, body = null, params = null) => {
  let url = `${API_BASE_URL}${path}`;

  if (params) {
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    if (query) url += `?${query}`;
  }

  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(url, config);

  // Handle 401 globally
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data?.message || 'Something went wrong');
    error.response = { data, status: res.status };
    throw error;
  }

  return { data };
};

// Auth APIs
export const authAPI = {
  register: (body)     => request('POST', '/auth/register', body),
  login:    (body)     => request('POST', '/auth/login', body),
  getMe:    ()         => request('GET',  '/auth/me'),
};

// Task APIs
export const taskAPI = {
  getAll:   (params)   => request('GET',    '/tasks',       null, params),
  getOne:   (id)       => request('GET',    `/tasks/${id}`),
  create:   (body)     => request('POST',   '/tasks',       body),
  update:   (id, body) => request('PUT',    `/tasks/${id}`, body),
  delete:   (id)       => request('DELETE', `/tasks/${id}`),
};

// Analytics APIs
export const analyticsAPI = {
  get: () => request('GET', '/analytics'),
};