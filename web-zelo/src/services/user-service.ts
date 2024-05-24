import { useMutation, useQuery } from "@tanstack/react-query";
import { BaseDto } from "../Models/BaseDto";
import { UserDto } from "../Models/UserDto";
import axiosInstance from "../configs/axios-conf";
import { AxiosError } from "axios";
import { UploadDto } from "../Models/UploadDto";

const userPath = "/users";
const userEndPoint = "/users";

export const useFindUserByEmail = (email: string) => {
  const endpoint = `${userEndPoint}/findUserByEmail/${email}`;

  return useQuery<UserDto, AxiosError>({
    queryKey: [endpoint],
    queryFn: async () => {
      return (
        await axiosInstance.get<BaseDto<UserDto>>(
          `${userPath}/findUserByEmail/${email}`
        )
      ).data.user;
    },
    enabled: false,
  });
};

export const useSendFriendRequest = () => {
  const endpoint = `${userEndPoint}/sendFriendRequest`;
  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async ({
      senderId,
      receiverId,
    }: {
      senderId: string;
      receiverId: string;
    }) => {
      return (
        await axiosInstance.post(`${userPath}/sendFriendRequest`, {
          senderId,
          receiverId,
        })
      ).data;
    },
  });
};

export const useGetSendFriendRequest = (userId: string) => {
  const endpoint = `${userEndPoint}/getSendFriendRequest/${userId}`;

  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      return (await axiosInstance.get<UserDto[]>(endpoint)).data;
    },
  });
};

export const useAcceptFriendRequestAndSendMessage = () => {
  const endpoint = `${userEndPoint}/acceptFriendRequestAndSendMessage`;

  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async ({
      userId,
      friendId,
    }: {
      userId: string;
      friendId: string;
    }) => {
      return (
        await axiosInstance.post(endpoint, {
          userId,
          friendId,
        })
      ).data;
    },
  });
};

export const useDeleteSendFriendRequest = () => {
  const endpoint = `${userEndPoint}/deleteSendFriendRequest`;

  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async ({
      userId,
      friendId,
    }: {
      userId: string;
      friendId: string;
    }) => {
      return (
        await axiosInstance.delete(endpoint, {
          data: {
            userId,
            friendId,
          },
        })
      ).data;
    },
  });
};

export const useGetFriends = (userId: string) => {
  const endpoint = `${userEndPoint}/getFriends/${userId}`;

  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      return (await axiosInstance.get<UserDto[]>(endpoint)).data;
    },
  });
};

export const useUploadFile = (userId: string) => {
  const endpoint = `${userEndPoint}/upload/${userId}`;

  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async (formData: FormData) => {
      return (
        await axiosInstance.post<UploadDto>(endpoint, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
      ).data;
    },
  });
};
