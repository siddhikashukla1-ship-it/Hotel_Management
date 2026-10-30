const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('hotelpro_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  async getUsers() {
    const res = await fetch(`${API_BASE_URL}/auth/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Rooms
  async getRooms(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const url = `${API_BASE_URL}/rooms${query.toString() ? '?' + query.toString() : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getRoom(id) {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`);
    return handleResponse(res);
  },

  async createRoom(roomData) {
    const res = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData)
    });
    return handleResponse(res);
  },

  async updateRoom(id, roomData) {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(roomData)
    });
    return handleResponse(res);
  },

  async deleteRoom(id) {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateHousekeeping(id, data) {
    const res = await fetch(`${API_BASE_URL}/rooms/${id}/housekeeping`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Bookings
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return handleResponse(res);
  },

  async getBookings(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE_URL}/bookings?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getMyBookings() {
    const res = await fetch(`${API_BASE_URL}/bookings/my`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getBooking(id) {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async checkInGuest(id) {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/check-in`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async checkOutGuest(id) {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/check-out`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async cancelBooking(id) {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Guests
  async getGuests() {
    const res = await fetch(`${API_BASE_URL}/guests`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getGuest(id) {
    const res = await fetch(`${API_BASE_URL}/guests/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateGuestVip(id, vipTier) {
    const res = await fetch(`${API_BASE_URL}/guests/${id}/vip`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ vipTier })
    });
    return handleResponse(res);
  },

  // Payments
  async getPayments() {
    const res = await fetch(`${API_BASE_URL}/payments`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getInvoice(invoiceNumber) {
    const res = await fetch(`${API_BASE_URL}/payments/invoice/${invoiceNumber}`);
    return handleResponse(res);
  },

  async processPayment(paymentData) {
    const res = await fetch(`${API_BASE_URL}/payments/process`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });
    return handleResponse(res);
  },

  // Dashboard
  async getAnalytics() {
    const res = await fetch(`${API_BASE_URL}/dashboard/analytics`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};

