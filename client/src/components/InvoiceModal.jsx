import React from 'react';

export default function InvoiceModal({ invoiceData, isOpen, onClose }) {
  if (!isOpen || !invoiceData) return null;

  const handlePrint = () => {
    window.print();
  };

  const booking = invoiceData.booking || invoiceData;
  const breakdown = invoiceData.breakdown || invoiceData.payment?.breakdown || {
    roomCharges: booking.totalAmount ? Math.round(booking.totalAmount * 0.85) : 0,
    taxes: booking.totalAmount ? Math.round(booking.totalAmount * 0.12) : 0,
    serviceFee: 25,
    total: booking.totalAmount || 0
  };

  const roomTitle = booking.room?.title || invoiceData.room || 'Deluxe Suite';
  const roomNumber = booking.room?.roomNumber || invoiceData.roomNumber || '101';
  const guestName = booking.guestName || invoiceData.guestName;
  const guestEmail = booking.guestEmail || invoiceData.guestEmail;
  const bookingCode = booking.bookingCode || invoiceData.bookingCode;
  const invoiceNumber = invoiceData.invoiceNumber || `INV-2026-${bookingCode?.replace(/\D/g, '') || '001'}`;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(11, 19, 43, 0.75)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-dark text-white p-3 no-print">
            <h5 className="modal-title font-serif fw-bold">
              <i className="bi bi-receipt-cutoff me-2 text-warning"></i> Digital Tax Invoice
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 p-md-5 printable-invoice">
            {/* Invoice Header */}
            <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
              <div>
                <h3 className="font-serif fw-bold text-dark mb-1">
                  Hotel<span style={{ color: '#c5a059' }}>Pro</span>
                </h3>
                <p className="text-muted small mb-0">500 Grand Coastal Parkway, Suite 100</p>
                <p className="text-muted small mb-0">reservations@hotelpro.com • +1 (800) 555-HOTELPRO</p>
                <p className="text-muted small">GSTIN/Tax ID: HP-US-8899201</p>
              </div>
              <div className="text-end">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 fs-6 fw-bold">
                  {booking.paymentStatus === 'Paid' ? 'PAID IN FULL' : 'PAYMENT PENDING'}
                </span>
                <h5 className="fw-bold mt-2 mb-0 font-monospace text-dark">{invoiceNumber}</h5>
                <small className="text-muted">
                  Issued: {new Date(invoiceData.date || Date.now()).toLocaleDateString()}
                </small>
              </div>
            </div>

            {/* Bill To & Booking Meta */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6">
                <h6 className="text-uppercase text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>
                  Guest Information
                </h6>
                <p className="fw-bold text-dark mb-1 fs-6">{guestName}</p>
                <p className="text-muted small mb-0">{guestEmail}</p>
                {booking.guestPhone && <p className="text-muted small mb-0">{booking.guestPhone}</p>}
              </div>

              <div className="col-sm-6 text-sm-end">
                <h6 className="text-uppercase text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>
                  Reservation Details
                </h6>
                <p className="mb-1 small">
                  <strong>Booking Reference:</strong> <span className="font-monospace text-primary">{bookingCode}</span>
                </p>
                <p className="mb-1 small">
                  <strong>Check-in:</strong> {booking.checkInDate}
                </p>
                <p className="mb-1 small">
                  <strong>Check-out:</strong> {booking.checkOutDate}
                </p>
                <p className="mb-0 small text-muted">
                  <strong>Duration:</strong> {booking.nights || 1} Night(s)
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr className="small text-uppercase">
                    <th>Description</th>
                    <th className="text-center">Room #</th>
                    <th className="text-center">Nights</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{roomTitle}</strong>
                      <div className="small text-muted">Luxury Hospitality Accommodation</div>
                    </td>
                    <td className="text-center font-monospace">{roomNumber}</td>
                    <td className="text-center">{booking.nights || 1}</td>
                    <td className="text-end fw-semibold">${breakdown.roomCharges || breakdown.total}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end text-muted small">
                      Hospitality Tax & GST (12%)
                    </td>
                    <td className="text-end small">${breakdown.taxes || 0}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end text-muted small">
                      Service & City Tourism Surcharge
                    </td>
                    <td className="text-end small">${breakdown.serviceFee || 0}</td>
                  </tr>
                  <tr className="table-light">
                    <td colSpan="3" className="text-end fw-bold fs-6">
                      Total Invoice Amount (USD)
                    </td>
                    <td className="text-end fw-bold fs-5 text-dark font-serif">
                      ${breakdown.total || booking.totalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer notice */}
            <div className="p-3 bg-light rounded text-muted small">
              <p className="mb-1">
                <strong>Payment Method:</strong> {booking.paymentMethod || 'Credit Card'} •
                <strong> Status:</strong> {booking.paymentStatus || 'Paid'}
              </p>
              <p className="mb-0 text-secondary" style={{ fontSize: '0.75rem' }}>
                Thank you for choosing HotelPro. Check-in time begins at 3:00 PM; check-out is by 11:00 AM.
                For any inquiries regarding this statement, please contact our 24/7 guest service desk.
              </p>
            </div>
          </div>

          <div className="modal-footer bg-light p-3 no-print">
            <button type="button" className="btn btn-outline-secondary px-3 rounded-pill" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-navy px-4 rounded-pill" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i> Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

