import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../configs/axios-conf";
const baseUrl = "/auth";

export const updateProfile = () => {
  const endpoint = `${baseUrl}/updateProfile`;

  return useMutation({
    mutationKey: [endpoint],
    mutationFn: async ({
      fullname,
      email,
      dateOfBirth,
      gender,
      photoUrl,
    }: {
      fullname: string;
      email: string;
      dateOfBirth: string;
      gender: string;
      photoUrl: string;
    }) => {
      return (
        await axiosInstance.put(endpoint, {
          fullname,
          email,
          dateOfBirth,
          gender,
          photoUrl,
        })
      ).data;
    },
  });
};
