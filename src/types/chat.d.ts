export type ParticipantRole = "participant" | "admin";
export type Participant = {
  participantID: string;
  role: ParticipantRole;
};
