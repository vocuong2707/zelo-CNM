import {
  Avatar,
  Divider,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../../provider/authContext";
import {
  useAcceptFriendRequestAndSendMessage,
  useDeleteSendFriendRequest,
  useGetSendFriendRequest,
} from "../../services/user-service";
import LoadingButton from "@mui/lab/LoadingButton";

const RequestPanel = () => {
  const { user } = useAuth();
  const userId = typeof user === "object" ? user.id : JSON.parse(user).id;
  const { data, refetch } = useGetSendFriendRequest(userId);
  const { mutate, isPending } = useDeleteSendFriendRequest();
  const { mutate: mutateAccepted, isPending: isPendingAccepted } =
    useAcceptFriendRequestAndSendMessage();

  const handleAccept = (friendId: string) => {
    mutateAccepted(
      {
        userId,
        friendId,
      },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  const handleCancel = (friendId: string) => {
    mutate(
      {
        userId: friendId,
        friendId: userId,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <Stack sx={{ backgroundColor: "white", flex: 1 }}>
      <Typography variant="h6" sx={{ margin: "13px 16px" }}>
        Friends Request
      </Typography>
      <Divider />
      <Stack px={2} gap={2}>
        {data?.map((r) => (
          <Stack
            key={r._id}
            mt={2}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Stack flexDirection="row" gap={2} alignItems="center">
              <Avatar src={r.photoUrl}></Avatar>
              <Stack>
                <Typography variant="subtitle1">{r.fullname}</Typography>
                <Typography variant="caption">{r.email}</Typography>
              </Stack>
            </Stack>
            <Stack flexDirection="row" gap={2}>
              <LoadingButton
                disabled={isPending}
                loading={isPendingAccepted}
                onClick={() => handleAccept(r._id)}
                sx={{
                  textTransform: "none",
                }}
                variant="outlined"
                size="small">
                Accept
              </LoadingButton>
              <LoadingButton
                disabled={isPendingAccepted}
                loading={isPending}
                onClick={() => handleCancel(r._id)}
                color="error"
                sx={{
                  textTransform: "none",
                }}
                variant="outlined"
                size="small">
                Reject
              </LoadingButton>
            </Stack>
          </Stack>
        ))}
        {data?.length === 0 && (
          <FormHelperText sx={{ textAlign: "center", margin: "20px" }}>
            No request
          </FormHelperText>
        )}
      </Stack>
    </Stack>
  );
};

export default RequestPanel;
