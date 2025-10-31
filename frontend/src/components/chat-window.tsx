import type { Chat } from "@/types";

type ChatWindowProps = {
  chat: Chat | null;
};

// when this component loads, fetch the messages, all the events through sockets like typing etc,
// when click on seeing group about section there the group members should be shown(participant id, name, username, icon)

export function ChatWindow({ chat }: ChatWindowProps) {
  return <div>Chat Window</div>;
}
