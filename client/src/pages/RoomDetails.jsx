import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import BookingModal from '../components/BookingModal';
import InvoiceModal from '../components/InvoiceModal';

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [confirmedInvoice, setConfirmedInvoice] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.getRoom(id);
        if (res.success && res.room) {
          setRoom(res.room);
        }
      } catch (err) {
        console.error('Failed to load room details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading room details...</span>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container py-5 text-center">
        <h3>Room Not Found</h3>
        <p className="text-muted">The requested accommodation could not be located.</p>
        <Link to="/rooms" className="btn btn-navy rounded-pill px-4">
          Back to Rooms
        </Link>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 ? room.images : [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
  ];

  return (
    <div className="py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/rooms" className="text-decoration-none">Rooms & Suites</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{room.title}</li>
          </ol>
        </nav>

        {/* Gallery Section */}
        <div className="row g-4 mb-5">
          <div className="col-lg-8">
            <div className="position-relative rounded-4 overflow-hidden shadow-sm" style={{ height: '450px' }}>
              <img
                src={images[activeImage] || images[0]}
                alt={room.title}
                className="w-100 h-100 object-fit-cover"
              />
              <div className="position-absolute top-0 start-0 m-3 d-flex gap-2">
                <span className={`badge rounded-pill px-3 py-2 ${room.status === 'Available' ? 'badge-available' : room.status === 'Occupied' ? 'badge-occupied' : 'badge-cleaning'}`}>
                  {room.status}
                </span>
                <span className="badge bg-dark bg-opacity-75 rounded-pill px-3 py-2 text-white">
                  Room #{room.roomNumber}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="d-flex gap-2 mt-3 overflow-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`btn p-0 border-2 rounded-3 overflow-hidden ${activeImage === idx ? 'border-warning shadow' : 'border-transparent'}`}
                    style={{ width: '100px', height: '65px', flexShrink: 0 }}
                  >
                    <img src={img} alt="" className="w-100 h-100 object-fit-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Booking Summary Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 p-4 sticky-top" style={{ top: '100px' }}>
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <div>
                  <span className="display-6 font-serif fw-bold text-dark">${room.pricePerNight}</span>
                  <span className="text-muted small"> / night</span>
                </div>
                <div className="text-warning small">
                  <i className="bi bi-star-fill me-1"></i>
                  <strong>{room.rating || 4.9}</strong> ({room.reviewsCount || 24} reviews)
                </div>
              </div>

              <hr className="my-3" />

              <div className="vstack gap-2 mb-4 small text-secondary">
                <div className="d-flex justify-content-between">
                  <span>Room Type:</span>
                  <strong className="text-dark">{room.type}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Capacity:</span>
                  <strong className="text-dark">{room.capacity} Guests Max</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Bed Arrangement:</span>
                  <strong className="text-dark">{room.bedType}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Floor Level:</span>
                  <strong className="text-dark">Floor {room.floor}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Housekeeping:</span>
                  <span className="badge bg-light text-dark border">{room.cleaningStatus}</span>
                </div>
              </div>

              <button
                onClick={() => setIsBookingOpen(true)}
                disabled={room.status === 'Maintenance'}
                className="btn btn-gold btn-lg w-100 rounded-pill fw-bold shadow-sm mb-3"
              >
                <i className="bi bi-calendar-check me-2"></i> Reserve This Suite
              </button>

              <div className="text-center text-muted small">
                <i className="bi bi-shield-check text-success me-1"></i> Best Rate Guaranteed • Instant JWT Verified
              </div>
            </div>
          </div>
        </div>

        {/* Room Details & Amenities */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white mb-4">
              <h3 className="font-serif fw-bold text-dark mb-3">{room.title}</h3>
              <p className="text-secondary leading-relaxed mb-4">
                {room.description}
              </p>

              <h5 className="fw-bold font-serif text-dark mb-3">Suite Amenities & Perks</h5>
              <div className="row g-3 mb-4">
                {(room.amenities || []).map((amenity, i) => (
                  <div key={i} className="col-sm-6">
                    <div className="d-flex align-items-center gap-2 p-2 rounded bg-light">
                      <i className="bi bi-check-circle-fill text-warning"></i>
                      <span className="small fw-semibold text-dark">{amenity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h5 className="fw-bold font-serif text-dark mb-3">Hotel Policies</h5>
              <div className="row g-3 small text-muted">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Check-in:</strong> 3:00 PM – Late check-in available</p>
                  <p className="mb-1"><strong>Check-out:</strong> 11:00 AM</p>
                  <p className="mb-0"><strong>Cancellation:</strong> Free cancellation up to 48 hours prior</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Smoke-Free:</strong> 100% non-smoking property</p>
                  <p className="mb-1"><strong>Pet Policy:</strong> Service animals welcome</p>
                  <p className="mb-0"><strong>In-Room Dining:</strong> 24-hour service available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          room={room}
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          onBookingSuccess={(res) => {
            setConfirmedInvoice(res.invoice || res.booking);
          }}
        />
      )}

      {/* Invoice Modal */}
      {confirmedInvoice && (
        <InvoiceModal
          invoiceData={confirmedInvoice}
          isOpen={!!confirmedInvoice}
          onClose={() => setConfirmedInvoice(null)}
        />
      )}
    </div>
  );
}

