import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Checkbox, Menu } from "antd";
import { BiSolidTag } from "react-icons/bi";

const tagStyle = { paddingTop: "5px", fontSize: "1rem" };

function DropdownInTabs() {
  const items1 = [
    {
      label: (
        <Checkbox onChange={() => {}}>
          {" "}
          <BiSolidTag color="red" style={tagStyle} /> Khách hàng
        </Checkbox>
      ),
      key: "0",
    },
    {
      label: (
        <Checkbox onChange={() => {}}>
          {" "}
          <BiSolidTag color="blue" style={tagStyle} /> Gia đình
        </Checkbox>
      ),
      key: "1",
    },
    {
      label: (
        <Checkbox onChange={() => {}}>
          {" "}
          <BiSolidTag color="pink" style={tagStyle} /> Công việc
        </Checkbox>
      ),
      key: "2",
    },
    {
      label: (
        <Checkbox onChange={() => {}}>
          {" "}
          <BiSolidTag color="yellow" style={tagStyle} /> Bạn bè
        </Checkbox>
      ),
      key: "3",
    },
    {
      label: (
        <Checkbox onChange={() => {}}>
          {" "}
          <BiSolidTag color="green" style={tagStyle} /> Trả lời sau
        </Checkbox>
      ),
      key: "4",
    },
    {
      label: (
        <Checkbox onChange={() => {}}>
          {" "}
          <BiSolidTag color="brown" style={tagStyle} /> Đồng nghiệp
        </Checkbox>
      ),
      key: "5",
    },
    {
      type: "divider",
      key: "divider",
    },
    {
      label: "Quản lý thẻ phân loại",
      key: "6",
    },
  ];

  const items2 = [
    {
      label: "Đánh dấu đã đọc",
      key: "7",
    },
    {
      type: "divider",
      key: "8",
    },
    {
      label: "Trở lại giao diện cơ bản",
      key: "9",
    },
  ];

  return (
    <div style={{ marginRight: "10px", float: "left", display: "flex" }}>
      <div className="hoverLightGray" style={{ borderRadius: "50px" }}>
        <Dropdown
          overlay={
            <Menu>
              {items1.map((item) => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
            </Menu>
          }
          trigger={["click"]}
          overlayStyle={{ fontSize: "10px" }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space size={5} style={{ color: "black" }}>
              {" "}
              Phân loại
              <DownOutlined style={{ fontSize: "10px", color: "black" }} />{" "}
            </Space>
          </a>
        </Dropdown>
      </div>

      <div
        className="hoverLightGray"
        style={{
          borderRadius: "50px",
          width: "2rem",
          height: "2rem",
          marginLeft: "10px",
          textAlign: "center",
        }}
      >
        <Dropdown
          overlay={
            <Menu>
              {items2.map((item) => (
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
              ))}
            </Menu>
          }
          placement="bottom"
          trigger={["click"]}
          arrow={{ pointAtCenter: true }}
          overlayStyle={{ fontSize: "16px" }}
          dropdownClassName="custom-dropdown"
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space size={10} style={{ fontWeight: "bolder" }}>
              ...
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
}

export default DropdownInTabs;
