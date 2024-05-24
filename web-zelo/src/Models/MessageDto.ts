export interface MessageDto {
  createdAt: string;
  fromSelf: boolean;
  group: string;
  id: string;
  isHidden: boolean;
  message: string;
  sender: {
    avatar: string;
    id: string;
    name: string;
  };
}
