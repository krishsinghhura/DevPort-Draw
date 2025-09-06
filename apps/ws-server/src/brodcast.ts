import { RoomEvent, UserSession as UserSessionType } from "./types"; // import type from types

const users: UserSessionType[] = [];

export function addUser(session: UserSessionType) {
  users.push(session);
}

export function removeUser(session: UserSessionType) {
  const idx = users.indexOf(session);
  if (idx !== -1) users.splice(idx, 1);
}

export function broadcastLocal(roomId: string, payload: RoomEvent) {
  const msg = JSON.stringify(payload);
  users.forEach((user) => {
    if (user.rooms.includes(roomId)) {
      try {
        user.ws.send(msg);
      } catch (err) {
        console.error("WS send error:", err);
      }
    }
  });
}

export function getUsers() {
  return users;
}

// Export UserSession type for other modules
export type { UserSessionType as UserSession };
