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
import { useGetGroupList, useNewGroup } from "../../services/group-service";
import { UserDto } from "../../Models/UserDto";
import { useSendMessageToGroups } from "../../services/message-service";

interface ForwardDialogProps {
  open: boolean;
  onClose: () => void;
  messageForward: string;
}

const ForwardDialog = ({
  open,
  onClose,
  messageForward,
}: ForwardDialogProps) => {
  const { user } = useAuth();
  const userId = typeof user === "object" ? user.id : JSON.parse(user).id;
  const { data } = useGetGroupList(userId);
  const { mutate } = useSendMessageToGroups();

  const [selected, setSelected] = useState<string[]>([]);

  const handleSelected = (groupId: string) => {
    if (selected.some((u) => u === groupId)) {
      const newList = selected.filter((a) => a !== groupId);
      setSelected(newList);
    } else {
      setSelected((prev) => [...prev, groupId]);
    }
  };

  const handleSubmit = () => {
    mutate(
      {
        from: userId,
        to: selected,
        message: messageForward,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Forward</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack gap={1}>
          <Typography>List Groups</Typography>
          {data?.map((group) => (
            <Stack key={group._id} flexDirection="row" alignItems="center">
              <Checkbox onClick={() => handleSelected(group._id)} />
              <Typography>{group.name}</Typography>
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
          // loading={isPending}
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

export default ForwardDialog;
