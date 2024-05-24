export interface GroupDto {
  name: string;
  leader: string;
  coLeader: string;
  members: string[];
  avatar: string;
  _id: string;
}

export interface GroupMemberDto {
  _id: string;
  fullName: string;
  avatar: string;
  role: string;
}

export interface GroupMembersDto {
  groupMembers: GroupMemberDto[];
  success: boolean;
}
