import React from 'react';
import './Logout.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Logout = ({ onLogout }) => {
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Logged Out!", "You have been successfully logged out.", "success");
        onLogout(); // Call the logout function passed as a prop
      }
    });
  };
  

  const logoutnavi=useNavigate();
  
  const handleLogoutCancel=()=>{
    logoutnavi('/dashboard');
  };

  return (
    <div className='logout-window'>
      <p>Are you sure you want to Log Out ?</p>
      <button className='logout-btn' onClick={handleLogoutCancel}>Cancel</button>
      <button className='logout-btn' onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
