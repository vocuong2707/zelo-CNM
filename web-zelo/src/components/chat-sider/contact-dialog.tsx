import { ConsoleSqlOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useState } from "react";
import { useAuth } from "../../provider/authContext";
import {
  useFindUserByEmail,
  useGetSendFriendRequest,
  useSendFriendRequest,
} from "../../services/user-service";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ContactDialog = ({ open, onClose }: ContactDialogProps) => {
  const [email, setEmail] = useState("");
  const { user } = useAuth();
  const { refetch: refetchRequest } = useGetSendFriendRequest(
    typeof user === "object" ? user.id : JSON.parse(user).id
  );

  const {
    data: foundUserByEmail,
    refetch,
    isRefetching,
    error,
  } = useFindUserByEmail(email);

  const {
    data,
    error: requestFriendError,
    mutate,
    isPending,
  } = useSendFriendRequest();

  const handleSubmit = () => {
    refetch();
  };

  const handleClose = () => {
    onClose();
  };

  const handleSendRequest = () => {
    mutate(
      {
        senderId: typeof user === "object" ? user.id : JSON.parse(user).id,
        receiverId: foundUserByEmail?._id || "",
      },
      {
        onSuccess: () => {
          refetch();
          refetchRequest();
        },
        onError: (error) => {
          console.log(error.message);
        },
      }
    );
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Find Friends</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          To find your friends, please enter email address here. We will find
          your friend occasionally.
        </DialogContentText>
        <TextField
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
          }}
          sx={{ marginTop: "8px" }}
          disabled={isRefetching}
          autoFocus
          required
          margin="dense"
          id="name"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
        {error !== null && (
          <FormHelperText error>
            {(error.response?.data as { message: string })?.message}
          </FormHelperText>
        )}
        {foundUserByEmail && (
          <>
            <Stack
              mt={2}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Stack flexDirection="row" gap={2} alignItems="center">
                <Avatar src={foundUserByEmail.photoUrl}></Avatar>
                <Typography variant="subtitle1">
                  {foundUserByEmail.fullname}
                </Typography>
              </Stack>
              {foundUserByEmail.friends.includes(
                typeof user === "object" ? user.id : JSON.parse(user).id
              ) ? (
                <Typography color="green">Friend</Typography>
              ) : (
                <LoadingButton
                  disabled={
                    foundUserByEmail.receivedFriendRequests.includes(
                      typeof user === "object" ? user.id : JSON.parse(user).id
                    ) ||
                    foundUserByEmail.friends.includes(
                      typeof user === "object" ? user.id : JSON.parse(user).id
                    )
                  }
                  loading={isPending}
                  onClick={handleSendRequest}
                  sx={{
                    textTransform: "none",
                  }}
                  variant="outlined"
                  size="small">
                  Connect
                </LoadingButton>
              )}
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          hidden={isRefetching}
          onClick={handleClose}
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
          disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
          loading={isRefetching}
          onClick={handleSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            boxShadow: 0,
            "&:hover": {
              boxShadow: 0,
            },
          }}>
          Find Friends
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
