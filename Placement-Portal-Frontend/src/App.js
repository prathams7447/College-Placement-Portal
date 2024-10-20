import './App.css';
import React, { useEffect }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header'; // Import your Header component
import Footer from './Footer'; // Import your Footer component
import Login from './components/Login';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import StudentDashboard from './components/studentDashboard/StudentDashboard';
import StudentForm from './components/adminDashboard/StudentForm';
import ScheduleInterview from './components/adminDashboard/ScheduleInterview';
import ViewStudents from './components/adminDashboard/ViewStudents';
import ViewInterviewSheduled from './components/adminDashboard/ViewInterviewSheduled';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import { mainstore } from './BaseModal';

const App = () => {

  useEffect(() => {
    const fetchData = async () => {
      await mainstore.initialize();
    }
    fetchData();
    
  }, []);


  return (
    <Router>
      <div id="app">
        <Header />
        <main>
          <Routes>
          <Route path="/" element={<HomePage/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/studentForm" element={<StudentForm />} />
            <Route path="/sheduleInterview" element={<ScheduleInterview />} />
            <Route path="/viewStudent" element={<ViewStudents />} />
            <Route path="/viewInterviews" element={<ViewInterviewSheduled />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
