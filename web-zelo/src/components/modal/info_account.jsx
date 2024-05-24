import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Upload,
  message,
  Avatar,
  Button,
} from "antd";
import { UserOutlined, EditOutlined, CameraOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useAuth } from "../../provider/authContext";
import axiosInstance from "../../configs/axios-conf";
import dayjs from 'dayjs';
import { format } from 'date-fns'
const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CenteredRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoAccountModal = ({ visible, onCancel }) => {
  const [componentDisabled, setComponentDisabled] = useState(true);
  const [imageUrl, setImageUrl] = useState();
  const hiddenFileInput = useRef(null);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  let { user, setUser, setToken } = useAuth();
  const fullname = typeof user === "object" ? user.fullname : JSON.parse(user).fullname
  const userId = typeof user === "object" ? user.id : typeof user === "object" ? user.id : JSON.parse(user).id
  const gender = typeof user === "object" ? user.gender : JSON.parse(user).gender
  const dateOfBirth = typeof user === "object" ? user.dateOfBirth : JSON.parse(user).dateOfBirth
  const photoUrl = typeof user === "object" ? user.photoUrl : JSON.parse(user).photoUrl

  const [formData, setFormData] = useState({
    fullname: fullname,
    gender: gender,
  });
  if (typeof user === 'object') {
    console.log('User is already an object.');
  } else if (typeof user === 'string') {
    // Check if the string is a JSON representation of an object
    if (user.trim().startsWith('{') && user.trim().endsWith('}')) {
      try {
        user = JSON.parse(user);
        console.log('User was parsed successfully.');
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    } else {
      console.log('User is not a JSON representation of an object.');
    }
  } else {
    console.error('User is neither a string nor an object.');
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!beforeUpload(file)) {
        return;
      }
      getBase64(file, (url) => {
        setImageUrl(url);
      });
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handlePreview = async () => {
    if (!imageUrl) {
      return;
    }
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const toggleFormDisable = () => {
    setComponentDisabled(!componentDisabled);
  };

  const uploadButton = (
    <Button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
      onClick={() => hiddenFileInput.current.click()}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: 8 }}>
          <CameraOutlined />
        </div>
        <div>Upload</div>
      </div>
    </Button>
  );

  const handleSaveTest = () => {
    // Khi người dùng nhấp vào nút "Save", kích hoạt sự kiện click của input file ẩn
    hiddenFileInput.current.click();
  };
  const handleSave = async (event) => {
    const imageUrl = event.target.files?.[0];

    try {
      const formData = new FormData();
      formData.append("file", imageUrl);

      // Gọi API để cập nhật ảnh đại diện
      const res = (await axiosInstance.post(`/users/upload/${userId}`, formData,
        {
          headers: {
            "content-type": "multipart/form-data"
          }
        }
      )).data;

      // Nếu cập nhật thành công, cập nhật ảnh đại diện trong state và đóng modal
      setUser({ ...user, photoUrl: res.fileUrl });

      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, photoUrl: res.fileUrl })
      );
      // onCancel();
      //message.success("Avatar updated successfully!");
    } catch (error) {
      console.log(error)
      message.error("Failed to update avatar. Please try again later.");
    } finally {
      hiddenFileInput.current.value = null
    }
  };
  const handleSaveProfile = async () => {
    try {
      // Gọi API để cập nhật ảnh đại diện
      await axiosInstance.put("/auth/updateProfile", {
        email: user.email,
        fullname: formData.fullname,
        gender: formData.gender,
        selectedDate: formData.selectedDate,
        photoUrl: photoUrl
      });
      // Nếu cập nhật thành công, cập nhật ảnh đại diện trong state và đóng modal
      setUser({
        ...user, fullname: formData.fullname,
        gender: formData.gender,
        selectedDate: formData.selectedDate
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user, fullname: formData.fullname,
          gender: formData.gender,
          selectedDate: formData.selectedDate
        })
      );
      onCancel();
      message.success("Updated successfully!");
    } catch (error) {
      message.error("Failed to update avatar. Please try again later.");
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: "" });
  };
  const handleChangeDate = (date) => {
    const dateString = date;
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Cần thêm 1 vào tháng vì phương thức getMonth() trả về tháng bắt đầu từ 0
    const day = String(dateObject.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Cập nhật trạng thái của formData với chuỗi ngày mới
    setFormData({ ...formData, selectedDate: formattedDate });
  };
  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Thông tin tài khoản</div>}
      placement="right"
      closable={true}
      onClose={onCancel}
      visible={visible}
      footer={null}
      onCancel={onCancel}
    >
      <>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
        >
          <img src="/pexels-photo-1535907.jpeg" alt="Cover Photo" style={{ width: '100%', marginBottom: 5 }}/>
          <Form.Item style={{ marginBottom: 20 }}>
            <CenteredRow>
              <div className="avatar-uploader" onClick={handlePreview}>
                <Avatar
                  size={75}
                  icon={
                    imageUrl || (user && user.photoUrl) ? (
                      <AvatarImage
                        src={imageUrl ? imageUrl : user.photoUrl}
                        alt="avatar"
                      />
                    ) : (
                      <UserOutlined />
                    )
                  }
                />
                {imageUrl ? null : <div className="upload-text"></div>}
              </div>
              {uploadButton}
              {/* <Button
                type="default"
                htmlType="submit"
                style={{ marginLeft: 10 }}
                onClick={handleSaveTest}
              >
                Save
              </Button> */}
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleSave}
                ref={hiddenFileInput}
                style={{ display: "none" }}
              />
            </CenteredRow>
          </Form.Item>

          <Form.Item
            label="Tên"
            style={{ marginBottom: 20 }}

          >
            <Input readOnly={componentDisabled} name="fullname" defaultValue={fullname}
              onChange={handleChange} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 20 }} disabled={componentDisabled}>
            <CenteredRow>
              <Form.Item label="Giới tính" style={{ marginBottom: 0 }}>
                <Radio.Group disabled={componentDisabled}
                  onChange={handleChange}
                  value={formData.gender}
                  name="gender">
                  <Radio value="male">
                    {" "}
                    Male{" "}
                  </Radio>
                  <Radio value="female">
                    {" "}
                    Female{" "}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </CenteredRow>
            <CenteredRow>
  <Form.Item label="Ngày sinh" style={{ marginBottom: 0 }}>
    <DatePicker
      defaultValue={dayjs('2002/02/19')}
      disabled={componentDisabled}
      name="selectedDate"
      onChange={handleChangeDate}
      format={"DD/MM/YY"}
    />
  </Form.Item>
</CenteredRow>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button icon={<EditOutlined />} onClick={toggleFormDisable}>
              {componentDisabled ? "Enable Form" : "Disable Form"}
            </Button>
            <Button type="default" htmlType="submit" onClick={handleSaveProfile} style={{ marginLeft: 10 }}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </>
      {/* Modal xem trước ảnh */}
      <Modal visible={previewOpen} onCancel={handleClosePreview} footer={null}>
        <AvatarImage src={previewImage} alt="avatar" />
      </Modal>
    </Modal>
  );
};

export default InfoAccountModal;
