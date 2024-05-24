import { Layout } from "antd";
import React, { useState } from "react";
import LeftSider from "../../components/sider/left-sider";
import ContactSideBar from "../../components/contact/contact-side-bar";
import ContactPanel from "../../components/contact/contact-panel";
import { Stack } from "@mui/material";

const ContactPage = () => {
  const [tab, setTab] = useState(1);

  const handleChangeTab = (tabIndex: number) => setTab(tabIndex);

  const layoutStyle = {
    minHeight: "100vh",
  };
  return (
    <Layout style={layoutStyle}>
      <LeftSider></LeftSider>
      <ContactSideBar tab={tab} onChangeTab={handleChangeTab} />
      <ContactPanel index={tab} />
    </Layout>
  );
};

export default ContactPage;
