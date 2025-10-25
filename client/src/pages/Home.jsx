import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, X } from 'lucide-react';

function Home() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    batch: '',
    grade: '',
    dateOfAdmission: ''
  });

  const API_URL = 'https://student-management-luminar-mechine.vercel.app/api/students';

  //  Fetch all students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  //  Filter students by search term
  useEffect(() => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentStudent) {
        // Update
        const res = await fetch(`${API_URL}/${currentStudent._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update student');
      } else {
        // Add new
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create student');
      }

      await fetchStudents();
      resetForm();
    } catch (error) {
      console.error(error);
      alert('Error saving student');
    }
  };

  //  Edit student
  const handleEdit = (student) => {
    setCurrentStudent(student);
    setFormData({
      ...student,
      dateOfAdmission: student.dateOfAdmission
        ? new Date(student.dateOfAdmission).toISOString().split('T')[0]
        : '',
    });
    setShowModal(true);
  };

  //  Delete student
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${deleteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete student');
      await fetchStudents();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      alert('Error deleting student');
    }
  };

  //  Reset form and close modal
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      course: '',
      batch: '',
      grade: '',
      dateOfAdmission: '',
    });
    setCurrentStudent(null);
    setShowModal(false);
  };

  //  Handle Add button click (fixes modal issue)
  const handleAddStudent = () => {
    resetForm(); // ensures edit data is cleared
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-light">
      <nav className="navbar navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Student Management System</span>
        </div>
      </nav>

      <div className="container">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Students List</h2>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleAddStudent}
          >
            <Plus size={20} />
            Add Student
          </button>
        </div>

        {/* Search Bar */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <Search size={20} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Batch</th>
                    <th>Grade</th>
                    <th>Date of Admission</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.course}</td>
                        <td>{student.batch}</td>
                        <td>
                          <span className="badge bg-success">{student.grade}</span>
                        </td>
                        <td>
                          {student.dateOfAdmission
                            ? new Date(student.dateOfAdmission).toLocaleDateString()
                            : '-'}
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(student)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(student._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentStudent ? 'Edit Student' : 'Add New Student'}
                </h5>
                <button className="btn-close" onClick={resetForm}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Course */}
                  <div className="mb-3">
                    <label className="form-label">Course</label>
                    <input
                      type="text"
                      className="form-control"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Batch */}
                  <div className="mb-3">
                    <label className="form-label">Batch</label>
                    <input
                      type="text"
                      className="form-control"
                      name="batch"
                      value={formData.batch}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Grade */}
                  <div className="mb-3">
                    <label className="form-label">Grade</label>
                    <select
                      className="form-select"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Grade</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                  </div>

                  {/* Date of Admission */}
                  <div className="mb-3">
                    <label className="form-label">Date of Admission</label>
                    <input
                      type="date"
                      className="form-control"x
                      name="dateOfAdmission"
                      value={formData.dateOfAdmission}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {currentStudent ? 'Update' : 'Add'} Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this student? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
