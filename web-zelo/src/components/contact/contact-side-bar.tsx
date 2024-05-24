import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import SearchForm from "../chat-sider/searchForm";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

interface ContactSideBarProps {
  tab: number;
  onChangeTab: (tab: number) => void;
}

const ContactSideBar = ({ tab, onChangeTab }: ContactSideBarProps) => {
  const siderStyle = {
    color: "black",
    backgroundColor: "white",
    borderRight: "1px solid lightgray",
  };

  return (
    <Sider width={"20%"} style={siderStyle}>
      <SearchForm />
      <Divider sx={{ marginTop: "16px" }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton selected={tab === 1} onClick={() => onChangeTab(1)}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="List friends" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton selected={tab === 2} onClick={() => onChangeTab(2)}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Friend request" />
          </ListItemButton>
        </ListItem>
      </List>
    </Sider>
  );
};

export default ContactSideBar;
