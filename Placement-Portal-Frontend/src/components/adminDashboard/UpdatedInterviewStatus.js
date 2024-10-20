import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCompany, updateInterviewStatus } from '../../service';
import UpdateStudentStatus from './UpdateStudentStatus';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown, DropdownButton } from 'react-bootstrap';

// Function to parse "dd-MM-yyyy" string to Date object
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);
};

// Function to format Date object to "dd-MM-yyyy" string
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const UpdatedInterviewStatus = observer(() => {
  const [company, setCompany] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editableCompany, setEditableCompany] = useState({});
  const [message, setMessage] = useState('');
  const [showStudentsApplied, setShowStudentsApplied] = useState(false);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      const companyData = await getCompany();
      // Convert date strings to Date objects
      const parsedCompanyData = companyData.map(com => ({
        ...com,
        date: parseDate(com.date),
      }));
      setCompany(parsedCompanyData);
    };
    fetchData();
  }, []);

  const handleCancelClick = () => {
    setEditIndex(-1);
    setEditableCompany({});
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditableCompany({ ...company[index] });
  };

  const handleSaveClick = async () => {
    try {
      const updatedCompany = [...company];
      updatedCompany[editIndex] = editableCompany;
      const status = await updateInterviewStatus(updatedCompany[editIndex]);
      if (status.toLowerCase().includes("error")) {
        setMessage(status);
      } else {
        setCompany(updatedCompany);
      }
      setEditIndex(-1);
    } catch (error) {
      setEditIndex(-1);
      setMessage('Error updating interview status');
      console.error('Error updating interview status:', error);
    }
  };

  const closeMessagePopup = () => {
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableCompany({ ...editableCompany, [name]: value });
  };

  const handleDateChange = (date) => {
    setEditableCompany({ ...editableCompany, date });
  };

  const handleViewStudentsClick = (index) => {
    setShowStudentsApplied(true);
    setIndex(index);
  };

  const closeUpdateStudentsStatus = () => {
    setShowStudentsApplied(false);
    setIndex(-1);
  };

  if (showStudentsApplied) {
    return <UpdateStudentStatus company={company[index]} onClose={closeUpdateStudentsStatus} />;
  }

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

      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Company Id</th>
              <th scope="col">Company Name</th>
              <th scope="col">Designation</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
              <th scope="col">Applied Students</th>
            </tr>
          </thead>
          <tbody>
            {company.map((com, index) => (
              <tr key={com.companyId}>
                <td>{com.companyId}</td>
                <td>{com.companyName}</td>
                <td>{com.designation}</td>
                <td>
                  {editIndex === index ? (
                    <DatePicker
                      selected={editableCompany.date}
                      onChange={handleDateChange}
                      className="form-control"
                      dateFormat="dd-MM-yyyy"
                    />
                  ) : (
                    formatDate(new Date(com.date))
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input
                      name="time"
                      value={editableCompany.time}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    com.time
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <DropdownButton
                      title={editableCompany.status}
                      onSelect={(e) => handleChange({ target: { name: 'status', value: e } })}
                    >
                      <Dropdown.Item eventKey="Scheduled">Scheduled</Dropdown.Item>
                      <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                      <Dropdown.Item eventKey="Cancelled">Cancelled</Dropdown.Item>
                    </DropdownButton>
                  ) : (
                    com.status
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <div>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleSaveClick}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditClick(index)}
                    >
                      Edit
                    </button>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm ml-2"
                    onClick={() => handleViewStudentsClick(index)}
                  >
                    Update Students Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default UpdatedInterviewStatus;
