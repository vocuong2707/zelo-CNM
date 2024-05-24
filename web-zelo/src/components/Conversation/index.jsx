import {
  Box,
  Stack,
  useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGroup } from "../../provider/GroupProvider";
import { useAuth } from "../../provider/authContext";
import { useRecallMessage } from "../../services/message-service";
import { socket } from "../../socket";
import Footer from "./Footer";
import Header from "./Header";
import { DocMsg, MediaMsg, TextMsg } from "./MsgTypes";
import ForwardDialog from "./forward-dialog";

const Conversation = () => {
  const { user } = useAuth()
  const userId = typeof user === "object" ? user.id : JSON.parse(user).id
  const { id } = useParams()
  const { messages, refetchMessages } = useGroup()
  const { mutate } = useRecallMessage()
  const [forward, setForward] = useState(false)
  const [messageForward, setMessageForward] = useState("")
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const handleRemove = (Mgsid) => {
    mutate(Mgsid, {
      onSuccess: () => {
        socket.emit("sendMessageGroup",
          { roomId: `group-${id}` }
        )
        refetchMessages()
      }
    })
  }

  const handleForward = (msg) => {
    setMessageForward(msg)
    setForward(true)
  }

  useEffect(() => {
    socket.on("receiveMessageGroup", () => {
      refetchMessages()
    })
  }, [])

  return (
    <Stack height={"100%"} maxHeight={"100vh"} width={"auto"} sx={{
      marginRight: 0, ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }), marginRight: "320px"
      }), transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }}>
      {/* chat header */}
      <Header open={open} onClick={(value) => setOpen(value)} />
      {/* msg */}
      <Box p={3} id="your_div" sx={{
        height: "calc(100vh - 75px - 80px)",
        overflowY: "auto"
      }}>
        <Stack spacing={3} >
          <Stack width={"100%"} sx={{ flexGrow: 1, height: "100%", overflowY: "auto" }} gap={1}>
            {messages?.reverse().map(mgs => {
              if (mgs.message.trim().split(" ").length === 1 && mgs.message.includes("https://")) {
                if (mgs.message.includes(".jpg") || mgs.message.includes('.png')) {
                  return <MediaMsg key={mgs.id} el={{ incoming: mgs.sender.id !== userId, message: mgs.message }} handleRemove={() => handleRemove(mgs.id)} handleForward={() => handleForward(mgs.message)} sender={mgs.sender} createdAt={mgs.createdAt} />
                }

                return <DocMsg handleRemove={() => handleRemove(mgs.id)} handleForward={() => handleForward(mgs.message)} key={mgs.id} el={{ incoming: mgs.sender.id !== userId, message: mgs.message }} sender={mgs.sender} createdAt={mgs.createdAt} />
              }

              return <TextMsg handleRemove={() => handleRemove(mgs.id)} handleForward={() => handleForward(mgs.message)} key={mgs.id} el={{ incoming: mgs.sender.id !== userId, message: mgs.message }} sender={mgs.sender} createdAt={mgs.createdAt} />
            })
            }
          </Stack>
        </Stack></Box>
      {forward && <ForwardDialog open={forward} onClose={() => setForward(false)} messageForward={messageForward} />}

      {/* chat footer */}
      <Footer onRefetch={refetchMessages} />
    </Stack>
  );
};

export default Conversation;
