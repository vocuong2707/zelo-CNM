import { Box, Stack } from "@mui/material";
import React from "react";
import { Chat_History } from "../../data";
import { TextMsg, Timeline, MediaMsg, ReplyMsg, LinkMsg, DocMsg } from "./MsgTypes";

const Message = () => {
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((el) => {
          switch (el.type) {
            case "divider":
              //Timeline
              return <Timeline el={el} />;

            case "msg":
              switch (el.subtype) {
                case "img":
                  //ims message
                  return <MediaMsg el={el} />;

                case "doc":
                  //Doc message
                  return <DocMsg el={el} />;
                  
                case "link":
                  //link message
                  return <LinkMsg el={el} />;

                case "reply":
                  //reply message
                  return <ReplyMsg el={el} />;
                  
                default:
                  //text msg
                  return <TextMsg el={el} />;
              }
              break;

            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};

export default Message;
