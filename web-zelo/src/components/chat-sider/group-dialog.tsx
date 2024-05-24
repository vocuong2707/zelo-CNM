import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../../provider/authContext";
import { useGetFriends } from "../../services/user-service";
import { useNewGroup } from "../../services/group-service";
import { UserDto } from "../../Models/UserDto";
import { useNavigate } from "react-router-dom";
import { useGroup } from "../../provider/GroupProvider";
import { socket } from "../../socket";

interface GroupDialogProps {
  open: boolean;
  onClose: () => void;
}

const GroupDialog = ({ open, onClose }: GroupDialogProps) => {
  const { user } = useAuth();
  const userId = typeof user === "object" ? user.id : JSON.parse(user).id;
  const { data } = useGetFriends(userId);
  const route = useNavigate();

  const { mutate, isPending } = useNewGroup();
  const { refetch } = useGroup();

  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  const handleSelected = (userId: string) => {
    if (selected.some((u) => u === userId)) {
      const newList = selected.filter((a) => a !== userId);
      setSelected(newList);
    } else {
      setSelected((prev) => [...prev, userId]);
    }
  };

  const handleSubmit = () => {
    mutate(
      { name: groupName, creatorId: userId, avatar: "", members: selected },
      {
        onSuccess: (a) => {
          setSelected([]);
          setGroupName("");
          onClose();
          refetch?.();
          socket.emit("groupCreated", { group: "", members: [selected] });
          route(`/groups/${a._id}`);
        },
      }
    );
  };

  return (
    <Dialog open fullWidth>
      <DialogTitle>Create group</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack gap={1}>
          <TextField
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            label="Group Name"
          />
          <Typography>List friend</Typography>
          {data?.map((user) => (
            <Stack flexDirection="row" alignItems="center">
              <Checkbox onClick={() => handleSelected(user._id)} />
              <Typography>{user.fullname}</Typography>
            </Stack>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
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
          loading={isPending}
          onClick={handleSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            boxShadow: 0,
            "&:hover": {
              boxShadow: 0,
            },
          }}>
          Created
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default GroupDialog;
