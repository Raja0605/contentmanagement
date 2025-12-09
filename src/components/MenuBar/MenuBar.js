import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUsers, FaHistory } from 'react-icons/fa';
import { MdSettings } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import './MenuBar.css';
import Swal from 'sweetalert2';

const MenuBar = ({ onLogout }) => {

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
  return (
    <nav className="menu-bar">
      <img src="cmslogo.jpg" alt="loding.." className="menuimage" />
      <ul>
        <li>
          <NavLink to="/dashboard" activeClassName="active">
            <MdDashboard className="icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/user" activeClassName="active">
            <FaUsers className="icon" /> User
          </NavLink>
        </li>
        <li>
          <NavLink to="/management" activeClassName="active">
            <MdSettings className="icon" /> Management
          </NavLink>
        </li>
        <li>
          <NavLink to="/userHistory" activeClassName="active">
            <FaHistory className="icon" /> User History
          </NavLink>
        </li>
        <li onClick={handleLogout} className='logout'>

          <FiLogOut className="icon" /> Logout

        </li>
      </ul>
    </nav>
  );
};

export default MenuBar;
