import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Badge, Spinner } from 'react-bootstrap';
import { getStudentByRegID } from '../../service';
import ViewAppliedCompanies from './ViewAppliedCompanies';
import ViewPlacedCompanies from './ViewPlacedCompanies';
import ApplyForCompany from './ApplyForCompany';
import { mainstore } from '../../BaseModal';
import { useLocation } from 'react-router-dom'; 

const StudentDashboard = observer(() => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewCompanies, setViewCompanies] = useState(false);
  const [isViewAppliedCom, setViewAppliedCom] = useState(false);
  const [isViewPlacedCom, setViewPlacedCom] = useState(false);

  const location = useLocation();
  const getColor = (placed) => placed === 'Yes' ? 'green' : 'red';  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await getStudentByRegID();
        setStudent(studentsResponse);
      } catch (err) {
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    console.log("called ", mainstore.is_loggedin)
    setViewCompanies(false)
    setViewAppliedCom(false)
    setViewPlacedCom(false)
  }, [location]); // Empty dependency array ensures it runs only once

  const handleViewCompanies = () => {
    setViewCompanies(true);
  };

  const closeViewCompanies = () => {
    setViewCompanies(false);
  };

  const handleViewAppliedCom = () => {
    setViewAppliedCom(true);
  };

  const closeViewAppliedCom = () => {
    setViewAppliedCom(false);
  };

  const handleViewPlacedCom = () => {
    setViewPlacedCom(true)
  }

  const closeViewPlacedCom = () => {
    setViewPlacedCom(false);
  };

  if (isViewCompanies) {
    return <ApplyForCompany onClose={closeViewCompanies}  />;
  }

  if (isViewAppliedCom) {
    return <ViewAppliedCompanies onClose={closeViewAppliedCom}  />;
  }

  if (isViewPlacedCom) {
    return <ViewPlacedCompanies onClose={closeViewPlacedCom}/>;
  }

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: '5rem' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center" style={{ marginTop: '5rem' }}>
        <h3 className="text-danger">{error}</h3>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '5rem' }}>
      <h2 className="text-center">Student Dashboard</h2>
      <Card className="mt-4" style={{ padding: '20px' }}>
        <Card.Body>
          <Card.Title className="text-center">{student.name}</Card.Title>
          <Card.Text>
            <p><strong>Register No:</strong> {student.registerNo}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Contact No:</strong> {student.contactNo}</p>
            <p><strong>Department:</strong> {student.department}</p>
            <p><strong>Year:</strong> {student.year}</p>
            <p><strong>CGPA:</strong> {student.cgpa}</p>
          </Card.Text>

          <div className="mb-3 text-center">
          <Badge 
            style={{ 
              fontSize: '1.2em', 
              backgroundColor: getColor(student.placed),
              color: 'white' // Ensure the text color is readable
            }}
          >
            {student.placed === 'Yes' ? 'Placed' : 'Not Placed'}
          </Badge>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" className="mr-2" onClick={handleViewPlacedCom}>
              View Placed Companies
            </Button>
            <Button variant="primary" className="mr-2" onClick={handleViewAppliedCom}>
              View Applied Companies
            </Button>
            <Button variant="success" onClick={handleViewCompanies}>
              Apply for Companies
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
});

export default StudentDashboard;
