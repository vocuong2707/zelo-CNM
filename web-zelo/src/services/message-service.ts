import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../configs/axios-conf";
import { MessageDto } from "../Models/MessageDto";

const messageEndPoint = "/messages";

export const useGetGroupMessages = (groupId: string, from: string) => {
  const endpoint = `${messageEndPoint}/getGroupMessages?groupId=${groupId}&from=${from}`;

  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      return (await axiosInstance.get<MessageDto[]>(endpoint)).data;
    },
  });
};

export const useSendMessageToGroup = () => {
  const endpoint = `${messageEndPoint}/sendMessageToGroup`;

  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async ({
      to,
      message,
      from,
      avatar,
    }: {
      to: string;
      from: string;
      message: string;
      avatar?: string;
    }) => {
      return (
        await axiosInstance.post(endpoint, {
          to,
          from,
          message,
          avatar,
        })
      ).data;
    },
  });
};

export const useSendMessageToGroups = () => {
  const endpoint = `${messageEndPoint}/sendMessageToGroup`;

  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async ({
      to,
      message,
      from,
      avatar,
    }: {
      to: string[];
      from: string;
      message: string;
      avatar?: string;
    }) => {
      return await Promise.all(
        to.map(async (v) => {
          return (
            await axiosInstance.post(endpoint, {
              to: v,
              from,
              message,
              avatar,
            })
          ).data;
        })
      );
    },
  });
};

export const useRecallMessage = () => {
  return useMutation({
    mutationFn: async (mgsId: string) => {
      return await axiosInstance.delete(`${messageEndPoint}/${mgsId}`);
    },
  });
};
