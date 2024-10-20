import React, { useState, useEffect, Component } from 'react';
import StudentForm from './StudentForm';
import ScheduleInterview from './ScheduleInterview';
import ViewInterviewSheduled from './ViewInterviewSheduled';
import ViewStudents from './ViewStudents';
import { useLocation } from 'react-router-dom'; // Make sure this line is included
import UpdatedInterviewStatus from './UpdatedInterviewStatus';
import { observer } from 'mobx-react-lite';

const AdminDashboard =  observer(() => {
  const [isStudentFormOpen, setStudentIsFormOpen] = useState(false);
  const [isComapanyFormOpen, setCompanyIsFormOpen] = useState(false);
  const [isViewStudents, setViewStudents] = useState(false);
  const [isViewInterviews, setViewInterviews] = useState(false);
  const [isUpdateInterviews, setUpdateInterviews] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const location = useLocation();

  const handleStudentFormClick = () => {
    setStudentIsFormOpen(true);
  };

  const closeStudentForm = () => {
    setStudentIsFormOpen(false);
  };

  const handleSheduleInterviewClick = () => {
    setCompanyIsFormOpen(true);
  };

  const closeCompanyForm = () => {
    setCompanyIsFormOpen(false);
  };

  const handleViewStudent = () => {
    setViewStudents(true);
  };

  const closeViewStudent = () => {
    setViewStudents(false);
  };

  const handleViewInterview = () => {
    setViewInterviews(true);
  };

  const closeViewInterview = () => {
    setViewInterviews(false);
  };

  const handleInterviewStatus = () => {
    setUpdateInterviews(true)
  }

  const closeUpdateInterview = () => {
    setUpdateInterviews(false);
  };

  const handleMessage = (message) => {
    // Check if the message contains "Error" (case insensitive)
    console.log(message)
    if (message.toLowerCase().includes("error")) {
      setIsError(true);
      setMessage(message);
      console.log(isError)
    } else {
      setIsError(false); // Reset to false if it's not an error
    }
    
  };

  const closeMessagePopup = () => {
    setMessage('');
  };

 


  useEffect(() => {
    console.log("home navigated")
    // Reset all modals to closed when the component mounts
    setStudentIsFormOpen(false);
    setCompanyIsFormOpen(false);
    setViewStudents(false);
    setViewInterviews(false);
    setUpdateInterviews(false)
    setMessage('');
  }, [location]);

  

  if (isStudentFormOpen) {
    return <StudentForm onClose={closeStudentForm} onStatus={handleMessage} />;
  }

  if (isComapanyFormOpen) {
    return <ScheduleInterview onClose={closeCompanyForm} onStatus={handleMessage} />;
  }

  if (isViewStudents) {
    return <ViewStudents onClose={closeViewStudent} onStatus={handleMessage} />;
  }

  if (isViewInterviews) {
    return <ViewInterviewSheduled onClose={closeViewInterview} onStatus={handleMessage} />;
  }

  if (isUpdateInterviews) {
    return <UpdatedInterviewStatus onClose={closeUpdateInterview} onStatus={handleMessage} />;
  }

  return (
    <div className="container">
      {message && (
        <div style={{
          background: 'white',
          margin: '1rem auto',
          width: '700px', // Reduced width for a single line
          borderRadius: '10px',
          padding: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span className={"text-danger"}>
            {message}
          </span>
          <button className="btn btn-secondary btn-sm" onClick={closeMessagePopup}>Close</button>
        </div>
      )}


      <h2 className="text-center my-5" style={{ color: 'black'}}>Admin Dashboard</h2>

      <div className="row" >
        <div className="col-md-6 mx-auto">
          <div className="card mb-4">
            <div className="card-body d-flex justify-content-between align-items-center">
              <h3 className="card-title" style={{ color: 'black' }}>Create Student</h3>
              <button className="btn btn-success" onClick={handleStudentFormClick}>Create</button>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body d-flex justify-content-between align-items-center" >
              <h3 className="card-title" style={{ color: 'black' }}>Schedule Company Interview</h3>
              <button className="btn btn-success" onClick={handleSheduleInterviewClick}>Schedule</button>
            </div>
          </div>

          <div className="card mb-4" >
            <div className="card-body d-flex justify-content-between align-items-center" >
              <h3 className="card-title" style={{ color: 'black' }}>Students List</h3>
              <button className="btn btn-success" onClick={handleViewStudent}>View</button>
            </div>
          </div>

          <div className="card mb-4" >
            <div className="card-body d-flex justify-content-between align-items-center">
              <h3 className="card-title" style={{ color: 'black' }}>Interviews Scheduled</h3>
              <button className="btn btn-success" onClick={handleViewInterview}>View</button>
            </div>
          </div>

          <div className="card mb-4" >
            <div className="card-body d-flex justify-content-between align-items-center">
              <h3 className="card-title" style={{ color: 'black' }}>Update Interview Status</h3>
              <button className="btn btn-success" onClick={handleInterviewStatus}>Update</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default AdminDashboard;
