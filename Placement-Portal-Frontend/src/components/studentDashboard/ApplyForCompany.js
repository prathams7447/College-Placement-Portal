import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCompany, applyForInterview, getAppliedCompanyForGivenStudent } from '../../service';
import { mainstore } from '../../BaseModal';

const ApplyForCompany = observer(() => {
  const [companies, setCompanies] = useState([]);
  const [appliedComp, setAppliedCompanies] = useState([]);

  useEffect(() => {
    mainstore.initialize();
    const fetchData = async () => {
      const companyData = await getCompany();
      setCompanies(companyData);
      const appliedCompanies = await getAppliedCompanyForGivenStudent(mainstore.userInfo.username);
      setAppliedCompanies(appliedCompanies.map(comp => comp.companyId)); // Assuming this returns an array of company IDs
      console.log("######", companyData);
    };

    fetchData();
  }, []);

  const handleApply = async (companyId) => {
    try {
      const response = await applyForInterview({ studentReg: mainstore.userInfo.username, companyId: companyId }); // Endpoint to apply for the interview
      if (response.toLowerCase().includes("error")) {
        console.error('Error applying for interview:', response);
      } else {
        // Update the local state to reflect the applied status
        setCompanies(prevCompanies =>
          prevCompanies.map(company =>
            company.companyId === companyId ? { ...company, status: 'Applied' } : company
          )
        );
        setAppliedCompanies(prevApplied => [...prevApplied, companyId]); // Update the applied companies list
      }
    } catch (error) {
      console.error('Error applying for interview:', error);
    }
  };

  return (
    <div className="container" style={{ marginTop: '5rem' }}>
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
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.companyId}>
                <td>{company.companyId}</td>
                <td>{company.companyName}</td>
                <td>{company.designation}</td>
                <td>{company.date}</td>
                <td>{company.time}</td>
                <td>{company.status}</td>
                <td>
                  {appliedComp.includes(company.companyId) ? (
                    <span className="text-success">Applied</span>
                  ) : (
                    company.status === 'Scheduled' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApply(company.companyId)}
                      >
                        Apply
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ApplyForCompany;
