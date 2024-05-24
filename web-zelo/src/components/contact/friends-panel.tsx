import {
  Avatar,
  Divider,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useGetFriends } from "../../services/user-service";
import { useAuth } from "../../provider/authContext";
import TextsmsIcon from "@mui/icons-material/Textsms";
import { useNewGroup } from "../../services/group-service";
import { UserDto } from "../../Models/UserDto";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";

const FriendsPanel = () => {
  const router = useNavigate();
  const { user } = useAuth();
  const userId = typeof user === "object" ? user.id : JSON.parse(user).id;
  const { data } = useGetFriends(userId);
  const { mutate, isPending } = useNewGroup();

  const handleCreateNewChat = (memberId: string) => {
    mutate(
      {
        name: "name",
        avatar: "",
        creatorId: userId,
        members: [memberId],
      },
      {
        onSuccess: (a) => {
          socket.emit("groupCreated", { group: "", members: [memberId] });
          router(`/groups/${a._id}`);
        },
      }
    );
  };

  return (
    <Stack sx={{ backgroundColor: "white", flex: 1 }}>
      <Typography variant="h6" sx={{ margin: "13px 16px" }}>
        List friends
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
              <IconButton
                disabled={isPending}
                onClick={() => handleCreateNewChat(r._id)}>
                <TextsmsIcon />
              </IconButton>
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

export default FriendsPanel;
