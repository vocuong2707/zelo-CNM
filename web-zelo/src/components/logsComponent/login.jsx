import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import axiosInstance from "../../configs/axios-conf";
import { useAuth } from "../../provider/authContext";
import { Checkbox } from "antd";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [errors, setErrors] = useState({});
  const [failLogin, setFailLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State để lưu trạng thái của checkbox
  const { setUser } = useAuth({});

  useEffect(() => {
    // Kiểm tra nếu đã lưu token trong localStorage và rememberMe được check
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken && rememberMe) {
      setToken(storedToken); // Set token từ localStorage
      navigate("/home");
    }
  }, [rememberMe, setToken, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: "" });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe); // Toggle trạng thái của checkbox
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { email, password } = formData;

    const errors = {};
    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Please enter a password.";
    }

    if (Object.keys(errors).length === 0) {
      axiosInstance
        .post("/auth/login", {
          email: email,
          password: password,
        })
        .then((response) => {
          const accessToken = response.data.data.accesstoken;
          setToken(accessToken);

          if (rememberMe) {
            localStorage.setItem("token", accessToken);
            localStorage.setItem("user", JSON.stringify(response.data.data));
          }
          setUser(JSON.stringify(response.data.data));
          navigate("/home");
        })
        .catch((error) => {
          console.log(error);
          setFailLogin(true);
        });
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="form-container sign-in">
      <form onSubmit={handleFormSubmit}>
        <h1>Sign In</h1>
        <span>or use your email and password</span>
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
            className={errors.password ? "error" : ""}
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
            name="togglePasswordVisibility"
            tabIndex="0"
          >
            {showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
          </span>
        </div>
        {errors.password && <p className="error-message">{errors.password}</p>}
        <Checkbox onChange={handleRememberMe}>Remember me</Checkbox>{" "}
        {/* Sử dụng onChange để xử lý sự kiện */}
        <a href="#">Forget Your Password?</a>
        {failLogin && (
          <p className="error-message">Email or password is incorrect!</p>
        )}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;
