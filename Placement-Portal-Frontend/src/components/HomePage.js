import React from 'react';
import { Link } from 'react-router-dom';
import collegeLogo from '../images/homeimg_1.png';
import { observer } from 'mobx-react-lite';


const HomePage =  observer(() => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center" style={{ marginBottom: "250px" }}>
          <div className="col-md-9 text-center">
            <h1 style={{ color: "yellow" }}>Welcome to Placement Portal</h1>
            <p className="lead" style={{ color: "black", fontWeight: "bold", fontSize: "30px" }}>
              Connect with top recruiters and discover exciting career opportunities. Our portal is designed to streamline the placement process, making it easier for students to find their dream jobs and for companies to find the best talent. Start your journey with us today and unlock a world of possibilities.
            </p>
          </div>
        </div>
        
      </div>
      <div className="position-absolute" style={{ bottom: '100px', width: '100%', textAlign: 'center' }}>
        <img src={collegeLogo} alt="College Logo" style={{ maxWidth: '500px' }} />
      </div>
    </div>
  );
});

export default HomePage;
