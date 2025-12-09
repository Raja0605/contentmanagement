import React, { useState } from 'react';
import './RegistrationForm.css';
import UserService from './UserService';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt } from "react-icons/fa";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '', 
    password: '',
    contactNo: '',
    address1: '',                                              
    address2: '',
    city: '',
    state: '',
    pincode: '',
    roleId: 2, // Default Role ID
    status: 1, // Automatically set status as 1
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const nameRegex = /^[a-zA-Z]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!formData.firstName || !nameRegex.test(formData.firstName)) {
      newErrors.firstName = 'Enter a valid First Name (only letters)';
      isValid = false;
    }
    if (!formData.lastName || !nameRegex.test(formData.lastName)) {
      newErrors.lastName = 'Enter a valid Last Name (only letters)';
      isValid = false;
    }
    if (!formData.emailId || !emailRegex.test(formData.emailId)) {
      newErrors.emailId = 'Enter a valid Email';
      isValid = false;
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    if (!formData.contactNo || !phoneRegex.test(formData.contactNo)) {
      newErrors.contactNo = 'Enter a valid 10-digit contact number';
      isValid = false;
    }
    if (!formData.address1) {
      newErrors.address1 = 'Address Line 1 is required';
      isValid = false;
    }
    if (!formData.city || !nameRegex.test(formData.city)) {
      newErrors.city = 'Enter a valid City Name';
      isValid = false;
    }
    if (!formData.state || !nameRegex.test(formData.state)) {
      newErrors.state = 'Enter a valid State Name';
      isValid = false;
    }
    if (!formData.pincode || !pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit Pincode';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await UserService.createUser(formData);
      alert('User registered successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        emailId: '',
        password: '',
        contactNo: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        pincode: '',
        roleId: 2,
        status: 1, // Ensuring status remains 1
      });
      setErrors({});
      navigate('/login');
    } catch (err) {
      alert('Failed to register. Please try again.');
    }
  };

  return (
   <div className='wholepa'>
   
    <div className='regparentpage'>
      <div className='regsubpage'>
      <form onSubmit={handleSubmit} className='myform'>
      <h2 className='formtitle'>Sign Up</h2>
        <div className='fields'>
          <div className='fn'>
          <label htmlFor="firstName">First Name:</label>
              <input type='text' id='firstName' name='firstName' className='box' placeholder='Enter your FirstName' value={formData.firstName} onChange={handleChange} />
              {errors.firstName && <p className='error'>{errors.firstName}</p>}
          </div>
          <div className='fn'>
          <label htmlFor="lastName">Last Name:</label>
              <input type='text' id='lastName' name='lastName' className='box' placeholder='Enter your LastName' value={formData.lastName} onChange={handleChange} />
              {errors.lastName && <p className='error'>{errors.lastName}</p>}
          </div>

        </div>
        <div className='fields'>
          <div className='fn'>
          <label htmlFor="emailId">Email ID:</label>
              <input type='text' id='emailId' name='emailId' placeholder='Enter your Email' className='box' value={formData.emailId} onChange={handleChange} />
              {errors.emailId && <p className='error'>{errors.emailId}</p>}
          </div>
          <div className='fn'>
          <label htmlFor="password">Password:</label>
              <input type='password' id='password' name='password' className='box' placeholder='Enter your Password' value={formData.password} onChange={handleChange} />
              {errors.password && <p className='error'>{errors.password}</p>}

          </div>

        </div>
        <div className='fields'>
          <div className='fn'>
          <label htmlFor="contactNo">Contact No:</label>
              <input type='text' id='contactNo' name='contactNo' placeholder='Enter your Mobile' className='box' value={formData.contactNo} onChange={handleChange} />
              {errors.contactNo && <p className='error'>{errors.contactNo}</p>}

          </div>
          <div className='fn'>
          <label htmlFor="address1">Address Line 1:</label>
              <input type='text' id='address1' name='address1' className='box' placeholder='Enter your Address1' value={formData.address1} onChange={handleChange} />
              {errors.address1 && <p className='error'>{errors.address1}</p>}

          </div>

        </div>
        <div className='fields'>
          <div className='fn'>
          <label htmlFor="address2">Address Line 2:</label>
          <input type='text' id='address2' name='address2' className='box' placeholder='Enter your Address2(optional)' value={formData.address2} onChange={handleChange} />

          </div>
          <div className='fn'>
          <label htmlFor="city">City:</label>
              <input type='text' id='city'  name='city' placeholder='Enter your City' className='box' value={formData.city} onChange={handleChange} />
              {errors.city && <p className='error'>{errors.city}</p>}

          </div>

        </div>
        <div className='fields'>
          <div className='fn'>
          <label htmlFor="state">State:</label>
              <input type='text' id='state'  name='state' placeholder='Enter your State' className='box' value={formData.state} onChange={handleChange} />
              {errors.state && <p className='error'>{errors.state}</p>}

          </div>
          <div className='fn'>
          <label htmlFor="pincode">Pincode:</label>
              <input type='text' id='pincode' name='pincode' placeholder='Enter your Pincode' className='box' value={formData.pincode} onChange={handleChange} />
              {errors.pincode && <p className='error'>{errors.pincode}</p>}

          </div>

        </div>
        <button type='submit' className='submitbtn'>Submit</button>
        </form>

      </div>

    </div>
   </div>
  );
};

export default RegistrationForm;
