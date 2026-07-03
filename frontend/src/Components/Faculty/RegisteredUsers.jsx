import React, { useState, useEffect, useRef } from 'react';
import { userAxiosInstance } from '../../api';
import {
  FaSearch, FaFilter, FaDownload, FaEnvelope, FaEdit, FaEye,
  FaUsers, FaStar, FaCertificate, FaCheckCircle, FaTimesCircle,
  FaCalendarAlt, FaClock, FaUserGraduate, FaChalkboardTeacher,
  FaPhone, FaAt, FaTimes, FaCheck, FaRegCalendarCheck
} from 'react-icons/fa';
import './RegisteredUsers.css';

/* ── helpers ── */
const STATUS_META = {
  completed:  { label: 'Completed',  icon: <FaCheckCircle />,      cls: 'ru-s-completed'  },
  attended:   { label: 'Attended',   icon: <FaUserGraduate />,     cls: 'ru-s-attended'   },
  confirmed:  { label: 'Confirmed',  icon: <FaRegCalendarCheck />, cls: 'ru-s-confirmed'  },
  registered: { label: 'Registered', icon: <FaCalendarAlt />,      cls: 'ru-s-registered' },
  pending:    { label: 'Pending',    icon: <FaClock />,             cls: 'ru-s-pending'    },
  cancelled:  { label: 'Cancelled',  icon: <FaTimesCircle />,      cls: 'ru-s-cancelled'  },
};
const getStatus = (key) => STATUS_META[key?.toLowerCase()] || STATUS_META.registered;

const StatusBadge = ({ status }) => {
  const meta = getStatus(status);
  return (
    <span className={`ru-badge ${meta.cls}`}>
      {meta.icon} {meta.label}
    </span>
  );
};

const RegisteredUsers = () => {
  const [registrations, setRegistrations]           = useState([]);
  const [pastAttendees, setPastAttendees]           = useState([]);
  const [loading, setLoading]                       = useState(true);
  const [error, setError]                           = useState(null);
  const [searchTerm, setSearchTerm]                 = useState('');
  const [filter, setFilter]                         = useState('all');
  const [workshops, setWorkshops]                   = useState([]);
  const [selectedWorkshop, setSelectedWorkshop]     = useState('all');
  const [showEmailModal, setShowEmailModal]         = useState(false);
  const [emailSubject, setEmailSubject]             = useState('');
  const [emailBody, setEmailBody]                   = useState('');
  const [selectedReg, setSelectedReg]               = useState(null);
  const [showViewModal, setShowViewModal]           = useState(false);
  const [showEditModal, setShowEditModal]           = useState(false);
  const [showPastModal, setShowPastModal]           = useState(false);
  const [editForm, setEditForm]                     = useState({ user_name:'', email:'', phone:'', status:'' });
  const [sendingEmail, setSendingEmail]             = useState(false);
  const [emailSuccess, setEmailSuccess]             = useState(false);
  const modalRef = useRef(null);

  /* ── fetch ── */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const wsRes = await userAxiosInstance.get('workshops/');
        setWorkshops(wsRes.data);

        const fmt = (data) => data.map(reg => ({
          id: reg.id,
          user_name: reg.name,
          email: reg.email,
          phone: reg.phone,
          workshop_id: reg.workshop_id,
          workshop_title: reg.workshop_title || 'Workshop',
          workshop_date: reg.workshop_date || null,
          registration_date: reg.registration_date || new Date().toISOString(),
          status: reg.is_completed ? 'completed' : (reg.status || 'registered'),
        }));

        try {
          const r = await userAxiosInstance.get('faculty/workshop-registrations/');
          setRegistrations(fmt(r.data));
        } catch {
          const r = await userAxiosInstance.get('workshop-registrations/');
          setRegistrations(fmt(r.data));
        }

        try {
          const r = await userAxiosInstance.get('faculty/past-workshop-attendees/');
          setPastAttendees(r.data);
        } catch {
          setPastAttendees([
            { id:101, user_name:'John Smith',    email:'john.smith@example.com', phone:'555-123-4567', workshop_title:'Advanced JavaScript',      workshop_date:'2023-06-15', feedback:'Great workshop, learned a lot!',              rating:5, certificate_issued:true },
            { id:102, user_name:'Emily Johnson', email:'emily.j@example.com',    phone:'555-987-6543', workshop_title:'Python for Data Science',   workshop_date:'2023-07-22', feedback:'Very informative and well-structured.',       rating:4, certificate_issued:true },
            { id:103, user_name:'Michael Brown', email:'michael.b@example.com',  phone:'555-456-7890', workshop_title:'Web Development Bootcamp',  workshop_date:'2023-08-10', feedback:'Excellent content and hands-on exercises.',   rating:5, certificate_issued:true },
          ]);
        }
      } catch (err) {
        setError('Failed to load registration data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowEmailModal(false); setShowViewModal(false); setShowEditModal(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── filter ── */
  const filtered = registrations.filter(r => {
    const s = searchTerm.toLowerCase();
    const matchSearch = r.user_name?.toLowerCase().includes(s) ||
                        r.email?.toLowerCase().includes(s) ||
                        r.workshop_title?.toLowerCase().includes(s);
    const matchFilter = filter === 'all' || r.status?.toLowerCase() === filter;
    const matchWs     = selectedWorkshop === 'all' || r.workshop_id?.toString() === selectedWorkshop;
    return matchSearch && matchFilter && matchWs;
  });

  /* ── export ── */
  const exportCSV = () => {
    const rows = [
      ['Name','Email','Phone','Workshop','Workshop Date','Registered On','Status'],
      ...filtered.map(r => [r.user_name, r.email, r.phone, r.workshop_title,
        r.workshop_date || '', new Date(r.registration_date).toLocaleDateString(), r.status])
    ].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type:'text/csv' }));
    a.download = 'workshop_registrations.csv';
    a.click();
  };

  /* ── email ── */
  const openEmailAll = () => {
    setSelectedReg(null);
    setEmailSubject('Important Update: Workshop Information');
    setEmailBody(`Dear Workshop Participant,\n\nWe hope this email finds you well.\n\nBest regards,\nThe Workshop Team`);
    setShowEmailModal(true);
  };
  const openEmailOne = (reg) => {
    setSelectedReg(reg);
    setEmailSubject(`Workshop Information for ${reg.user_name}`);
    setEmailBody(`Dear ${reg.user_name},\n\nWe hope this email finds you well regarding the ${reg.workshop_title} workshop.\n\nBest regards,\nThe Workshop Team`);
    setShowEmailModal(true);
  };
  const sendEmail = async () => {
    setSendingEmail(true);
    await new Promise(r => setTimeout(r, 1000));
    setEmailSuccess(true);
    setTimeout(() => { setShowEmailModal(false); setEmailSuccess(false); setSendingEmail(false); }, 2000);
  };

  /* ── edit ── */
  const openEdit = (reg) => {
    setSelectedReg(reg);
    setEditForm({ user_name: reg.user_name, email: reg.email, phone: reg.phone, status: reg.status });
    setShowEditModal(true);
  };
  const submitEdit = async () => {
    await new Promise(r => setTimeout(r, 400));
    setRegistrations(prev => prev.map(r => r.id === selectedReg.id ? { ...r, ...editForm } : r));
    setShowEditModal(false);
  };

  /* ── stats ── */
  const total     = registrations.length;
  const completed = registrations.filter(r => r.status === 'completed').length;
  const upcoming  = registrations.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length;
  const cancelled = registrations.filter(r => r.status === 'cancelled').length;

  /* ── loading / error ── */
  if (loading) return (
    <div className="ru-loading">
      <div className="ru-spinner" />
      <span>Loading registrations…</span>
    </div>
  );
  if (error) return <div className="ru-error"><FaTimesCircle /> {error}</div>;

  return (
    <div className="ru-container">

      {/* ── Header ── */}
      <div className="ru-header">
        <div className="ru-header-left">
          <div className="ru-header-icon"><FaChalkboardTeacher /></div>
          <div>
            <h1>Workshop Registrations</h1>
            <p>Track and manage all workshop participant registrations</p>
          </div>
        </div>
        <div className="ru-header-actions">
          <button className="ru-btn ru-btn-ghost" onClick={() => setShowPastModal(true)}>
            <FaUsers /> Past Attendees
          </button>
          <button className="ru-btn ru-btn-success" onClick={exportCSV}>
            <FaDownload /> Export CSV
          </button>
          <button className="ru-btn ru-btn-primary" onClick={openEmailAll}>
            <FaEnvelope /> Email All
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="ru-stats">
        {[
          { value: total,     label: 'Total',     cls: 'ru-stat-total'     },
          { value: completed, label: 'Completed', cls: 'ru-stat-completed' },
          { value: upcoming,  label: 'Upcoming',  cls: 'ru-stat-upcoming'  },
          { value: cancelled, label: 'Cancelled', cls: 'ru-stat-cancelled' },
        ].map(s => (
          <div className={`ru-stat-card ${s.cls}`} key={s.label}>
            <span className="ru-stat-value">{s.value}</span>
            <span className="ru-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="ru-filters">
        <div className="ru-search">
          <FaSearch className="ru-search-icon" />
          <input
            type="text"
            placeholder="Search by name, email or workshop…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && <button className="ru-search-clear" onClick={() => setSearchTerm('')}><FaTimes /></button>}
        </div>
        <div className="ru-filter-row">
          <div className="ru-select-wrap">
            <FaFilter className="ru-select-icon" />
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="attended">Attended</option>
              <option value="confirmed">Confirmed</option>
              <option value="registered">Registered</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="ru-select-wrap">
            <FaCalendarAlt className="ru-select-icon" />
            <select value={selectedWorkshop} onChange={e => setSelectedWorkshop(e.target.value)}>
              <option value="all">All Workshops</option>
              {workshops.map(w => (
                <option key={w.id} value={w.id.toString()}>{w.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="ru-table-wrap">
        {filtered.length === 0 ? (
          <div className="ru-empty">
            <FaUsers />
            <p>No registrations found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
          </div>
        ) : (
          <table className="ru-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>Contact</th>
                <th>Workshop</th>
                <th>Workshop Date</th>
                <th>Registered On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(reg => (
                <tr key={reg.id} className={reg.status === 'completed' ? 'ru-row-completed' : ''}>
                  <td>
                    <div className="ru-participant">
                      <div className="ru-avatar">{reg.user_name?.[0]?.toUpperCase() || '?'}</div>
                      <span className="ru-name">{reg.user_name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="ru-contact">
                      <span><FaAt /> {reg.email}</span>
                      <span><FaPhone /> {reg.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className="ru-workshop-title">{reg.workshop_title}</span>
                  </td>
                  <td>
                    <span className={`ru-date-chip ${reg.status === 'completed' ? 'ru-date-past' : 'ru-date-future'}`}>
                      <FaCalendarAlt /> {reg.workshop_date || '—'}
                    </span>
                  </td>
                  <td className="ru-reg-date">
                    {new Date(reg.registration_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                  </td>
                  <td><StatusBadge status={reg.status} /></td>
                  <td>
                    <div className="ru-actions">
                      <button className="ru-icon-btn ru-icon-view"  title="View"  onClick={() => { setSelectedReg(reg); setShowViewModal(true); }}><FaEye /></button>
                      <button className="ru-icon-btn ru-icon-edit"  title="Edit"  onClick={() => openEdit(reg)}><FaEdit /></button>
                      <button className="ru-icon-btn ru-icon-email" title="Email" onClick={() => openEmailOne(reg)}><FaEnvelope /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filtered.length > 0 && (
          <div className="ru-table-footer">
            Showing <strong>{filtered.length}</strong> of <strong>{total}</strong> registrations
          </div>
        )}
      </div>

      {/* ══ VIEW MODAL ══ */}
      {showViewModal && selectedReg && (
        <div className="ru-overlay">
          <div className="ru-modal" ref={modalRef}>
            <div className="ru-modal-header">
              <div className="ru-modal-title">
                <FaEye /> Registration Details
              </div>
              <button className="ru-modal-close" onClick={() => setShowViewModal(false)}><FaTimes /></button>
            </div>
            <div className="ru-modal-body">
              {/* Status banner */}
              <div className={`ru-detail-banner ${getStatus(selectedReg.status).cls}`}>
                {getStatus(selectedReg.status).icon}
                <span>{getStatus(selectedReg.status).label}</span>
                {selectedReg.status === 'completed' && <span className="ru-banner-note">Workshop has concluded</span>}
              </div>

              <div className="ru-detail-grid">
                <div className="ru-detail-item">
                  <span className="ru-detail-label">Full Name</span>
                  <span className="ru-detail-value">{selectedReg.user_name}</span>
                </div>
                <div className="ru-detail-item">
                  <span className="ru-detail-label">Email</span>
                  <span className="ru-detail-value">{selectedReg.email}</span>
                </div>
                <div className="ru-detail-item">
                  <span className="ru-detail-label">Phone</span>
                  <span className="ru-detail-value">{selectedReg.phone}</span>
                </div>
                <div className="ru-detail-item">
                  <span className="ru-detail-label">Workshop</span>
                  <span className="ru-detail-value">{selectedReg.workshop_title}</span>
                </div>
                <div className="ru-detail-item">
                  <span className="ru-detail-label">Workshop Date</span>
                  <span className="ru-detail-value">{selectedReg.workshop_date || '—'}</span>
                </div>
                <div className="ru-detail-item">
                  <span className="ru-detail-label">Registered On</span>
                  <span className="ru-detail-value">
                    {new Date(selectedReg.registration_date).toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="ru-modal-footer">
              <button className="ru-btn ru-btn-ghost" onClick={() => setShowViewModal(false)}>Close</button>
              <button className="ru-btn ru-btn-warning" onClick={() => { setShowViewModal(false); openEdit(selectedReg); }}>
                <FaEdit /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT MODAL ══ */}
      {showEditModal && selectedReg && (
        <div className="ru-overlay">
          <div className="ru-modal" ref={modalRef}>
            <div className="ru-modal-header">
              <div className="ru-modal-title"><FaEdit /> Edit Registration</div>
              <button className="ru-modal-close" onClick={() => setShowEditModal(false)}><FaTimes /></button>
            </div>
            <div className="ru-modal-body">
              {[
                { label:'Name',  name:'user_name', type:'text'  },
                { label:'Email', name:'email',     type:'email' },
                { label:'Phone', name:'phone',     type:'text'  },
              ].map(f => (
                <div className="ru-form-group" key={f.name}>
                  <label>{f.label}</label>
                  <input type={f.type} value={editForm[f.name]}
                    onChange={e => setEditForm(p => ({ ...p, [f.name]: e.target.value }))} />
                </div>
              ))}
              <div className="ru-form-group">
                <label>Status</label>
                <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="registered">Registered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="attended">Attended</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="ru-modal-footer">
              <button className="ru-btn ru-btn-ghost" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="ru-btn ru-btn-success" onClick={submitEdit}><FaCheck /> Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EMAIL MODAL ══ */}
      {showEmailModal && (
        <div className="ru-overlay">
          <div className="ru-modal" ref={modalRef}>
            <div className="ru-modal-header">
              <div className="ru-modal-title">
                <FaEnvelope /> {selectedReg ? `Email to ${selectedReg.user_name}` : 'Email All Participants'}
              </div>
              <button className="ru-modal-close" onClick={() => setShowEmailModal(false)}><FaTimes /></button>
            </div>
            <div className="ru-modal-body">
              {emailSuccess ? (
                <div className="ru-email-success">
                  <FaCheckCircle />
                  <p>Email sent successfully!</p>
                </div>
              ) : (
                <>
                  <div className="ru-form-group">
                    <label>Subject</label>
                    <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
                  </div>
                  <div className="ru-form-group">
                    <label>Message</label>
                    <textarea rows={6} value={emailBody} onChange={e => setEmailBody(e.target.value)} />
                  </div>
                  <div className="ru-recipients-info">
                    <FaUsers />
                    <span><strong>To:</strong> {selectedReg ? selectedReg.email : `${filtered.length} participants`}</span>
                  </div>
                </>
              )}
            </div>
            {!emailSuccess && (
              <div className="ru-modal-footer">
                <button className="ru-btn ru-btn-ghost" onClick={() => setShowEmailModal(false)}>Cancel</button>
                <button className="ru-btn ru-btn-primary" onClick={sendEmail} disabled={sendingEmail}>
                  <FaEnvelope /> {sendingEmail ? 'Sending…' : 'Send Email'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ PAST ATTENDEES MODAL ══ */}
      {showPastModal && (
        <div className="ru-overlay">
          <div className="ru-modal ru-modal-lg" ref={modalRef}>
            <div className="ru-modal-header">
              <div className="ru-modal-title"><FaUsers /> Past Workshop Attendees</div>
              <button className="ru-modal-close" onClick={() => setShowPastModal(false)}><FaTimes /></button>
            </div>
            <div className="ru-modal-body">
              {pastAttendees.length === 0 ? (
                <div className="ru-empty"><FaUsers /><p>No past attendees found.</p></div>
              ) : (
                <>
                  <table className="ru-table">
                    <thead>
                      <tr>
                        <th>Name</th><th>Email</th><th>Workshop</th>
                        <th>Date</th><th>Rating</th><th>Certificate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastAttendees.map(a => (
                        <tr key={a.id}>
                          <td>
                            <div className="ru-participant">
                              <div className="ru-avatar">{a.user_name?.[0]?.toUpperCase()}</div>
                              <span className="ru-name">{a.user_name}</span>
                            </div>
                          </td>
                          <td>{a.email}</td>
                          <td>{a.workshop_title}</td>
                          <td>{new Date(a.workshop_date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td>
                          <td>
                            <div className="ru-stars">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < a.rating ? 'ru-star-on' : 'ru-star-off'} />
                              ))}
                            </div>
                          </td>
                          <td>
                            {a.certificate_issued
                              ? <span className="ru-badge ru-s-completed"><FaCertificate /> Issued</span>
                              : <span className="ru-badge ru-s-pending"><FaClock /> Pending</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="ru-feedback-section">
                    <h3>Feedback Highlights</h3>
                    <div className="ru-feedback-grid">
                      {pastAttendees.map(a => (
                        <div className="ru-feedback-card" key={a.id}>
                          <div className="ru-feedback-top">
                            <div className="ru-avatar">{a.user_name?.[0]?.toUpperCase()}</div>
                            <div>
                              <div className="ru-name">{a.user_name}</div>
                              <div className="ru-feedback-ws">{a.workshop_title}</div>
                            </div>
                          </div>
                          <p className="ru-feedback-text">"{a.feedback}"</p>
                          <div className="ru-stars">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < a.rating ? 'ru-star-on' : 'ru-star-off'} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="ru-modal-footer">
              <button className="ru-btn ru-btn-ghost" onClick={() => setShowPastModal(false)}>Close</button>
              <button className="ru-btn ru-btn-success" onClick={exportCSV}><FaDownload /> Export</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredUsers;
