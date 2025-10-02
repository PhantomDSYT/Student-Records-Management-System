import React, {useState, useEffect} from "react";
import axios from "axios";

const StudentForm = ({ student, onSuccess}) => {
    const [formData, setFormData] = useState({
        studentId: 0,
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: 0,
        major: '',
    });

    useEffect(() => {
        if (student) {
            setFormData(student);
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (student) {
                await axios.put(`https://localhost:7002/api/students/${formData.studentId}`, formData);
            } else {
                await axios.post('https://localhost:7002/api/students', formData);
            }
            onSuccess();
            setFormData({ studentId: 0, firstName: '', lastName: '', address: '', phoneNumber: 0, major: '',});
        } catch (error) {
            console.error('Error saving student: ', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
            <div className="mb-3">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Address</label>
                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input type="number" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Major</label>
                <input type="text" className="form-control" name="major" value={formData.major} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">
                {student ? 'Update' : 'Create'}
            </button>
        </form>
    );
};

export default StudentForm;