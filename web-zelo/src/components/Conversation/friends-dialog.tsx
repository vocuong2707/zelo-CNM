import LoadingButton from "@mui/lab/LoadingButton";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import PanoramaFishEyeOutlinedIcon from "@mui/icons-material/PanoramaFishEyeOutlined";
import React, { useState } from "react";
import { useGetFriends } from "../../services/user-service";
import { useAuth } from "../../provider/authContext";

interface FriendsDialogProps {
  listFriends: string[];
  open: boolean;
  onClose: () => void;
  onSubmit: (usersSelected: string[]) => void;
}

const FriendsDialog = ({
  listFriends,
  open,
  onClose,
  onSubmit,
}: FriendsDialogProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const { user } = useAuth();
  const userId = typeof user === "object" ? user.id : JSON.parse(user).id;

  const { data } = useGetFriends(userId);
  const value = data?.filter((a) => !listFriends?.includes(a._id));

  const handleSelected = (userId: string) => {
    if (selected.some((s) => s === userId)) {
      const newList = selected.filter((s) => s !== userId);
      setSelected(newList);
    } else {
      setSelected([...selected, userId]);
    }
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Add members</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack gap={2}>
          {value?.map((friend) => (
            <Stack key={friend._id} flexDirection="row" gap={2}>
              <Checkbox
                icon={<PanoramaFishEyeOutlinedIcon />}
                checkedIcon={<TaskAltIcon />}
                onClick={() => handleSelected(friend._id)}
              />
              <Avatar src={friend.photoUrl}></Avatar>
              <Stack>
                <Typography>{friend.fullname}</Typography>
                <Typography variant="subtitle2">{friend.email}</Typography>
              </Stack>
            </Stack>
          ))}
          {value?.length === 0 && (
            <Typography textAlign={"center"}>
              No members could add to group
            </Typography>
          )}
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
          disabled={selected.length === 0}
          onClick={() => onSubmit(selected)}
          variant="contained"
          sx={{
            textTransform: "none",
            boxShadow: 0,
            "&:hover": {
              boxShadow: 0,
            },
          }}>
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default FriendsDialog;
