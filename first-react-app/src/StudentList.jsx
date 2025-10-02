import React, {use, useEffect, useState} from 'react';
import axios from 'axios';
import StudentForm from './StudentForm';
import {Modal, Button} from 'react-bootstrap';
import ToastMessage from './ToastMessage';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent,setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConf, setShowDeleteConf] = useState(false);
    const [toast, setToast] = useState ({ show: false, message: '', variant: 'success'});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const studentsPerPage = 5;

    const fetchStudents = async () => {
        const response = await axios.get('https://localhost:7002/api/students');
        setStudents(response.data);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleEditClick = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setShowDeleteConf(false);
        setSelectedStudent(null);
    };

    const handleFormSuccess = () => {
      showToast(selectedStudent ? "Student updated" : "Student created", "success");
      handleModalClose();
      fetchStudents();
    };

    const handleDeleteClick = (student) => {
      setSelectedStudent(student);
      setShowDeleteConf(true);
    }

    const handleDelete = async (id) => {
      try {
        await axios.delete(`https://localhost:7002/api/students/${id}`);
        showToast("Student deleted", "danger");
        fetchStudents();
        handleModalClose();
      } catch (error) {
        console.error("Error deleting student: ", error);
        alert("Failed to delete student. See console for details.");
      }
    };

    const showToast = (message, variant = 'success') => {
      setToast({show: true, message, variant});
    };

    const filteredStudents = students.filter(s => {
      const query = searchTerm.toLowerCase();
      return (
        s.firstName.toLowerCase().includes(query) ||
        s.lastName.toLowerCase().includes(query) ||
        s.major.toLowerCase().includes(query)
      );
    });

    const indexOfLast = currentPage * studentsPerPage;
    const indexOfFirst = indexOfLast - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    return (
    <div className="container mt-4">
      <h3>Students</h3>
      <Button variant='success' className='mb-3' onClick={() => {
        setSelectedStudent(null);
        setShowModal(true);
      }}>
        Add New Student
      </Button>
      <input 
        type='text' 
        className='form-control mb-3' 
        placeholder='Search by name or major'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Major</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.length === 0 ? (
            <tr>
              <td colSpan="4" className='text-center text-muted'>
                No students found.
              </td>
            </tr>
          ) : (
            currentStudents.map(s => (
              <tr key={s.studentId}>
                <td>{s.firstName} {s.lastName}</td>
                <td>{s.major}</td>
                <td>{s.phoneNumber}</td>
                <td>
                  <Button variant="primary" className='me-2' onClick={() => handleEditClick(s)}>
                    Edit
                  </Button>
                  <Button variant='danger' onClick={() => handleDeleteClick(s)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <nav>
        <ul className='pagination justify-content-center'>
          <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
            <button className='page-link' onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
          </li>

          {[...Array(totalPages)].map((_, idx) => (
            <li key={idx + 1} className={`page-item ${currentPage === idx + 1 && 'active'}`}>
              <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
            <button className='page-link' onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
          </li>
        </ul>
      </nav>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedStudent ? 'Edit Student' : 'Add Student'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StudentForm student={selectedStudent} onSuccess={handleFormSuccess} />
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteConf} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Student?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this student?</p><br />
          <div className='mt-3'>
            <Button variant='success' onClick={handleModalClose} className='me-4'>
              No
            </Button>
            <Button variant='danger' onClick={() => handleDelete(selectedStudent.studentId)}>
              Yes
            </Button>
          </div>
        </Modal.Body>``
      </Modal>

      <ToastMessage
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false})}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
    )
}

export default StudentList;