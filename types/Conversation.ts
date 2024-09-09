export type Message = {
  id: string;
  message: string;
  sender?: "user" | null;
  image?: string | null;
  time: string;
};

export type Conversation = {
  id: string;
  image: string;
  messages: Message[];
  newMessages: number;
  title: string;
};
