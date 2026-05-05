import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Mail, MapPin, Plus, Download, Check, X, Search, User, BookOpen, Settings, LogOut, UserPlus, LogIn, Trash2, Edit, Save, Book, PlusCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// API Configuration
const API_BASE_URL = '/api';

const App = () => {
  const [view, setView] = useState('student'); // 'student', 'faculty-login', 'faculty-register', 'faculty-dashboard'
  const [currentView, setCurrentView] = useState('empty');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('course');
  const [searchResults, setSearchResults] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [loggedInFaculty, setLoggedInFaculty] = useState(null);
  const [facultyRequests, setFacultyRequests] = useState([]);
  const [facultyDashView, setFacultyDashView] = useState('info'); // 'info', 'requests', 'courses', 'hours'
  const [loading, setLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState(null); // Simple student login session

  // Filter state for Requirement 1
  const [filterDay, setFilterDay] = useState('');
  const [filterTime, setFilterTime] = useState('');

  // Track Requests state for Requirement 3
  const [trackEmail, setTrackEmail] = useState('');
  const [trackedRequests, setTrackedRequests] = useState([]);
  const [trackLoading, setTrackLoading] = useState(false);

  // New State for Faculty Management
  const [coursesList, setCoursesList] = useState([]);
  const [myConsultations, setMyConsultations] = useState([]);

  // Load routine from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('studentRoutine');
    if (stored) {
      setRoutine(JSON.parse(stored));
    }
    const storedStudent = localStorage.getItem('studentEmail');
    if (storedStudent) {
      setStudentEmail(storedStudent);
      setTrackEmail(storedStudent);
    }
    // Set light mode body background - Monochrome Redesign
    document.body.className = 'bg-gray-50 text-black';
  }, []);

  // Save routine to localStorage
  useEffect(() => {
    localStorage.setItem('studentRoutine', JSON.stringify(routine));
  }, [routine]);

  // Fetch faculty data when logged in
  useEffect(() => {
    if (loggedInFaculty) {
      fetchFacultyRequests();
      fetchMyConsultations();
    }
  }, [loggedInFaculty]);

  // Load all courses for dropdowns
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // ============= API CALLS =============
  const searchByCourse = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search/course.php?course_name=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.data || []);
      setCurrentView('search');
    } catch (error) {
      alert('Search failed: ' + error.message);
    }
    setLoading(false);
  };

  const searchByFaculty = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search/faculty.php?faculty_name=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.data || []);
      setCurrentView('search');
    } catch (error) {
      alert('Search failed: ' + error.message);
    }
    setLoading(false);
  };

  const searchByDepartment = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search/department.php?dept_name=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.data || []);
      setCurrentView('search');
    } catch (error) {
      alert('Search failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (searchType === 'course') {
      searchByCourse();
    } else if (searchType === 'department') {
      searchByDepartment();
    } else {
      searchByFaculty();
    }
  };

  // Track student request status (Requirement 3 Feature 4)
  const trackStudentRequests = async () => {
    const emailToTrack = studentEmail || trackEmail;
    if (!emailToTrack) { alert('Please sign in first'); return; }
    setTrackLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests/student.php?email=${encodeURIComponent(emailToTrack)}`);
      const data = await response.json();
      setTrackedRequests(data.data || []);
    } catch (error) {
      alert('Failed to fetch requests: ' + error.message);
    }
    setTrackLoading(false);
  };

  const fetchAllCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/list.php`);
      const data = await response.json();
      setCoursesList(data.data || []);
    } catch (error) {
      console.error('Failed to load courses', error);
    }
  };

  const createCourse = async (courseData) => {
    setLoading(true);
    try {
      // Map frontend keys to backend expected keys
      const payload = {
        course_code: courseData.code,
        course_name: courseData.name,
        department: courseData.department
      };

      const response = await fetch(`${API_BASE_URL}/courses/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Course created successfully!');
        fetchAllCourses();
      } else {
        alert(data.message || 'Failed to create course');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  // ... (rest of functions)

  // ...

  /* REPLACED RoutineGrid WITH PdfPrintView IN UI */

  // ...

  // ============= UI COMPONENTS =============

  // 1. Interactive Screen View (Beautiful, Scrollable, Interactive)
  const ScreenRoutineView = ({ routine, formatTime, onRemove }) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const hours = Array.from({ length: 12 }, (_, i) => i + 8);

    return (
      <div className="bg-white rounded-xl shadow-xl shadow-black/5 border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase w-24 sticky left-0 bg-gray-50 z-10 text-center">Time</th>
                {days.map(day => (
                  <th key={day} className="p-4 text-xs font-bold text-gray-500 uppercase min-w-[140px] border-l border-gray-100">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour, idx) => {
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour > 12 ? hour - 12 : hour;
                const timeLabel = `${displayHour}:00 ${period}`;
                const isEven = idx % 2 === 0;

                return (
                  <tr key={hour} className={`border-b border-gray-100 ${isEven ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-3 text-xs font-bold text-gray-400 text-center sticky left-0 bg-inherit z-10 border-r border-gray-100">
                      {timeLabel}
                    </td>
                    {days.map(day => {
                      const item = routine.find(r => {
                        const itemHour = parseInt(r.startTime.split(':')[0]);
                        return r.day === day && itemHour === hour;
                      });

                      return (
                        <td key={`${day}-${hour}`} className="p-1 h-28 align-top border-l border-gray-100 relative group transition-colors hover:bg-gray-50">
                          {item && (
                            <div
                              className="w-full h-full rounded-lg p-2.5 shadow-sm border-l-4 transition-all hover:shadow-md flex flex-col justify-between relative"
                              style={{
                                backgroundColor: '#f9fafb', // gray-50
                                borderColor: '#000000'
                              }}
                            >
                              <div>
                                <div className="font-bold text-black text-sm leading-tight">{item.courseName}</div>
                                <div className="text-xs text-gray-600 mt-1 font-medium">{item.facultyName}</div>
                                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-500">
                                  <MapPin size={10} strokeWidth={2.5} />
                                  <span>{item.location}</span>
                                </div>
                                {item.desk_no && (
                                  <div className="text-[10px] text-gray-400 mt-0.5 ml-0.5">Desk: {item.desk_no}</div>
                                )}
                              </div>

                              <button
                                onClick={() => onRemove(item.id)}
                                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white text-black rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white hover:scale-110 border border-gray-100"
                                title="Remove class"
                              >
                                <X size={14} strokeWidth={2.5} />
                              </button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 2. High-Res Print Template (Static, Optimized for A4 PDF)
  const PrintRoutineTemplate = ({ routine, formatTime }) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Dynamic Hours Calculation
    const routineHours = routine.map(r => parseInt(r.start_time || r.startTime));
    const minHour = routineHours.length > 0 ? Math.min(...routineHours, 8) : 8;
    const maxHour = routineHours.length > 0 ? Math.max(...routineHours.map(h => parseInt(h) + 1), 17) : 17; // Ensure at least till 5pm

    const displayStart = Math.max(8, minHour); // Earliest start 8am (or earlier if needed, but keeping 8am as anchor)
    const displayEnd = maxHour;

    const hours = Array.from({ length: displayEnd - displayStart + 1 }, (_, i) => i + displayStart);

    return (
      <div id="print-routine-template" className="bg-white p-8 fixed -left-[3000px]" style={{ width: '1600px', minHeight: '1131px' }}>
        <div className="flex justify-between items-end mb-8 border-b-8 border-black pb-4">
          <div>
            <h1 className="text-6xl font-black text-black mb-2 uppercase tracking-tighter">Consultation Routine</h1>
            <p className="text-3xl text-gray-500 font-light">BRAC University Faculty Consultation Management</p>
          </div>
          <div className="text-right">
            <p className="font-black text-black text-2xl uppercase tracking-widest">Generated On</p>
            <p className="text-gray-600 text-3xl font-mono">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* High-Res Table */}
        <div className="border-8 border-black">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-black text-white">
                <th className="p-6 border-b-8 border-r-8 border-black text-2xl font-black uppercase w-40 tracking-widest">Time</th>
                {days.map((day, idx) => (
                  <th key={day} className={`p-6 border-b-8 border-black text-2xl font-black uppercase tracking-widest ${idx !== days.length - 1 ? 'border-r-8' : ''}`}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour, idx) => {
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour > 12 ? hour - 12 : hour;
                const timeLabel = `${displayHour}:00 ${period}`;
                const isLastRow = idx === hours.length - 1;

                return (
                  <tr key={hour}>
                    <td className={`p-4 border-r-8 border-black text-2xl font-black text-center bg-gray-50 text-black ${!isLastRow ? 'border-b-4' : ''}`}>
                      {timeLabel}
                    </td>
                    {days.map((day, dIdx) => {
                      const item = routine.find(r => {
                        const itemHour = parseInt(r.startTime.split(':')[0]);
                        return r.day === day && itemHour === hour;
                      });

                      return (
                        <td key={`${day}-${hour}`} className={`p-1 align-top relative ${!isLastRow ? 'border-b-4 border-gray-100' : ''} ${dIdx !== days.length - 1 ? 'border-r-8 border-black' : ''}`}>
                          {item && (
                            <div className="w-full h-full p-4 flex flex-col justify-start border-l-[12px] border-black bg-gray-50">
                              <div className="text-3xl font-black text-black leading-tight mb-2 whitespace-normal break-words">{item.courseName}</div>
                              <div className="text-xl font-bold text-gray-800 leading-snug mb-2 whitespace-normal break-words">
                                {item.facultyName} {item.initial ? `(${item.initial})` : ''}
                              </div>
                              <div className="text-lg font-medium text-gray-600 mt-2 flex flex-col gap-1 whitespace-normal break-words">
                                <span>📍 {item.location}</span>
                                {item.desk_no && <span className="text-gray-500">🖥 Desk: {item.desk_no}</span>}
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center border-t-4 border-black pt-8">
          <p className="text-gray-400 text-2xl font-bold tracking-widest uppercase">Generated by Faculty Scheduler • {new Date().getFullYear()}</p>
        </div>
      </div>
    );
  };

  const fetchMyConsultations = async () => {
    if (!loggedInFaculty) return;
    try {
      const response = await fetch(`${API_BASE_URL}/consultations/faculty.php?faculty_id=${loggedInFaculty.id}`);
      const data = await response.json();
      setMyConsultations(data.data || []);
    } catch (error) {
      console.error('Failed to load consultations', error);
    }
  };

  const addConsultationSlot = async (slotData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/consultations/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slotData, faculty_id: loggedInFaculty.id })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Consultation slot added!');
        fetchMyConsultations();
      } else {
        alert(data.message || 'Failed to add slot');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const deleteConsultationSlot = async (consultationId) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/consultations/delete.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultation_id: consultationId, faculty_id: loggedInFaculty.id })
      });
      if (response.ok) {
        fetchMyConsultations();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const updateConsultationSlot = async (slot) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/consultations/update.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slot, faculty_id: loggedInFaculty.id, consultation_id: slot.id })
      });
      if (response.ok) {
        fetchMyConsultations();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update slot');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const submitConsultationRequest = async (facultyId, consultationId, studentName, studentEmail, message) => {
    if (!studentName || !studentEmail || !message) {
      alert('Please fill in all fields (Name, Email, Message)');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faculty_id: facultyId,
          consultation_id: consultationId,
          student_name: studentName,
          student_email: studentEmail,
          message: message
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Consultation request sent successfully!');
      } else {
        alert(data.message || 'Failed to submit request');
      }
    } catch (error) {
      alert('Request failed: ' + error.message);
    }
    setLoading(false);
  };

  const facultyLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/faculty/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setLoggedInFaculty(data.faculty);
        setView('faculty-dashboard');
        setFacultyDashView('info');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
    setLoading(false);
  };

  const facultyRegister = async (name, email, password, department, initial) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/faculty/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, department, initial })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please login.');
        setView('faculty-login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
    setLoading(false);
  };

  const updateFacultyInfo = async (facultyId, name, department, initial, deskNo) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/faculty/update.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faculty_id: facultyId, name, department, initial, desk_no: deskNo })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Information updated successfully!');
        setLoggedInFaculty({ ...loggedInFaculty, name, department, initial, desk_no: deskNo });
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (error) {
      alert('Update failed: ' + error.message);
    }
    setLoading(false);
  };

  const fetchFacultyRequests = async () => {
    if (!loggedInFaculty) return;
    try {
      const response = await fetch(`${API_BASE_URL}/requests/faculty.php?faculty_id=${loggedInFaculty.id}`);
      const data = await response.json();
      setFacultyRequests(data.data || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const approveRequest = async (requestId) => {
    const responseMessage = window.prompt('Optional: Enter a response message for the student (leave blank to skip):');
    if (responseMessage === null) return; // user cancelled
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests/approve.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, response_message: responseMessage })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Request approved! Email sent to student.');
        fetchFacultyRequests();
      } else {
        alert(data.message || 'Approval failed');
      }
    } catch (error) {
      alert('Approval failed: ' + error.message);
    }
    setLoading(false);
  };

  const declineRequest = async (requestId) => {
    const responseMessage = window.prompt('Optional: Enter a response message for the student (leave blank to skip):');
    if (responseMessage === null) return; // user cancelled
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests/decline.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, response_message: responseMessage })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Request declined. Email sent to student.');
        fetchFacultyRequests();
      } else {
        alert(data.message || 'Decline failed');
      }
    } catch (error) {
      alert('Decline failed: ' + error.message);
    }
    setLoading(false);
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const deleteFacultyAccount = async () => {
    if (!loggedInFaculty) return;
    if (!window.confirm("ARE YOU SURE? This will permanently delete your account, courses, and consultaton hours. This action cannot be undone.")) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/faculty/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faculty_id: loggedInFaculty.id })
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInFaculty(null);
        setView('student');
        alert("Account deleted successfully.");
      } else {
        alert(data.message || "Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  // ============= ROUTINE MANAGEMENT =============
  /* ROUTINE_MGMT_PLACEHOLDER */
  const addToRoutine = (consultation, faculty) => {
    const newItem = {
      id: `ROUTINE${Date.now()}`,
      consultationId: consultation.id,
      facultyName: faculty.name,
      courseName: consultation.course,
      day: consultation.day,
      startTime: consultation.start_time,
      endTime: consultation.end_time,
      location: consultation.location,
      desk_no: faculty.desk_no,
      color: getColorForCourse(consultation.course)
    };

    const hasConflict = routine.some(item => {
      if (item.day !== newItem.day) return false;
      const existingStart = parseTime(item.startTime);
      const existingEnd = parseTime(item.endTime);
      const newStart = parseTime(newItem.startTime);
      const newEnd = parseTime(newItem.endTime);
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasConflict) {
      alert('Time conflict detected! This slot overlaps with an existing consultation.');
      return;
    }

    setRoutine([...routine, newItem]);
    // REMOVED: setCurrentView('routine'); // User requested to stay on search page
  };

  const removeFromRoutine = (itemId) => {
    setRoutine(routine.filter(item => item.id !== itemId));
  };

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);

    // Allow React to render the hidden view first
    setTimeout(async () => {
      const element = document.getElementById('print-routine-template');
      if (!element) {
        alert("PDF Generation Error: Template not found");
        setIsGeneratingPDF(false);
        return;
      }

      try {
        // Create a focused capture of the element
        // We temporarily style it to ensure it's fully visible to the renderer
        const originalStyle = element.getAttribute('style');
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.zIndex = '10000';
        element.style.backgroundColor = 'white';

        // A4 Landscape Dimensions in mm: 297 x 210
        // We'll use a high scale factor for crisp text
        const canvas = await html2canvas(element, {
          scale: 2, // High Res
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: 1600,
          height: element.scrollHeight, // Capture full natural height
          windowHeight: element.scrollHeight + 100 // Ensure viewport fits content
        });

        // Restore original style - NOT NEEDED for invisible template, but safe to keep cleanup logic if needed
        element.style.position = 'fixed';

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const pdfRatio = pdfWidth / pdfHeight;
        const imgRatio = imgProps.width / imgProps.height;

        let w, h;
        if (imgRatio > pdfRatio) {
          w = pdfWidth;
          h = w / imgRatio;
        } else {
          h = pdfHeight;
          w = h * imgRatio;
        }

        const x = (pdfWidth - w) / 2;
        const y = (pdfHeight - h) / 2;

        pdf.addImage(imgData, 'JPEG', x, y, w, h);
        pdf.save('scheduler-routine.pdf');
      } catch (err) {
        console.error('PDF export error:', err);
        alert('Failed to generate PDF. Please try again.');
      } finally {
        setIsGeneratingPDF(false);
      }
    }, 1000); // 1s delay to ensure full render
  };

  // ============= HELPER FUNCTIONS =============
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${period}`;
  };

  const getColorForCourse = (course) => {
    const colors = ['#1a1a1a', '#4a4a4a', '#7a7a7a', '#2d3748', '#4a5568', '#718096'];
    const hash = course.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const studentLogout = () => {
    setStudentEmail(null);
    localStorage.removeItem('studentEmail');
    if (currentView === 'track') setCurrentView('empty');
  };

  // ============= RENDER VIEWS =============
  /* RENDER_VIEWS_PLACEHOLDER */

  // STUDENT VIEW
  if (view === 'student') {
    return (
      <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-black selection:text-white">
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 rounded-lg shadow-lg shadow-black/10">
                <Calendar className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-black tracking-tight">
                BRACU Faculty Scheduler
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {studentEmail ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium border border-gray-200">
                  <User size={16} />
                  <span className="hidden sm:inline">{studentEmail}</span>
                  <button onClick={studentLogout} className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors" title="Logout">
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    const email = window.prompt("Enter your student email to track requests:");
                    if (email && email.includes('@')) {
                      setStudentEmail(email);
                      localStorage.setItem('studentEmail', email);
                    }
                  }}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium shadow-sm"
                >
                  Student Sign In
                </button>
              )}
              <button
                onClick={() => setView('faculty-login')}
                className="px-5 py-2.5 bg-white hover:bg-gray-50 text-black rounded-lg border border-gray-200 transition-all hover:border-black flex items-center gap-2 group shadow-sm text-sm font-medium"
              >
                <User size={18} className="group-hover:scale-110 transition-transform" />
                Faculty Portal
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'empty', label: 'Start Here', icon: Search },
                { id: 'search', label: 'Search Results', icon: BookOpen },
                { id: 'routine', label: 'My Routine', icon: Calendar },
                studentEmail && { id: 'track', label: 'Track Requests', icon: Mail },
              ].filter(Boolean).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${currentView === tab.id ? 'text-black border-black bg-gray-50' : 'text-gray-500 border-transparent hover:text-black hover:bg-gray-50'}`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* SEARCH & BUILD TAB */}
          {currentView !== 'routine' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-xl shadow-xl shadow-black/5 p-6 mb-8 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder={searchType === 'course' ? "Search by Course Name or Code (e.g. CSE101)..." : searchType === 'department' ? "Search by Department (e.g. CSE, EEE)..." : "Search for faculty name or initial..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400 transition-all"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black text-black disabled:opacity-50"
                      disabled={loading}
                    >
                      <option value="course">Course</option>
                      <option value="faculty">Faculty</option>
                      <option value="department">Department</option>
                    </select>
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-medium disabled:opacity-50 shadow-lg shadow-black/10 transition-all flex items-center gap-2"
                    >
                      {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><Search size={20} /> Search</>}
                    </button>
                  </div>
                </div>

                {/* Day / Time Filters (Requirement 1 Feature 2) */}
                {searchResults.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    <select
                      value={filterDay}
                      onChange={(e) => setFilterDay(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Days</option>
                      <option value="Sunday">Sunday</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                    <select
                      value={filterTime}
                      onChange={(e) => setFilterTime(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Times</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM+)</option>
                    </select>
                    {(filterDay || filterTime) && (
                      <button
                        onClick={() => { setFilterDay(''); setFilterTime(''); }}
                        className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-sm hover:bg-rose-100 transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* RESULTS COLUMN */}
                <div className="bg-white rounded-xl shadow-xl shadow-black/5 border border-gray-200 p-6 min-h-[500px]">
                  <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                    <Search className="text-black" size={24} />
                    Search Results
                    {searchResults.length > 0 && <span className="text-sm font-normal text-gray-500 ml-2">({searchResults.length})</span>}
                  </h2>

                  {(searchResults.length === 0 && !loading) && (
                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                      <div className="bg-gray-100 p-6 rounded-full mb-4 ring-1 ring-gray-200">
                        {searchQuery ? <Search size={48} className="text-gray-400" /> : <BookOpen size={48} className="text-gray-400" />}
                      </div>
                      <p className="text-lg font-medium text-gray-600">{searchQuery ? 'No results found' : 'Start your search'}</p>
                      <p className="text-sm mt-2 max-w-xs text-center text-gray-400">
                        {searchQuery ? `We couldn't find matches for "${searchQuery}"` : 'Enter a course code/name or faculty name.'}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {searchResults
                      .map(faculty => {
                        // Apply day/time filters to each faculty's consultations
                        let filteredConsultations = faculty.consultations || [];
                        if (filterDay) {
                          filteredConsultations = filteredConsultations.filter(c => c.day === filterDay);
                        }
                        if (filterTime) {
                          filteredConsultations = filteredConsultations.filter(c => {
                            const hour = parseInt(c.start_time.split(':')[0]);
                            if (filterTime === 'morning') return hour >= 8 && hour < 12;
                            if (filterTime === 'afternoon') return hour >= 12 && hour < 17;
                            if (filterTime === 'evening') return hour >= 17;
                            return true;
                          });
                        }
                        if (filteredConsultations.length === 0 && (filterDay || filterTime)) return null;
                        return { ...faculty, consultations: filteredConsultations };
                      })
                      .filter(Boolean)
                      .map(faculty => (
                        <FacultyCard
                          key={faculty.id}
                          faculty={faculty}
                          onAddToRoutine={addToRoutine}
                          onRequest={submitConsultationRequest}
                          formatTime={formatTime}
                        />
                      ))}
                  </div>
                </div>

                {/* CURRENT BUILDER COLUMN */}
                <div className="bg-white rounded-xl shadow-xl shadow-black/5 border border-gray-200 p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-black flex items-center gap-2">
                      <Calendar className="text-gray-800" size={24} />
                      Routine Builder
                    </h2>
                    {routine.length > 0 && (
                      <button
                        onClick={() => setCurrentView('routine')}
                        className="text-black hover:bg-gray-100 font-medium flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                      >
                        Full Preview <ArrowRight size={16} />
                      </button>
                    )}
                  </div>

                  {routine.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center h-[300px] text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 m-4">
                      <PlusCircle size={48} className="mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-600">Your schedule is empty</p>
                      <p className="text-sm mt-1">Add items from search results on the left</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-auto border border-gray-200 rounded-xl shadow-inner bg-gray-50 p-4 max-h-[600px] custom-scrollbar">
                      {/* This mini view is scrollable for building */}
                      <ScreenRoutineView routine={routine} formatTime={formatTime} onRemove={removeFromRoutine} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TRACK REQUESTS TAB (Requirement 3 Feature 4) */}
          {currentView === 'track' && (
            <div className="animate-fade-in max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-xl shadow-black/5 p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                  <Mail className="text-black" size={24} />
                  Track Your Consultation Requests
                </h2>
                <p className="text-gray-500 text-sm mb-4">Viewing requests for: <span className="font-bold text-black">{studentEmail}</span></p>
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={trackStudentRequests}
                    disabled={trackLoading}
                    className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-medium disabled:opacity-50 shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                  >
                    {trackLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><Search size={18} /> Refresh Status</>}
                  </button>
                </div>

                {trackedRequests.length === 0 && !trackLoading && trackEmail && (
                  <div className="text-center py-10 text-slate-400">
                    <Mail size={48} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-slate-600">No requests found</p>
                    <p className="text-sm mt-1">No consultation requests were found for this email.</p>
                  </div>
                )}

                {trackedRequests.length > 0 && (
                  <div className="space-y-3">
                    {trackedRequests.map(req => (
                      <div key={req.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-black transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-black">{req.faculty_name}</h4>
                            <p className="text-sm text-gray-500">{req.course_name} • {req.day_of_week} at {formatTime(req.start_time)}</p>
                            {req.location && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={12} /> {req.location}</p>}
                            <p className="text-sm text-gray-600 mt-2 italic">\"{req.message}\"</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            req.status === 'approved' ? 'bg-black text-white' :
                            req.status === 'denied' ? 'bg-gray-200 text-gray-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Submitted: {new Date(req.created_at).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DEDICATED PREVIEW & EXPORT TAB */}
          {currentView === 'routine' && (
            <div className="flex flex-col items-center gap-8 animate-fade-in">
              <div className="flex flex-col items-center gap-4 text-center max-w-2xl mx-auto">
                <div className="bg-gray-100 p-4 rounded-full text-black mb-2 ring-8 ring-gray-50"><Download size={32} /></div>
                <h2 className="text-3xl font-bold text-black tracking-tight">Final Routine Preview</h2>
                <p className="text-gray-500">This dedicated view shows your routine exactly as it will appear in the A4 PDF. Review it below and export when ready.</p>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setCurrentView('search')}
                    className="px-6 py-3 bg-white text-black border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft size={18} /> Back to Builder
                  </button>
                  <button
                    onClick={downloadPDF}
                    disabled={isGeneratingPDF || routine.length === 0}
                    className="px-8 py-3 bg-black text-white text-lg font-bold rounded-xl shadow-xl shadow-black/10 hover:bg-gray-800 hover:scale-105 transition-all flex items-center gap-3"
                  >
                    {isGeneratingPDF ? 'Generating...' : <><Download size={24} /> Download PDF</>}
                  </button>
                </div>
              </div>

              {routine.length === 0 ? (
                <div className="text-center py-20 bg-white w-full rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-slate-400 text-xl">Your routine is empty.</p>
                </div>
              ) : (
                <div className="w-full max-w-5xl mx-auto">
                  <ScreenRoutineView routine={routine} formatTime={formatTime} onRemove={removeFromRoutine} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden Print Container - Always rendered but hidden off-screen */}
        <div className="fixed -left-[3000px] top-0 overflow-hidden">
          {isGeneratingPDF && (
            <PrintRoutineTemplate routine={routine} />
          )}
        </div>
      </div>
    );
  }

  // FACULTY LOGIN & REGISTER VIEWS
  if (view === 'faculty-login') return <FacultyLogin onLogin={facultyLogin} onSwitchToRegister={() => setView('faculty-register')} onBackToStudent={() => setView('student')} loading={loading} />;
  if (view === 'faculty-register') return <FacultyRegister onRegister={facultyRegister} onSwitchToLogin={() => setView('faculty-login')} loading={loading} />;

  // FACULTY DASHBOARD VIEW
  if (view === 'faculty-dashboard' && loggedInFaculty) {
    return (
      <div className="min-h-screen bg-gray-50 text-black font-sans">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow">
                {loggedInFaculty.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">{loggedInFaculty.name}</h1>
                <p className="text-sm text-gray-500">{loggedInFaculty.department}</p>
              </div>
            </div>
            <button
              onClick={() => { setLoggedInFaculty(null); setView('student'); }}
              className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors border border-gray-200 shadow-sm font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 mt-2">
            <div className="flex gap-1 overflow-x-auto">
              {[
                { id: 'info', label: 'Profile Settings', icon: User },
                { id: 'requests', label: 'Student Requests', icon: Mail, badge: facultyRequests.filter(r => r.status === 'pending').length },
                { id: 'courses', label: 'My Courses', icon: BookOpen },
                { id: 'hours', label: 'Consultation Hours', icon: Clock }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFacultyDashView(tab.id);
                    if (tab.id === 'requests') fetchFacultyRequests();
                    if (tab.id === 'courses') fetchAllCourses();
                    if (tab.id === 'hours') fetchMyConsultations();
                  }}
                  className={`px-6 py-3 font-medium flex items-center gap-2 border-b-2 transition-all ${facultyDashView === tab.id ? 'text-black border-black bg-gray-50' : 'text-gray-500 border-transparent hover:text-black hover:bg-gray-50'}`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {tab.badge > 0 && (
                    <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full ml-1 shadow-sm">{tab.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {facultyDashView === 'info' && <FacultyInfoForm faculty={loggedInFaculty} onUpdate={updateFacultyInfo} onDelete={deleteFacultyAccount} loading={loading} />}
          {facultyDashView === 'requests' && <RequestsList requests={facultyRequests} onApprove={approveRequest} onDecline={declineRequest} loading={loading} />}
          {facultyDashView === 'courses' && <CoursesManager courses={coursesList} onCreate={createCourse} loading={loading} />}
          {facultyDashView === 'hours' && <ConsultationManager consultations={myConsultations} courses={coursesList} onAdd={addConsultationSlot} onDelete={deleteConsultationSlot} onUpdate={updateConsultationSlot} loading={loading} />}
        </div>
      </div>
    );
  }

  return null; // Should be unreachable
};

// ============= COMPONENTS =============
const FacultyCard = ({ faculty, onAddToRoutine, onRequest, formatTime }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const handleSubmitRequest = () => {
    if (selectedConsultation) {
      onRequest(faculty.id, selectedConsultation.id, studentName, studentEmail, message);
      setShowRequestForm(false);
      setStudentName('');
      setStudentEmail('');
      setMessage('');
      setSelectedConsultation(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:shadow-black/5 transition-all group shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 group-hover:border-black transition-colors">
            <User size={28} className="text-black" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-black group-hover:text-black transition-colors">
              {faculty.name}
              {faculty.initial && <span className="text-sm text-gray-400 font-normal ml-2">({faculty.initial})</span>}
            </h3>
            <p className="text-sm text-gray-500">{faculty.department}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm mb-6">
        <div className="flex items-center gap-3 text-slate-600">
          <BookOpen size={18} className="text-slate-400" />
          <span>{faculty.courses?.join(', ') || 'No courses listed'}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Mail size={18} className="text-slate-400" />
          <span>{faculty.email}</span>
        </div>
        {faculty.desk_no && (
          <div className="flex items-center gap-3 text-slate-600">
            <MapPin size={18} className="text-slate-400" />
            <span>Desk: {faculty.desk_no}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-3">
        <h4 className="font-semibold text-gray-500 text-sm mb-2 uppercase tracking-wider text-xs">Consultation Hours</h4>
        {faculty.consultations && faculty.consultations.map((cons, idx) => (
          <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-black transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-black">
                <span className="font-semibold w-24 border-r border-gray-200 mr-2">{cons.day}</span>
                <span className="text-gray-500 font-medium">{formatTime(cons.start_time)} - {formatTime(cons.end_time)}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1 pl-26 ml-24 flex items-center gap-1">
                <MapPin size={12} /> {cons.location}
              </div>
            </div>
            <button
              onClick={() => onAddToRoutine(cons, faculty)}
              className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
              title="Add to routine"
            >
              <Plus size={18} />
            </button>
          </div>
        ))}
      </div>

      {!showRequestForm ? (
        <button
          onClick={() => setShowRequestForm(true)}
          className="w-full mt-6 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 font-medium transition-all shadow-lg shadow-black/10"
        >
          Request Consultation
        </button>
      ) : (
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <select
            value={selectedConsultation?.id || ''}
            onChange={(e) => {
              const cons = faculty.consultations?.find(c => c.id === parseInt(e.target.value));
              setSelectedConsultation(cons);
            }}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select consultation slot</option>
            {faculty.consultations && faculty.consultations.length > 0 ? (
              faculty.consultations.map(cons => (
                <option key={cons.id} value={cons.id}>
                  {cons.day} | {formatTime(cons.start_time)}
                </option>
              ))
            ) : (
              <option disabled>No slots available</option>
            )}
          </select>
          <input
            type="text"
            placeholder="Your Full Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Your Student Email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Consultation Topic / Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="2"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitRequest}
              disabled={!selectedConsultation}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              Send
            </button>
            <button
              onClick={() => setShowRequestForm(false)}
              className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// RoutineGrid replaced by PdfPrintView for consistent WYSIWYG printing


const FacultyLogin = ({ onLogin, onSwitchToRegister, onBackToStudent, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 p-8">
        <button onClick={onBackToStudent} className="text-gray-500 hover:text-black mb-6 flex items-center gap-2 font-medium transition-colors">
          ← Back to Student View
        </button>
        <div className="flex justify-center mb-6">
          <div className="bg-black p-4 rounded-2xl shadow-lg shadow-black/10">
            <User size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-black mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Login to manage your schedule</p>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400 transition-all"
              placeholder="e.g. sarah@university.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black text-black placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold font-lg shadow-lg shadow-black/10 transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="text-black hover:underline font-bold">
              Register Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const FacultyRegister = ({ onRegister, onSwitchToLogin, loading }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '', initial: '' });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-black/5 p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-black mb-8 tracking-tight">Faculty Registration</h2>
        <form onSubmit={(e) => { e.preventDefault(); onRegister(formData.name, formData.email, formData.password, formData.department, formData.initial); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-black" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            <input type="text" placeholder="Department" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-black" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required />
          </div>
          <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-black" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
          <input type="password" placeholder="Password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-black" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
          <input type="text" placeholder="Faculty Initial (e.g. MRA)" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-black focus:ring-2 focus:ring-black uppercase" maxLength={5} value={formData.initial} onChange={e => setFormData({ ...formData, initial: e.target.value.toUpperCase() })} required />
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 mt-4">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500">
          Already registered? <button onClick={onSwitchToLogin} className="text-black font-bold hover:underline">Login here</button>
        </p>
      </div>
    </div>
  );
};

const FacultyInfoForm = ({ faculty, onUpdate, onDelete, loading }) => {
  const [formData, setFormData] = useState({ name: faculty.name || '', department: faculty.department || '', initial: faculty.initial || '', deskNo: faculty.desk_no || '' });

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-black/5 border border-gray-200 p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><Settings className="text-black" /> Profile Settings</h2>
      <form onSubmit={(e) => { e.preventDefault(); onUpdate(faculty.id, formData.name, formData.department, formData.initial, formData.deskNo); }} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm text-gray-500 mb-1">Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-black" /></div>
          <div><label className="block text-sm text-gray-500 mb-1">Department</label><input type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-black" /></div>
          <div><label className="block text-sm text-gray-500 mb-1">Initial</label><input type="text" value={formData.initial} onChange={e => setFormData({ ...formData, initial: e.target.value.toUpperCase() })} maxLength={5} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-black uppercase" /></div>
          <div><label className="block text-sm text-gray-500 mb-1">Desk Number</label><input type="text" value={formData.deskNo} onChange={e => setFormData({ ...formData, deskNo: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-black" placeholder="e.g. CS-300" /></div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-6">
          <button type="button" onClick={onDelete} disabled={loading} className="px-4 py-2 bg-white text-gray-400 border border-gray-200 rounded-lg font-medium hover:text-black hover:border-black transition-colors">Delete Account</button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 shadow-lg shadow-black/10">{loading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
};



const RequestsList = ({ requests, onApprove, onDecline, loading }) => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 shadow-black/5">
      <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2"><Mail className="text-black" /> Pending Requests</h2>
      {requests.filter(r => r.status === 'pending').length === 0 ? <p className="text-gray-500 italic text-center py-4">No pending requests.</p> :
        requests.filter(r => r.status === 'pending').map(r => (
          <div key={r.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3 flex justify-between items-center group hover:border-black transition-colors">
            <div>
              <h4 className="font-bold text-black">{r.course_name}</h4>
              <p className="text-sm text-gray-600">Student: <span className="font-semibold text-black">{r.student_name}</span> ({r.student_email})</p>
              <p className="text-sm text-gray-500 mt-1 italic">"{r.message}"</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onApprove(r.id)} className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all" title="Approve"><Check size={20} /></button>
              <button onClick={() => onDecline(r.id)} className="p-2 bg-white text-gray-400 border border-gray-200 rounded-lg hover:text-black hover:border-black transition-all" title="Decline"><X size={20} /></button>
            </div>
          </div>
        ))}
    </div>
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 opacity-75 shadow-black/5">
      <h2 className="text-xl font-bold text-black mb-4">Request History</h2>
      {requests.filter(r => r.status !== 'pending').map(r => (
        <div key={r.id} className="py-2 border-b border-gray-100 last:border-0 flex justify-between">
          <span className="text-gray-600">{r.student_email}</span>
          <span className={`px-2 py-0.5 rounded text-xs capitalize ${r.status === 'approved' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>{r.status}</span>
        </div>
      ))}
    </div>
  </div>
);

const CoursesManager = ({ courses, onCreate, loading }) => {
  const [newCourse, setNewCourse] = useState({ code: '', name: '', department: '' });
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl shadow-black/5">
        <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2 border-b border-gray-100 pb-4"><PlusCircle className="text-black" /> Add New Course</h2>
        <form onSubmit={(e) => { e.preventDefault(); onCreate(newCourse); }} className="space-y-4 mt-4">
          <input type="text" placeholder="Course Code (e.g. CSE101)" value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-black" required />
          <input type="text" placeholder="Course Name" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-black" required />
          <input type="text" placeholder="Department" value={newCourse.department} onChange={e => setNewCourse({ ...newCourse, department: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:ring-2 focus:ring-black" required />
          <button type="submit" disabled={loading} className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 shadow-md transition-all font-bold">Add Course</button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl shadow-black/5 h-[400px] overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-black mb-4 sticky top-0 bg-white pb-2 border-b border-gray-100">All Courses</h2>
        {courses.map(c => (
          <div key={c.id} className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded transition-colors">
            <div className="font-bold text-black">{c.course_code}</div>
            <div className="text-sm text-gray-500">{c.course_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConsultationManager = ({ consultations, courses, onAdd, onDelete, onUpdate, loading }) => {
  const [newSlot, setNewSlot] = useState({ course_id: '', day_of_week: 'Monday', start_time: '', end_time: '', location: '' });
  
  const handleToggleActive = (slot) => {
    onUpdate({ ...slot, is_active: !slot.is_active });
  };

  const handleUpdateLocation = (slot) => {
    const newLoc = window.prompt("Enter new location for this slot:", slot.location);
    if (newLoc && newLoc !== slot.location) {
      onUpdate({ ...slot, location: newLoc });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl shadow-black/5">
        <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2 border-b border-gray-100 pb-4"><Clock className="text-black" /> Add Consultation Hour</h2>
        <form onSubmit={(e) => { e.preventDefault(); onAdd(newSlot); }} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end mt-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course</label>
            <select value={newSlot.course_id} onChange={e => setNewSlot({ ...newSlot, course_id: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-black mt-1" required>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>)}
            </select>
          </div>
          <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Day</label><select value={newSlot.day_of_week} onChange={e => setNewSlot({ ...newSlot, day_of_week: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-black mt-1"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option></select></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start</label><input type="time" value={newSlot.start_time} onChange={e => setNewSlot({ ...newSlot, start_time: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-black mt-1" required /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End</label><input type="time" value={newSlot.end_time} onChange={e => setNewSlot({ ...newSlot, end_time: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-black mt-1" required /></div>
          <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label><input type="text" value={newSlot.location} onChange={e => setNewSlot({ ...newSlot, location: e.target.value })} className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-black mt-1" required /></div>
          <button type="submit" disabled={loading} className="md:col-span-6 bg-black text-white p-3 rounded-lg hover:bg-gray-800 font-bold shadow-lg shadow-black/10 transition-all">Add Consultation Slot</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {consultations.map(c => (
          <div key={c.id} className={`bg-white p-4 rounded-xl border relative group shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all ${!c.is_active ? 'opacity-50 grayscale' : 'border-gray-200'}`}>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button onClick={() => handleToggleActive(c)} className="text-gray-300 hover:text-black" title={c.is_active ? "Mark as Unavailable" : "Mark as Available"}>{c.is_active ? <X size={16} /> : <Check size={16} />}</button>
              <button onClick={() => handleUpdateLocation(c)} className="text-gray-300 hover:text-black" title="Edit Location"><Edit size={16} /></button>
              <button onClick={() => onDelete(c.id)} className="text-gray-300 hover:text-rose-600"><Trash2 size={16} /></button>
            </div>
            <div className="font-bold text-black border-b border-gray-100 pb-2 mb-2">{c.day_of_week}</div>
            <div className="text-2xl font-bold text-black">{c.start_time.slice(0, 5)} - {c.end_time.slice(0, 5)}</div>
            <div className="text-gray-500 text-sm mt-1 font-medium">{c.course_code}</div>
            <div className="text-gray-400 text-xs mt-2 flex items-center gap-1 bg-gray-50 p-1.5 rounded"><MapPin size={12} /> {c.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;