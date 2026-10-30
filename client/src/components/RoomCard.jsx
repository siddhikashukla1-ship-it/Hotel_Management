import React from 'react';
import { Link } from 'react-router-dom';

export default function RoomCard({ room, onBook }) {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'badge-available';
      case 'Occupied':
        return 'badge-occupied';
      case 'Cleaning':
        return 'badge-cleaning';
      default:
        return 'badge-maintenance';
    }
  };

  const imageSrc = room.images && room.images.length > 0
    ? room.images[0]
    : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="card hotel-card h-100 overflow-hidden border-0">
      {/* Image with status badge */}
      <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
        <img
          src={imageSrc}
          alt={room.title}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
        />
        <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
          <span className={`badge rounded-pill px-3 py-1 shadow-sm ${getBadgeClass(room.status)}`}>
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
            {room.status}
          </span>
          <span className="badge bg-dark bg-opacity-75 rounded-pill px-2 py-1 text-white small">
            Room {room.roomNumber}
          </span>
        </div>
        <div className="position-absolute bottom-0 end-0 m-2 badge bg-black bg-opacity-75 text-warning rounded-pill px-2 py-1 small">
          <i className="bi bi-star-fill me-1 text-warning"></i> {room.rating || 4.9}
        </div>
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: '0.5px' }}>
            {room.type}
          </span>
          <span className="text-muted small">Floor {room.floor}</span>
        </div>

        <h5 className="card-title fw-bold mb-2 font-serif text-dark line-clamp-1">
          {room.title}
        </h5>

        <p className="card-text text-muted small mb-3 flex-grow-1" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {room.description}
        </p>

        {/* Room features */}
        <div className="d-flex align-items-center gap-3 text-muted small mb-3 py-2 border-top border-bottom">
          <div title="Max Guests">
            <i className="bi bi-people me-1 text-secondary"></i> {room.capacity} Guests
          </div>
          <div>•</div>
          <div title="Bed Type">
            <i className="bi bi-moon-stars me-1 text-secondary"></i> {room.bedType}
          </div>
          <div>•</div>
          <div title="Housekeeping Status" className="text-capitalize">
            <i className="bi bi-sparkles me-1 text-warning"></i> {room.cleaningStatus}
          </div>
        </div>

        {/* Price & Action */}
        <div className="d-flex align-items-center justify-content-between mt-auto pt-2">
          <div>
            <span className="fs-4 fw-bold text-dark font-serif">${room.pricePerNight}</span>
            <span className="text-muted small"> / night</span>
          </div>

          <div className="d-flex gap-2">
            <Link
              to={`/rooms/${room._id}`}
              className="btn btn-outline-secondary btn-sm px-3 rounded-pill"
              title="View full specs & photos"
            >
              Details
            </Link>
            <button
              onClick={() => onBook(room)}
              disabled={room.status === 'Maintenance'}
              className={`btn btn-sm px-3 rounded-pill ${room.status === 'Available' ? 'btn-gold' : 'btn-navy'}`}
            >
              {room.status === 'Available' ? 'Book Now' : 'Reserve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

