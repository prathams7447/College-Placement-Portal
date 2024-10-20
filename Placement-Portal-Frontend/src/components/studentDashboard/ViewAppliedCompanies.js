import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAppliedCompanyForGivenStudent } from '../../service';

const ViewAppliedCompanies = observer(() => {
  const [comapny, setComapny] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const company = await getAppliedCompanyForGivenStudent();
      setComapny(company);
      console.log("######",company)

    };

    fetchData();
  }, []);



  return (
    
    <div className="container" style={{ marginTop: '5rem' }}>
        <h2 className="text-center mb-4">Applied Companies</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Company Id</th>
              <th scope="col">Company Name</th>
              <th scope="col">Designation</th>
            </tr>
          </thead>
          <tbody>
            {comapny.map((comapny, index) => (
              <tr key={comapny.companyId}>
                <td>{comapny.companyId}</td>
                <td>{comapny.companyName}</td>
                <td>{comapny.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      
    </div>
  );
});



export default ViewAppliedCompanies;
