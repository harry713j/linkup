import type { ChatCardType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type ActiveChatsProps = {
  chats: ChatCardType[];
  getCurrentChatId: (chatId: string) => void;
};

export function ActiveChats({ chats, getCurrentChatId }: ActiveChatsProps) {
  if (chats.length === 0) {
    return <div>No Chats</div>;
  }

  return (
    <>
      {chats.map((chat) => (
        <Card
          key={chat.id}
          className="flex items-start"
          onClick={() => getCurrentChatId(chat.id)}
        >
          <CardHeader>
            <Avatar>
              {chat?.icon && <AvatarImage src={chat?.icon} alt={chat.name} />}
              <AvatarFallback>
                {chat.name?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <h3>{chat.name}</h3>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
