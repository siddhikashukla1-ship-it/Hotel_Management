import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ManageRooms() {
  const { isAdmin } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // New room form
  const [newRoomData, setNewRoomData] = useState({
    roomNumber: '',
    title: '',
    type: 'Executive Suite',
    pricePerNight: 200,
    capacity: 2,
    bedType: 'King Bed',
    floor: 1,
    status: 'Available',
    cleaningStatus: 'Clean',
    description: '',
    amenities: 'High-Speed Wi-Fi, Smart TV, Air Conditioning, Room Service'
  });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.getRooms();
      if (res.success) {
        setRooms(res.rooms);
      }
    } catch (err) {
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newRoomData,
        amenities: newRoomData.amenities.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await api.createRoom(payload);
      if (res.success) {
        setMessage(`✓ Room ${newRoomData.roomNumber} created successfully!`);
        setIsAddOpen(false);
        setNewRoomData({
          roomNumber: '',
          title: '',
          type: 'Executive Suite',
          pricePerNight: 200,
          capacity: 2,
          bedType: 'King Bed',
          floor: 1,
          status: 'Available',
          cleaningStatus: 'Clean',
          description: '',
          amenities: 'High-Speed Wi-Fi, Smart TV, Air Conditioning, Room Service'
        });
        fetchRooms();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      setError(err.message || 'Creation failed');
    }
  };

  const handleUpdateStatus = async (roomId, newStatus) => {
    try {
      const res = await api.updateRoom(roomId, { status: newStatus });
      if (res.success) {
        setMessage(`✓ Room status updated to ${newStatus}`);
        fetchRooms();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Status update failed');
    }
  };

  const handleUpdateHousekeeping = async (roomId, cleaningStatus) => {
    try {
      const res = await api.updateHousekeeping(roomId, {
        cleaningStatus,
        status: cleaningStatus === 'Clean' || cleaningStatus === 'Inspected' ? 'Available' : undefined
      });
      if (res.success) {
        setMessage(`✓ Housekeeping status changed to ${cleaningStatus}`);
        fetchRooms();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Housekeeping update failed');
    }
  };

  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Permanently remove Room ${roomNumber} from inventory?`)) return;
    try {
      const res = await api.deleteRoom(roomId);
      if (res.success) {
        setMessage(`✓ Room ${roomNumber} deleted.`);
        fetchRooms();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete room');
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <span className="badge bg-dark text-warning text-uppercase px-3 py-1 mb-1">
              Inventory & Housekeeping
            </span>
            <h2 className="font-serif fw-bold text-dark mb-0">Room Inventory Control</h2>
            <small className="text-muted">Manage property capacity, maintenance schedules, and cleaning turnover</small>
          </div>

          <div className="d-flex gap-2 mt-2 mt-sm-0">
            {isAdmin && (
              <button onClick={() => setIsAddOpen(true)} className="btn btn-gold btn-sm rounded-pill px-3 fw-bold">
                <i className="bi bi-plus-lg me-1"></i> Add New Room
              </button>
            )}
            <button onClick={fetchRooms} className="btn btn-outline-secondary btn-sm rounded-pill px-3">
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm mb-4">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show rounded-3 shadow-sm mb-4">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {/* Room Table */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
          <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
            <h6 className="fw-bold mb-0 text-dark">
              Active Inventory: <span className="text-primary">{rooms.length} Suites</span>
            </h6>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th className="ps-4">Room #</th>
                    <th>Suite Details</th>
                    <th>Rate / Night</th>
                    <th>Specs</th>
                    <th>Operational Status</th>
                    <th>Housekeeping Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {rooms.map((r) => (
                    <tr key={r._id}>
                      <td className="ps-4">
                        <span className="badge bg-dark fs-6 font-monospace px-3 py-2">
                          #{r.roomNumber}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{r.title}</div>
                        <div className="text-muted">{r.type} • Floor {r.floor}</div>
                      </td>
                      <td>
                        <strong className="fs-6 text-dark font-serif">${r.pricePerNight}</strong>
                        <span className="text-muted small"> / night</span>
                      </td>
                      <td>
                        <div><i className="bi bi-people me-1"></i> {r.capacity} Guests</div>
                        <div className="text-muted"><i className="bi bi-moon-stars me-1"></i> {r.bedType}</div>
                      </td>
                      <td>
                        <select
                          className={`form-select form-select-sm fw-semibold ${r.status === 'Available' ? 'text-success' : r.status === 'Occupied' ? 'text-danger' : 'text-warning'}`}
                          style={{ maxWidth: '140px' }}
                          value={r.status}
                          onChange={(e) => handleUpdateStatus(r._id, e.target.value)}
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ maxWidth: '140px' }}
                          value={r.cleaningStatus || 'Clean'}
                          onChange={(e) => handleUpdateHousekeeping(r._id, e.target.value)}
                        >
                          <option value="Clean">Clean</option>
                          <option value="Dirty">Dirty</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Inspected">Inspected</option>
                        </select>
                      </td>
                      <td className="text-end pe-4">
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteRoom(r._id, r.roomNumber)}
                            className="btn btn-outline-danger btn-sm"
                            title="Delete Room"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Room Modal */}
      {isAddOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(11, 19, 43, 0.75)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white p-4">
                <h5 className="modal-title font-serif fw-bold">Add New Room to Inventory</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsAddOpen(false)}></button>
              </div>

              <form onSubmit={handleCreateRoom}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Room Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 501"
                        required
                        value={newRoomData.roomNumber}
                        onChange={(e) => setNewRoomData({ ...newRoomData, roomNumber: e.target.value })}
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Suite Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Grand Horizon Penthouse"
                        required
                        value={newRoomData.title}
                        onChange={(e) => setNewRoomData({ ...newRoomData, title: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Room Type</label>
                      <select
                        className="form-select"
                        value={newRoomData.type}
                        onChange={(e) => setNewRoomData({ ...newRoomData, type: e.target.value })}
                      >
                        <option value="Executive Suite">Executive Suite</option>
                        <option value="Presidential Suite">Presidential Suite</option>
                        <option value="Deluxe Double">Deluxe Double</option>
                        <option value="Standard Single">Standard Single</option>
                        <option value="Family Suite">Family Suite</option>
                        <option value="Luxury Villa">Luxury Villa</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Price / Night ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="50"
                        value={newRoomData.pricePerNight}
                        onChange={(e) => setNewRoomData({ ...newRoomData, pricePerNight: e.target.value })}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-bold">Capacity (Guests)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="1"
                        max="10"
                        value={newRoomData.capacity}
                        onChange={(e) => setNewRoomData({ ...newRoomData, capacity: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Bed Arrangement</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. California King Bed"
                        value={newRoomData.bedType}
                        onChange={(e) => setNewRoomData({ ...newRoomData, bedType: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Floor Level</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={newRoomData.floor}
                        onChange={(e) => setNewRoomData({ ...newRoomData, floor: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Amenities (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newRoomData.amenities}
                        onChange={(e) => setNewRoomData({ ...newRoomData, amenities: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={newRoomData.description}
                        onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light p-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gold rounded-pill px-4 fw-bold">
                    Create Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

