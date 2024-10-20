import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { getPlacedCompanyForGivenStudent } from "../../service";

const ViewPlacedCompanies = observer(() => {
  const [comapny, setComapny] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const company = await getPlacedCompanyForGivenStudent();
      setComapny(company);
      console.log("######", company);
    };

    fetchData();
  }, []);

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      <h2 className="text-center mb-4">Companies Placed</h2>
      <div
        style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "20px" }}
      >
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Company Id</th>
              <th scope="col">Company Name</th>
              <th scope="col">Designation</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {comapny.map((comapny, index) => (
              <tr key={comapny.companyId}>
                <td>{comapny.companyId}</td>
                <td>{comapny.companyName}</td>
                <td>{comapny.designation}</td>
                <td>{comapny.date}</td>
                <td>{comapny.time}</td>
                <td>{comapny.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ViewPlacedCompanies;
