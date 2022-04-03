export interface Message {
  _id: string;
  senderId: string;
  recepientId: string;
  message: string;
  dateCreated: string;
  type: string;
}
