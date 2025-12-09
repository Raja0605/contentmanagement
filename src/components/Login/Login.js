import React, { useEffect, useState } from "react";
import LoginService from "./LoginService";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaUserAlt } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";

const Login = ({ onLoginSuccess }) => {
  const [login, setLogin] = useState({
    emailId: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await LoginService.userLogin(login);
      console.log(response.data);
      
      if (response.data.status === "Success") {
        Swal.fire({
          title: "Welcome Back!",
          text: "You have successfully logged in.",
          icon: "success",
          confirmButtonText: "OK",
        });
        
        localStorage.setItem("userId", response?.data?.userId);
        localStorage.setItem("ad-or-firstname", response?.data?.firstName);
        localStorage.setItem("ad-or-lastname", response?.data?.lastName);
        
        if (response?.data?.roleId === 1) {
          onLoginSuccess();
          navigate("/dashboard");
        } else {
          navigate("/userQuiz");
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      Swal.fire({
        title: "Sorry!",
        text: "Invalid credentials.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setErrorMessage("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
    
    setLogin({
      emailId: "",
      password: "",
    });
  };

  const location = useLocation();
  const [paramValue, setParamValue] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const param = queryParams.get("param");
    localStorage.setItem("contentId", param);
    setParamValue(param);
  }, [location]);

  return (
    <div style={styles.page} className="page">
      <div style={{ width: "100%", display: "flex" }}>
        <h1 className="contents">CONTENT MANAGEMENT SYSTEM</h1>
        <div style={styles.container} className="container">
          <h2 style={styles.heading}>
            <p className="log">
              <img src="final.jpg" alt="loading.." className="image" /> Login
            </p>
          </h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup} className="input">
              <label htmlFor="emailId" style={styles.label}>Email:</label>
              <input
                className="input"
                type="text"
                id="emailId"
                name="emailId"
                value={login.emailId}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your email"
                required
              />
              <FaUserAlt className="icon" />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password:</label>
              <input
                className="inputs"
                type="password"
                id="password"
                name="password"
                value={login.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your password"
                required
              />
              <IoIosLock className="ioIosLock" />
            </div>
            <button
              type="submit"
              className="button"
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            {errorMessage && <p style={styles.error}>{errorMessage}</p>}
          </form>
          <p style={styles.reg}>
            Don't have an account? <Link to="/registrationForm" className="reg">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  container: {
    backgroundColor: "transparent",
    maxWidth: "400px",
    margin: "80px auto",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    marginBottom: "20px",
    color: "#343a40",
    display: "flex",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    overflow: "clip",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#495057",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ced4da",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "20px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "40px",
  },
  reg: {
    marginTop: "20px",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default Login;
