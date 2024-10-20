import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './city_engineer_colloge.png';
import { mainstore } from './BaseModal';
import { observer } from 'mobx-react-lite'; // Import observer

const Header = observer(() => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleHomeClick = () => {
    console.log("Home buttone clicked",mainstore.is_loggedin, mainstore.userInfo.is_student )
    if (mainstore.is_loggedin) {
      if (mainstore.userInfo.is_admin) {
        navigate('/admin');
      } else if (mainstore.userInfo.is_student) {
        navigate('/student');
      }
    } else {
      navigate('/');
    }
  };

  useEffect(() =>  {
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userinfo');
    mainstore.resetUserInfo();
    mainstore.is_loggedin = false;
    navigate('/');
  };

  // Get initials or "AD" based on role
  const getUserInitials = () => {
    if (mainstore.userInfo.is_admin) {
      return "AD"; // Admin initials
    } else if (mainstore.userInfo.first_name) {
      const initials = mainstore.userInfo.first_name.split(' ').map(name => name[0]).join('');
      return initials.substring(0, 2).toUpperCase(); // First two letters of the first name
    }
    return "";
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-dark text-white">
      <div className="logo d-flex align-items-center">
        <img src={logo} alt="Logo" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
        <h2 className="h5">City Engineering College</h2>
      </div>
      <div className="w-100 text-center" style={{ left: 0, marginRight: '1rem' }}>
        <h2 className="h4 mb-0">Placement Portal</h2>
      </div>
      <div className="d-flex align-items-center">
        <button className="btn btn-outline-light me-2" onClick={handleHomeClick}>Home</button>
        {mainstore.is_loggedin ? (
          <div className="dropdown" ref={dropdownRef}>
            <button 
              className="btn btn-light rounded-circle" 
              style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor:'lightbrown' }} 
              onClick={handleLoginClick}
            >
              <span>{getUserInitials()}</span>
            </button>
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item" onClick={handleLogoutClick}>Logout</button>
            </div>
          </div>
        ) : (
          <button className="btn btn-light" onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </header>
  );
});

export default Header;
