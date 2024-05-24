import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../configs/axios-conf";
import { UserDto } from "../Models/UserDto";
import { GroupDto, GroupMembersDto } from "../Models/GroupDto";

export const groupEndpoint = "/groups";

export const useGetGroupMembers = (groupId: string) => {
  const endpoint = `${groupEndpoint}/get-group-members/${groupId}`;
  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      return (await axiosInstance.get<GroupMembersDto>(endpoint)).data
        .groupMembers;
    },
  });
};

export const useGetGroupList = (userId: string) => {
  const endpoint = `${groupEndpoint}/get-group-list/${userId}`;
  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      return (await axiosInstance.get<GroupDto[]>(endpoint)).data;
    },
  });
};

export const useNewGroup = () => {
  const endpoint = `${groupEndpoint}/new-groups`;

  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async ({
      name,
      creatorId,
      avatar,
      members,
    }: {
      name: string;
      creatorId: string;
      avatar: string;
      members: string[];
    }) => {
      return (
        await axiosInstance.post(endpoint, {
          name,
          creatorId,
          avatar,
          members,
        })
      ).data;
    },
  });
};

export const useDeleteGroup = () => {
  return useMutation({
    mutationFn: async (groupId: string) => {
      return (
        await axiosInstance.delete(`${groupEndpoint}/deleteGroup/${groupId}`)
      ).data;
    },
  });
};

export const useLeaveGroup = () => {
  return useMutation({
    mutationFn: async ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => {
      return (
        await axiosInstance.delete(
          `${groupEndpoint}/leaveGroup/${groupId}/${userId}`
        )
      ).data;
    },
  });
};

export const useRemoveMember = () => {
  return useMutation({
    mutationFn: async ({
      groupId,
      userId,
    }: {
      groupId: string;
      userId: string;
    }) => {
      return (
        await axiosInstance.delete(`${groupEndpoint}/${groupId}/removeMember`, {
          data: {
            memberIds: [userId],
          },
        })
      ).data;
    },
  });
};

export const useAddMembersToGroup = () => {
  return useMutation({
    mutationFn: async ({
      groupId,
      memberIds,
    }: {
      groupId: string;
      memberIds: string[];
    }) => {
      return (
        await axiosInstance.post(`${groupEndpoint}/${groupId}/members`, {
          memberIds,
        })
      ).data;
    },
  });
};
