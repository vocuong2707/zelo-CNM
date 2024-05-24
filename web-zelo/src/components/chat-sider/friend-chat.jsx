import {
  Box,
  Stack,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Typography,
} from "@mui/material";
import React from "react";
import { alpha, styled } from "@mui/material/styles";
import { ChatList } from "../../data/index";
import { faker } from "@faker-js/faker";
import { useGetGroupList } from "../../services/group-service";
import { useAuth } from "../../provider/authContext";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../socket";
import { useGroup } from "../../provider/GroupProvider";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ChatElement = ({ id, img, name, msg, time, unread, online }) => {

  const { id: idP } = useParams()
  const router = useNavigate()
  return (
    <Box
      onClick={() => {
        router(`/groups/${id}`)
      }}
      className="chat-element"
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: idP === id ? "#b9daf9" : "#ffffff",
      }}
      p={2}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Stack direction="row" spacing={2}>
          {" "}
          {/* hien thi anh avatar */}
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot">
              <Avatar src={img} />
            </StyledBadge>
          ) : (
            <Avatar src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2"> {name} </Typography>
            <Typography variant="caption"> {msg} </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge color="primary" badgeContent={unread}></Badge>
          {/* hien thi bao nhieu tin nhan chua doc */}
        </Stack>
      </Stack>
    </Box>
  );
};

const ChatListElement = () => {

  const { groups } = useGroup()

  return (
    <div>
      {groups?.map((chat) => (
        <ChatElement
          key={chat._id}
          id={chat._id}
          img={chat.avatar}
          name={chat.name}
          msg={""}
          online={false}
          time={""}
          unread={0}
        />
      ))}
    </div>
  );
};

export default ChatListElement;
