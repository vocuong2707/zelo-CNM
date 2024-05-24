import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate, useParams } from "react-router-dom";
import { useGetGroupList, useGetGroupMembers } from "../services/group-service";
import { useAuth } from "./authContext";
import { GroupDto, GroupMemberDto } from "../Models/GroupDto";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useGetGroupMessages } from "../services/message-service";
import { MessageDto } from "../Models/MessageDto";

interface GroupContextProps {
  groups: GroupDto[] | undefined;
  group: GroupDto | null;
  groupId: string | undefined;
  messages: MessageDto[] | undefined;
  leaderId: string | undefined;
  groupMembers: GroupMemberDto[] | undefined;
  refetch:
    | ((
        options?: RefetchOptions | undefined
      ) => Promise<QueryObserverResult<GroupDto[], Error>>)
    | undefined;
  refetchMessages:
    | ((
        options?: RefetchOptions | undefined
      ) => Promise<QueryObserverResult<MessageDto[], Error>>)
    | undefined;
  refetchMembers:
    | ((
        options?: RefetchOptions | undefined
      ) => Promise<QueryObserverResult<GroupMemberDto[], Error>>)
    | undefined;
}

const GroupContext = createContext<GroupContextProps>({
  groups: [],
  group: null,
  groupId: "",
  messages: [],
  leaderId: "",
  groupMembers: [],
  refetch: undefined,
  refetchMessages: undefined,
  refetchMembers: undefined,
});

interface GroupProviderProps {
  children: React.ReactNode;
}

const GroupProvider = ({ children }: GroupProviderProps) => {
  const { id: groupId } = useParams();
  const router = useNavigate();
  const { user } = useAuth();
  const userId = typeof user === "object" ? user.id : JSON.parse(user).id;
  const { data, refetch } = useGetGroupList(userId);

  const groupList = data?.filter((d) => d._id === groupId) ?? [];

  const group = groupList?.length > 0 ? groupList[0] : null;

  const { data: data1, refetch: refetchMembers } = useGetGroupMembers(
    groupId ?? ""
  );

  const leaderId = data1?.filter((a) => a.role === "leader")[0]._id;

  const { data: messages, refetch: refetchMessages } = useGetGroupMessages(
    groupId ?? "",
    userId
  );

  useEffect(() => {
    socket.on("newGroup", () => {
      refetch();
    });
    socket.on("groupDeleted", () => {
      refetch();
      router("/home");
    });
    socket.on("groupAddMember", () => {
      refetch();
    });
    socket.on("newMemberAdded", () => {
      refetchMessages();
      refetchMembers();
    });
    socket.on("dissolution", () => {
      refetch();
      router("/home");
    });
    socket.on("removeMember", (memberId) => {
      if (userId === memberId) {
        refetch();
        router("/home");
      } else {
        refetchMessages();
        refetchMembers();
      }
    });
  }, []);

  useEffect(() => {
    socket.emit("createRoomGroup", {
      groupId: groupId,
    });
  }, [groupId]);

  return (
    <GroupContext.Provider
      value={{
        groups: data,
        group,
        groupId,
        leaderId,
        groupMembers: data1,
        refetch,
        refetchMessages,
        messages,
        refetchMembers,
      }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);

export default GroupProvider;
