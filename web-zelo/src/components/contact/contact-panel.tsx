import { Stack, Typography } from "@mui/material";
import React from "react";
import FriendsPanel from "./friends-panel";
import RequestPanel from "./request-panel";

interface ContactPanelProps {
  index: number;
}

const ContactPanel = ({ index }: ContactPanelProps) => {
  if (index === 1) {
    return <FriendsPanel />;
  }

  return <RequestPanel />;
};

export default ContactPanel;
