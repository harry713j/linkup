export type ParticipantRole = "participant" | "admin";
export type Participant = {
  participantID: string;
  role: ParticipantRole;
};

export type ChatParticipant = {
  role: ParticipantRole | null;
  joinedAt: Date | null;
  username: string;
  email: string;
  id: string;
  displayName: string | null | undefined;
  status: boolean | null;
  profileUrl: string | null;
};
