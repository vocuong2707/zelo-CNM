import { Box, Stack } from "@mui/material";
import { Layout } from "antd";
import React from "react";
import Conversation from "../../components/Conversation";
import ChatSider from "../../components/chat-sider/chat-sider";
import LeftSider from "../../components/sider/left-sider";
import GroupProvider from "../../provider/GroupProvider";
import { useParams } from "react-router-dom";

const GeneralApp = () => {
  const { id } = useParams();

  const layoutStyle = {
    minHeight: "100vh",
  };

  return (
    <GroupProvider>
      <Layout style={layoutStyle}>
        <LeftSider />
        <ChatSider />
        <Stack direction="row" sx={{ width: "100%" }}>
          {/* {tabs} */}

          <Box
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor: "#F0F4FA",
            }}>
            {/* {conversation(cuoc hoi thoai)} */}
            {id !== undefined && <Conversation />}
          </Box>
        </Stack>
      </Layout>
    </GroupProvider>
  );
};

export default GeneralApp;
