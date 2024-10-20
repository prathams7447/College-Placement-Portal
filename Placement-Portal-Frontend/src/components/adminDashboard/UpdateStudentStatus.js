import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { getStudentBy_applied_companyid, updateStudentStatus } from '../../service';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const UpdatedInterview = observer(({ company, onClose }) => {
  const [students, setStudents] = useState([]);
  const [editableStudents, setEditableStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const studentsResponse = await getStudentBy_applied_companyid(company.companyId);
      setStudents(studentsResponse);
      setEditableStudents(studentsResponse);
    };

    fetchData();
  }, [company.companyId]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditableStudents([...students]);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditableStudents([...students]);
  };

  const handleSaveClick = async () => {
    try {
      const status = await updateStudentStatus({ students: editableStudents, companyId: company.companyId });
      if (status.toLowerCase().includes("error")) {
        setMessage(status);
      } else {
        setStudents([...editableStudents]);
        setIsEditing(false);
        onClose(editableStudents);
      }
    } catch (error) {
      console.error('Error updating student status:', error);
      setMessage('Error updating student status');
    }
  };

  const handleChange = (index, e) => {
    const updatedStudents = [...editableStudents];
    updatedStudents[index] = { ...updatedStudents[index], ["placed"]: e };
    setEditableStudents(updatedStudents);
  };

  const closeMessagePopup = () => {
    setMessage('');
  };

  return (
    <div className="container" style={{ marginTop: '5rem' }}>
      {message && (
        <div style={{
          background: 'white',
          margin: '1rem auto',
          width: '700px',
          borderRadius: '10px',
          padding: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span className="text-danger">
            {message}
          </span>
          <button className="btn btn-secondary btn-sm" onClick={closeMessagePopup}>Close</button>
        </div>
      )}
      <h2 className="text-center mb-4">{company.companyName}</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
        {students.length > 0 ? (
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Sl No</th>
                <th scope="col">Register No</th>
                <th scope="col">Name</th>
                <th scope="col">Department</th>
                <th scope="col">Year</th>
                <th scope="col">CGPA</th>
                <th scope="col">Email</th>
                <th scope="col">Contact No</th>
                <th scope="col">Placed</th>
              </tr>
            </thead>
            <tbody>
              {editableStudents.map((student, index) => (
                <tr key={student.registerNo}>
                  <td>{index + 1}</td>
                  <td>{student.registerNo}</td>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{student.cgpa}</td>
                  <td>{student.email}</td>
                  <td>{student.contactNo}</td>
                  <td>
                    {isEditing ? (
                      <DropdownButton
                        title={student.placed}
                        onSelect={(eventKey) => handleChange(index, eventKey)}
                      >
                        <Dropdown.Item eventKey="Yes">Yes</Dropdown.Item>
                        <Dropdown.Item eventKey="No">No</Dropdown.Item>
                        <Dropdown.Item eventKey="Not Attended">Not Attended</Dropdown.Item>
                      </DropdownButton>
                    ) : (
                      student.placed.toString()
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">
            <p>No students applied for {company.companyName}</p>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center mt-3">
      {students.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          {isEditing ? (
            <>
              <button
                className="btn btn-success btn-sm mr-2"
                onClick={handleSaveClick}
              >
                Save
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleCancelClick}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleEditClick}
            >
              Edit
            </button>
          )}
        </div>
      )}
      </div>
    </div>
  );
});

export default UpdatedInterview;
