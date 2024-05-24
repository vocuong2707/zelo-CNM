import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Popover, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from 'dayjs';
import { DownloadSimple, File } from "phosphor-react";
import React from "react";
import { Link } from "react-router-dom";

const DocMsg = ({ el, handleForward, handleRemove, sender, createdAt }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const theme = useTheme();
  return (
    <Stack alignItems={el.incoming ? "start" : "end"}><Link to={el.message} target="_blank" >
      <Stack gap={1} alignItems={"end"} direction={el.incoming ? "row-reverse" : "row"} justifyContent={el.incoming ? "start" : "end"}>
        <Box
          p={1.5}
          sx={{
            backgroundColor: el.incoming
              ? theme.palette.background.default
              : theme.palette.primary.main,
            borderRadius: 1.5,
            width: "max-content",
          }}
        >
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
              <Typography variant="caption">{el.message}</Typography>
              <IconButton >
                <DownloadSimple />
              </IconButton>
              <IconButton onClick={(e) => {

                e.preventDefault()
                handleClick(e)

              }
              }>
                <MoreVertIcon />
              </IconButton>

            </Stack>
          </Stack>
        </Box>
        <Avatar src={sender.avatar} sx={{ width: 24, height: 24 }} ></Avatar>
      </Stack>
    </Link>
      <Box sx={{ display: "flex", gap: "2px", flexDirection: !el.incoming ? "row" : "row-reverse" }}>
        <Typography variant="caption">{dayjs(createdAt).format("HH:mm")}</Typography>
        <Typography variant="caption">{sender.name}</Typography>
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: el.incoming ? 'left' : "right",
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
              handleForward()
              handleClose()
            }}>
              <ListItemText primary="forward" />
            </ListItemButton>
          </ListItem>
          {!el.incoming &&
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                handleRemove()
                handleClose()
              }}>
                <ListItemText primary="remove" />
              </ListItemButton>
            </ListItem>}
        </List>
      </Popover>
    </Stack>
  );
};

const LinkMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <img
              src={el.preview}
              alt={el.message}
              style={{ maxHeight: 210, borderRadius: "10px" }}
            />
            <Stack spacing={2}>
              <Typography variant="subtitle2" color={theme.palette.text}>
                Creating Chat App
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.primary.main }}
                component={Link}
                to="//https://www.youtube.com"
              >
                www.youtube.com
              </Typography>
              <Typography
                variant="body2"
                color={el.incoming ? theme.palette.text : "#fff"}
              >
                {el.message}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

const ReplyMsg = ({ el }) => {

  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {el.message}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.reply}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const MediaMsg = ({ el, handleForward, handleRemove, sender, createdAt }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const theme = useTheme();
  return (
    <Stack alignItems={el.incoming ? "start" : "end"}>
      <Stack gap={1} alignItems="end" direction={el.incoming ? "row-reverse" : "row"} justifyContent={el.incoming ? "start" : "end"} onClick={(e) => { handleClick(e) }}>
        <Box
          p={1.5}
          sx={{
            backgroundColor: el.incoming
              ? theme.palette.background.default
              : theme.palette.primary.main,
            borderRadius: 1.5,
            width: "max-content",
          }}
        >
          <Stack spacing={1}>
            <img
              src={el.message}
              alt={el.message}
              style={{ maxHeight: 210, borderRadius: "10px" }}
            />
          </Stack>
        </Box>
        <Avatar src={sender.avatar} sx={{ width: 24, height: 24 }} ></Avatar>
      </Stack>
      <Box sx={{ display: "flex", gap: "2px", flexDirection: !el.incoming ? "row" : "row-reverse" }}>
        <Typography variant="caption">{dayjs(createdAt).format("HH:mm")}</Typography>
        <Typography variant="caption">{sender.name}</Typography>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: el.incoming ? 'left' : "right",
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
              handleForward()
              handleClose()
            }}>
              <ListItemText primary="forward" />
            </ListItemButton>
          </ListItem>
          {!el.incoming &&
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                handleRemove()
                handleClose()
              }}>
                <ListItemText primary="remove" />
              </ListItemButton>
            </ListItem>}
        </List>
      </Popover>
    </Stack>
  );
};

const TextMsg = ({ el, handleForward, handleRemove, sender, createdAt }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const theme = useTheme();
  return (
    <Stack alignItems={el.incoming ? "start" : "end"}>
      <Stack gap={1} alignItems="end" direction={el.incoming ? "row-reverse" : "row"} justifyContent={el.incoming ? "start" : "end"} onClick={(e) => { handleClick(e) }}>
        <Box
          p={1.5}
          sx={{
            backgroundColor: el.incoming
              ? theme.palette.background.default
              : theme.palette.primary.main,
            borderRadius: 1.5,
            width: "max-content",
          }}
        >
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.message}
          </Typography>
        </Box>
        <Avatar src={sender.avatar} sx={{ width: 24, height: 24 }} ></Avatar>
      </Stack>
      <Box sx={{ display: "flex", gap: "2px", flexDirection: !el.incoming ? "row" : "row-reverse" }}>
        <Typography variant="caption">{dayjs(createdAt).format("HH:mm")}</Typography>
        <Typography variant="caption">{sender.name}</Typography>
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: el.incoming ? 'left' : "right",
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
              handleForward()
              handleClose()
            }}>
              <ListItemText primary="forward" />
            </ListItemButton>
          </ListItem>

          {!el.incoming &&
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                handleRemove()
                handleClose()
              }}>
                <ListItemText primary="remove" />
              </ListItemButton>
            </ListItem>}
        </List>
      </Popover>
    </Stack>
  );
};

const Timeline = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Divider width="46%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {el.text}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

export { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, Timeline };

