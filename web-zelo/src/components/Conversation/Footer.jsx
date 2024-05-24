import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Stack,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  Fab,
  Tooltip,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import { alpha, styled, useTheme } from "@mui/material/styles";
import {
  MagnifyingGlass,
  VideoCamera,
  Phone,
  CaretDown,
  LinkSimple,
  Smiley,
  PaperPlaneTilt,
  Camera,
  File,
  Sticker,
  User,
  DownloadSimple,
  Image

} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useSendMessageToGroup } from "../../services/message-service";
import { useAuth } from "../../provider/authContext";
import { Link, useParams } from "react-router-dom";
import { socket } from "../../socket";
import { useUploadFile } from "../../services/user-service";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <Sticker size={24} />,
    y: 172,
    title: "Stickers",
  },
  {
    color: "#0172e4",
    icon: <Camera size={24} />,
    y: 242,
    title: "Image",
  },
  {
    color: "#0159b2",
    icon: <File size={24} />,
    y: 312,
    title: "Document",
  },
  {
    color: "#013f7f",
    icon: <User size={24} />,
    y: 382,
    title: "Contact",
  },
];

const ChatInput = ({ value, onChange, setOpenPike, uploadFile, handleSend }) => {
  const [openActions, setOpenActions] = React.useState(false);
  const hiddenFileInput = useRef(null);


  const handleSave = async (event) => {
    const file = event.target.files?.[0];
    console.log(file)
    const formData = new FormData();
    formData.append("file", file);
    uploadFile(formData, {
      onSuccess: () => {
        hiddenFileInput.current.value = null
      },
      onError: () => {
        hiddenFileInput.current.value = null
      }
    })
  }

  return (
    <>
      <input
        id="image"
        name="image"
        type="file"
        accept="*"
        onChange={handleSave}
        ref={hiddenFileInput}
        style={{ display: "none" }}
      />
      <StyledInput
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleSend();
          }
        }}
        fullWidth
        placeholder="Write a message..."
        variant="filled"
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <Stack sx={{ width: "max-content" }}>
              <Stack sx={{ position: "relative", display: openActions ? "inline-block" : "none" }}>
                {/* {Actions.map((el) => (
                  <Tooltip placement="right" title={el.title}>
                    <Fab
                      sx={{
                        position: "absolute",
                        top: -el.y,
                        backgroundColor: el.color,
                      }}
                    >
                      {el.icon}
                    </Fab>
                  </Tooltip>
                ))} */}
              </Stack>
              <InputAdornment>
                <IconButton onClick={() => {
                  hiddenFileInput.current.click();
                }}>
                  <LinkSimple />
                </IconButton>
              </InputAdornment>
            </Stack>
          ),
          endAdornment: (
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenPike((prev) => !prev);
                }}
              >
                <Smiley />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>

  );
};

const Footer = ({ onRefetch }) => {
  const { user } = useAuth()
  console.log("user", user)
  const userId = typeof user === "object" ? user.id : JSON.parse(user).id
  const username = typeof user === "object" ? user.fullname : JSON.parse(user).fullname
  const avatar = typeof user === "object" ? user.photoUrl : JSON.parse(user).photoUrl
  const { id } = useParams()
  const [message, setMessage] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const { mutate } = useSendMessageToGroup()
  const theme = useTheme();
  const [openPiker, setOpenPike] = React.useState(false);

  const { data, isPending, mutate: uploadFile, reset } = useUploadFile(userId)

  const type = fileUrl.includes(".jpg") || fileUrl.includes(".png") ? "image" : "doc"

  const handleSend = () => {
    mutate({
      from: userId,
      to: id,
      message: message + fileUrl,
    }, {
      onSuccess: () => {
        socket.emit("sendMessageGroup", {
          text: message + fileUrl,
          user: {
            _id: userId,
            name: username,
            avatar: avatar
          },
          roomId: `group-${id}`,
        });
        onRefetch()
        setMessage("")
        setFileUrl("")
        reset("")
      }
    })
  }

  useEffect(() => {
    setFileUrl(data?.fileUrl ?? "")
  }, [data])

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor: "#F8FAFF",
        boxShadowColor: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      {isPending && <Typography color="rgb(2, 96, 168)" sx={{ marginBottom: "6px" }}>Loading...</Typography>}
      {
        fileUrl && type === "image" && <img src={fileUrl} style={{ width: "100px", }} />
      }
      {
        fileUrl && type === "doc" &&
        <Link to={fileUrl}
          target="_blank">
          <Stack spacing={2}>
            <Stack
              p={2}
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
              }}
            >
              <File size={48} />
              <Typography variant="caption">file</Typography>
              <IconButton>
                <DownloadSimple />
              </IconButton>
            </Stack>
          </Stack>
        </Link>
      }

      <Stack alignItems={"center"} direction={"row"} spacing={3}>
        <Stack sx={{ width: "100%" }}>
          {/* ChatInput */}

          <Box
            sx={{
              display: openPiker ? "inline" : "none",
              zIndex: 10,
              position: "fixed",
              bottom: 81,
              right: 100,
            }}
          >
            <Picker
              theme={theme.palette.mode}
              data={data}
              onEmojiSelect={(a) => { setMessage(prev => prev + a.native) }}
            />
          </Box>

          <ChatInput setOpenPike={setOpenPike} value={message} onChange={(v) => setMessage(v)} uploadFile={uploadFile} handleSend={handleSend} />
        </Stack>
        <Box
          sx={{
            height: 48,
            width: 48,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 2,
          }}
        >
          <Stack
            sx={{ height: "100%", width: "100%" }}
            alignItems="center"
            justifyContent={"center"}
          >
            <IconButton onClick={handleSend}>
              <PaperPlaneTilt color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Footer;
