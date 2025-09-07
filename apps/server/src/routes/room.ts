import { Router } from "express";
import { middleware } from "../middleware";
import { roomController } from "../controllers/roomCOntroller";

const roomRouter = Router();

roomRouter.post("/create-room", middleware, roomController.createRoom);
roomRouter.get("/room/:roomId", middleware, roomController.getRoom);
roomRouter.post("/room/:roomId/remove", middleware, roomController.removeUser);
roomRouter.post("/room/:roomId/join", middleware, roomController.joinRoom);
roomRouter.post("/room/:roomId/public", middleware, roomController.makeRoomPublic);
roomRouter.get("/get-members/:roomId", roomController.getMembers);
roomRouter.delete("/room/:roomId", middleware, roomController.deleteOrLeaveRoom);

export default roomRouter;
