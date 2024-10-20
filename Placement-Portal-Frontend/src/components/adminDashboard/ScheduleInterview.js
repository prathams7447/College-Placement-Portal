import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addInterview } from '../../service';
import { observer } from 'mobx-react-lite';

const ScheduleInterview = observer( ({ onClose, onStatus }) => {
  const [formData, setFormData] = useState({
    companyId: '',
    companyName: '',
    designation: '',
    date: new Date(),
    time: '10:00 AM'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = await addInterview(formData);
    onStatus(status);
    onClose();
  };

  return (
    <div className="modal-content" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="modal-header">
        <h5 className="modal-title" style={{ flex: 1, textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: '1.5rem', marginTop: '0.5rem' }}>
          Schedule Interview
        </h5>
      </div>
      <div className="modal-body" style={{ height: 'auto' }}>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key} style={{ fontWeight: 'bold' }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              {key === 'date' ? (
                <div>
                <DatePicker 
                  selected={formData.date} 
                  dateFormat="dd-MM-yyyy"
                  onChange={handleDateChange} 
                  className="form-control" 
                  placeholderText="Select date"
                /></div>
              ) : (
                <input
                  type={key === 'email' ? 'email' : 'text'}
                  className="form-control"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                  style={{ fontWeight: 'bold' }}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              )}
            </div>
          ))}
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-success" type="submit">Submit</button>
            <button className="btn btn-danger" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ScheduleInterview;
