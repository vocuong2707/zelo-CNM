import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Groups3Icon from '@mui/icons-material/Groups3';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import {
  MagnifyingGlass,
  Phone,
  VideoCamera,
} from "phosphor-react";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useGroup } from "../../provider/GroupProvider";
import { useAuth } from "../../provider/authContext";
import { useAddMembersToGroup, useDeleteGroup, useLeaveGroup, useRemoveMember } from '../../services/group-service';
import StyledBadge from "../../styles/StyledBadge";
import FriendsDialog from "./friends-dialog";
import { socket } from '../../socket';

const Header = ({ open, onClick }) => {
  const [openAction, setOpenAction] = useState(false)
  const [openAction1, setOpenAction1] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const router = useNavigate()

  const { user } = useAuth();
  const userId = typeof user === "object" ? user.id : JSON.parse(user).id;
  const { group, leaderId, groupId, groupMembers, refetch, refetchMessages, refetchMembers } = useGroup()

  const { mutate } = useDeleteGroup()
  const { mutate: removeUser, isPending } = useRemoveMember()
  const { mutate: addMembers } = useAddMembersToGroup()

  const userSelectedId = useRef("")

  const handleAddMembers = (list) => {
    addMembers({
      groupId: groupId,
      memberIds: list
    }, {
      onSuccess: () => {
        refetchMembers()
        refetchMessages()
        socket.emit("groupAddMember", { groupId: groupId, members: list });
        setOpenAdd(false)
      }
    })
  }

  const handleDeleteGroup = () => {
    mutate(groupId, {
      onSuccess: () => {
        refetch()
        socket.emit("groupDeleted", { group: "", members: groupMembers?.map(g => g._id) ?? [] });
        router('/home')
      }
    })
  }

  const handleRemove = (userId) => {
    removeUser({
      groupId,
      userId
    }, {
      onSuccess: (a) => {
        if (a.message === "Nhóm đã được giải tán vì ít hơn 3 thành viên") {
          socket.emit("dissolution", groupId)
          refetch()
          router("/home")
        } else {
          refetchMembers()
          refetchMessages()
          socket.emit("removeMember", userId, groupId);
        }
      }
    })
  }

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        backgroundColor: "#F8FAFF",
        boxShadowColor: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent={"space-between"}
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack direction={"row"} spacing={2}>
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                alt={group?.name}
                src={group?.avatar}
              />
            </StyledBadge>
          </Box>
          <Stack spacing={0.2}>
            <Typography variant={"subtitle2"}>
              {group?.name}
            </Typography>
            <Typography variant={"caption"}>online</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={3}>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          {groupMembers?.length !== 2 &&
            <IconButton onClick={() => onClick(!open)}>
              <VerticalSplitIcon />
            </IconButton>
          }
        </Stack>
      </Stack>
      <Drawer
        anchor={"right"}
        open={open}
        onClose={() => onClick(false)}
        variant="persistent"
        PaperProps={{
          sx: {
            width: "320px"
          }
        }}
      >
        <Stack>
          <Stack p={3}>
            <Typography textAlign="center" variant="h6">Thông tin cộng đồng</Typography>
          </Stack>
          <Divider></Divider>
          <Stack>
            <Stack alignItems="center" px={3} py={3} gap={1}>
              <Avatar src={group?.avatar} />
              <Typography variant="h6">{group?.name}</Typography>
            </Stack>
            {leaderId === userId &&
              <Stack px={2} alignItems="start" justifyContent="space-around" flexDirection={"row"}>
                <Stack alignItems="center">
                  <IconButton size="small" onClick={() => setOpenAdd(true)}>
                    <GroupAddIcon />
                  </IconButton>
                  <Typography variant="caption">Add members</Typography>
                </Stack>
                {/* <Stack alignItems="center">
                  <IconButton size="small">
                    <LogoutIcon />
                  </IconButton>
                  <Typography variant="caption">Logout</Typography>
                </Stack> */}
                <Stack alignItems="center">
                  <IconButton size="small" onClick={() => setOpenAction(true)}>
                    <DeleteIcon />
                  </IconButton>
                  <Typography variant="caption">Delete group</Typography>
                </Stack>
              </Stack>
            }
          </Stack>
          <Stack p={2}>
            <Typography variant="subtitle1" fontWeight="bold">Members</Typography>
            <Stack flexDirection={"row"} gap={2} py={1}>
              <Groups3Icon />
              <Typography>{groupMembers?.length} Members</Typography>
            </Stack>
            <Divider sx={{ margin: "12px 0" }} />
            <Stack gap={2}>
              {groupMembers?.map(a => <Stack key={a._id} flexDirection="row" alignItems={"center"} gap={2} justifyContent="space-between">
                <Stack flexDirection="row" gap={2}>
                  <Avatar src={a.avatar}></Avatar>
                  <Stack>
                    <Typography fontWeight="bold">{a.fullName}</Typography>
                    <Typography variant="subtitle2">{a.role}</Typography>
                  </Stack>
                </Stack>
                {a.role !== "leader" && leaderId === userId &&
                  <LoadingButton loading={isPending} size="small" color="error" variant="outlined" sx={{ textTransform: "none" }} onClick={() => { userSelectedId.current = a._id, setOpenAction1(true) }}>Remove</LoadingButton>
                }
              </Stack>)}
            </Stack>
          </Stack>
        </Stack>
      </Drawer>
      <FriendsDialog listFriends={groupMembers?.map(a => a._id)} open={openAdd} onClose={() => { setOpenAdd(false) }} onSubmit={handleAddMembers} />
      <Dialog open={openAction | openAction1} fullWidth >
        <DialogTitle>Warning</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>Do you want to do action?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (openAction) {

                setOpenAction(false)
              } else {
                setOpenAction1(false)
              }
            }}
            color="inherit"
            variant="contained"
            sx={{
              textTransform: "none",
              boxShadow: 0,
              "&:hover": {
                boxShadow: 0,
              },
            }}>
            Cancel
          </Button>
          <LoadingButton
            onClick={() => {
              if (openAction) {
                handleDeleteGroup()
              }
              if (openAction1) {

                handleRemove(userSelectedId.current)
                setOpenAction1(false)
              }
            }}
            variant="contained"
            sx={{
              textTransform: "none",
              boxShadow: 0,
              "&:hover": {
                boxShadow: 0,
              },
            }}>
            Approve
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Header
