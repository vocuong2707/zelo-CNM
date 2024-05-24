import React, { useState } from "react";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import axiosInstance from "../../configs/axios-conf";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    const errors = {};
    if (!name) {
      errors.name = "Please enter your name.";
    }
    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Please enter a password.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    } else if (!/^[A-Z]/.test(password)) {
      errors.password = "Password must start with a capital letter [A-Z]";
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const userInfo = {
        fullname: name,
        email: email,
        password: password,
      };

      axiosInstance
        .post("/auth/verification", userInfo)
        .then((response) => {
          setIsLoading(false);
          const code = response.data.data.code;
          console.log(code);
          localStorage.setItem("verifyCode", code);
          localStorage.setItem("user", JSON.stringify(userInfo));
          navigate("/verify");
        })
        .catch((error) => {
          console.log(error.message);
          setNotification(error.response.data.message);
          setIsLoading(false);
        });
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="form-container sign-up">
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <form onSubmit={handleFormSubmit}>
          <h1>Create Account</h1>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error" : ""}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          <div className="pwStyle" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
            </span>
          </div>
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
          <div className="pwStyle" style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
          {notification ? <p className="error-message">{notification}</p> : ""}
          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
}

export default Register;
