import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { getStudent } from "../../service";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewStudents = observer(() => {
  const [placedCount, setPlacedCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const studentsResponse = await getStudent();
      setStudents(studentsResponse);
      const placedCount = studentsResponse.filter(
        (student) => student.placed === "Yes"
      ).length;
      setPlacedCount(placedCount);
      const studentCount = studentsResponse.length;
      setStudentCount(studentCount);
    };

    fetchData();
  }, []);

  const closePopup = () => {
    setSelectedCompanies([]);
    setIsPopupVisible(false);
  };

  const viewCompany = (companies) => {
    console.log("###handle### ", companies);
    setSelectedCompanies(companies);
    setIsPopupVisible(true);
  };

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      <div
        style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "20px" }}
      >
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
              <th scope="col">Company</th>
            </tr>
          </thead>
          {students.length > 0 ? (
            <tbody>
              {students.map((student, index) => (
                <tr key={student.registerNo}>
                  <td>{index + 1}</td>
                  <td>{student.registerNo}</td>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{student.cgpa}</td>
                  <td>{student.email}</td>
                  <td>{student.contactNo}</td>
                  <td>{student.placed.toString()}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      disabled={
                        !student.placedCompanies ||
                        student.placedCompanies.length === 0
                      }
                      onClick={() => viewCompany(student.placedCompanies)}
                    >
                      View Companies
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <></>
          )}
        </table>
      </div>

      <div
        className="alert alert-info"
        style={{
          backgroundColor: "#FEFEFA",
          position: "sticky",
          top: "0",
          zIndex: "1",
        }}
      >
        <p style={{ fontWeight: "bold", color: "black" }}>
          Total number of students: {studentCount}
        </p>
        <p style={{ fontWeight: "bold", color: "black" }}>
          Number of students placed: {placedCount}
        </p>
      </div>

      {isPopupVisible && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Companies Placed</h5>
                <button type="button" className="close" onClick={closePopup}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Popup companies={selectedCompanies} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const Popup = ({ companies }) => {
  return (
    <ul className="list-group">
      {companies.length > 0 ? (
        companies.map((company, index) => (
          <li key={index} className="list-group-item">
            {company.companyName} : {company.designation}
          </li>
        ))
      ) : (
        <li className="list-group-item">No companies available</li>
      )}
    </ul>
  );
};

export default ViewStudents;
