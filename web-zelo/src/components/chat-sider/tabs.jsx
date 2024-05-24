import React from "react";
import { Tabs } from "antd";
import DropdownInTabs from "./dd-intabs";
import { Box, Stack } from "@mui/material"; // Import necessary components from MUI
import ChatElement from "./friend-chat"; // Import ChatElement component

const operations = <DropdownInTabs />;

const items = [
  {
    label: "All",
    key: "all",
    children: (
      <Stack
        direction="column"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "90vh",
        }}
      >
        <ChatElement />
      </Stack>
    ),
  },
  {
    label: "Not read",
    key: "notRead",
    children: "Chats",
  },
];

const ChatSiderTabs = () => {
  return (
    <Tabs tabBarExtraContent={operations} tabBarGutter={12}>
      {items.map((item) => (
        <Tabs.TabPane

          tab={
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "0 12px"
              }}
            >
              {item.label}
            </span>
          }
          key={item.key}
        >
          {item.children}
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default ChatSiderTabs;
