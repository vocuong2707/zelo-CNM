import React, { useState } from "react";
import { Input, Space, Typography, Button } from "antd";
import { useAuth } from "../../provider/authContext";
import axiosInstance from "../../configs/axios-conf";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

const Verify = () => {
  const { setUser, setToken } = useAuth();
  const [isError, setIsError] = useState(false);
  const [code, setCode] = useState("");

  const onChange = (text) => {
    setCode(text);
  };

  const sharedProps = {
    onChange,
  };

  const onSubmit = () => {
    let user = localStorage.getItem("user");
    const verifyCode = localStorage.getItem("verifyCode");
    user = JSON.parse(user.toString());

    const infoPost = {
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      photoUrl: "",
      dateOfBirth: Date.now(),
      gender: "male",
    };

    if (code === verifyCode) {
      setUser(localStorage.getItem("user"));
      axiosInstance
        .post("/auth/register", infoPost)
        .then((response) => {
          const accessToken = response.data.data.accesstoken;
          setToken(accessToken);
          setUser(response.data.data);
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(response.data.data));
          setIsError(false);
          localStorage.removeItem("verifyCode");
          localStorage.removeItem("code");
          localStorage.removeItem("rememberMe");
          navigate("/home");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setIsError(true);
    }
  };

  const formStyle = {
    minWidth: "500px", // Đặt chiều rộng tối thiểu cho form
    minHeight: "500px",
    margin: "auto", // Đưa form vào giữa trang
    padding: "20px", // Thêm padding cho form
    backgroundColor: "#f0f2f5", // Màu nền cho form
    borderRadius: "20px", // Bo tròn các cạnh của form
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Đổ bóng cho form
    display: "flex", // Sử dụng flexbox
    flexDirection: "column", // Căn nội dung theo chiều dọc
    justifyContent: "center", // Căn giữa nội dung theo chiều dọc
    textAlign: "center", // Căn giữa nội dung trong form
  };

  const containerStyle = {
    display: "flex", // Sử dụng flexbox
    justifyContent: "center", // Căn giữa form theo chiều ngang
    minHeight: "100vh", // Chiều cao tối thiểu bằng chiều cao của viewport
    alignItems: "center", // Căn giữa form theo chiều dọc
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <Space direction="vertical" size="middle" align="center">
          <Title level={5}>Please enter the code here!</Title>
          <Input.OTP
            value={code}
            length={4}
            formatter={(str) => str.toUpperCase()}
            onChange={onChange}
            style={{ borderRadius: "4px" }}
          />
          {isError && <p className="error-message">{"Code incorrect"}</p>}
          <Button type="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Verify;
