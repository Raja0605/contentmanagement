import React, { useEffect, useState } from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';
import UserService from './UserService';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { MdManageSearch  } from "react-icons/md";


const User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchbar, setSearchbar] = useState('');
  const navigate = useNavigate();

  // Fetch all users
  const handleShowUsers = async () => {
    try {
      const response = await UserService.fetchAllUsers();
      localStorage.setItem("totaluser",response?.data?.userDTO.filter(users=>users.roleId==2)?.length||0)
      if (response.data && response.data.userDTO) {
        setUsers(response.data.userDTO);
        
      } else {
        setError('Unexpected response format from the server.');
      }
    } catch (err) {
      setError('Error while fetching users.');
    }
    
  };

  useEffect(() => {
    handleShowUsers();
  }, []);

  // Navigate to Registration Form
  const handleRegistrationForm = () => {
    navigate('/registrationform');
  };

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    ['userId', 'firstName', 'lastName', 'emailId']
      .some((key) => user[key]?.toString().toLowerCase().includes(searchbar.toLowerCase()))
  );


  return (
    <div className="user-container">
      {/* Back Button */}
      <div className="back-btn" onClick={() => navigate(-1)}>
        <IoArrowBackCircleSharp className="back-icon" />
      </div>

      {/* Search Bar & Add User */}
      <div className="user-header">
      
        <input
        
          className="search-bar"
          type="text"
          placeholder="Search users..."
          value={searchbar}
          onChange={(e) => setSearchbar(e.target.value)}
          
        />
        <MdManageSearch className='search-icons'/>
        
        <button onClick={handleRegistrationForm} className="adduser">Add User</button>
      </div>

      {/* User Table */}
      <div className="user-table-container">
        {error && <div className="error-message">{error}</div>}
        <table className="user-table">
          <thead>
            <tr>
              <th>User Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Status</th>
              <th>Contact Number</th>
              <th>Address1</th>
              <th>Address2</th>
              <th>City</th>
              <th>State</th>
              <th>Pincode</th>
              <th>Created At</th>
              <th>Role Id</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.emailId}</td>
                  <td>{user.password}</td>
                  <td>
                    <span className={user.status ? "active-dot" : "inactive-dot"}></span>
                    {user.status ? 'Active' : 'Inactive'}
                  </td>
                  <td>{user.contactNo}</td>
                  <td>{user.address1}</td>
                  <td>{user.address2}</td>
                  <td>{user.city}</td>
                  <td>{user.state}</td>
                  <td>{user.pincode}</td>
                  <td>{new Date(user.created_At).toLocaleString()}</td>
                  <td>{user.roleId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="14" className="no-data">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
