import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../service';
import { mainstore } from '../BaseModal';
import { observer } from 'mobx-react-lite';

const ForgotPassword =  observer(({onClose}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(username, password)
      const response = await forgotPassword(username, password);
      if(undefined !== response.error  || (typeof response.data === 'string' && response.includes("Error"))){
        setMessage(response.error)
      }
      else if(mainstore.is_loggedin){
        if (mainstore.userInfo !== null && mainstore.userInfo.is_admin) {
          navigate('/admin');
        } else if (mainstore.userInfo !== null && mainstore.userInfo.is_student){
          navigate('/student');
        }else{
          setMessage('Invalid username or password.');
          navigate('/login')
        }
      }else{
        navigate('/login')
      }
    } catch (error) {
      setMessage('Invalid username or password.');
    }
    onClose()
  };

  const closeMessagePopup = () => {
    setMessage('');
  };

  return (
    <div className="container mt-5">
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

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h3>Login</h3>
            </div>
            <div className="card-body text-center">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3 mx-auto text-left" style={{ width: "75%" }}>
                  <label htmlFor="username">Username</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required
                    style={{ borderColor: "black"}}
                  />
                </div>
                <div className="form-group mb-3 mx-auto text-left" style={{ width: "75%" }}>
                  <label htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    style={{ borderColor: "black" }}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-75 mb-2">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ForgotPassword;
