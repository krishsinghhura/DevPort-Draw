import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";
import { middleware } from "./middleware";
import { SignupSchema, SigninSchema, CreateRoom } from "@repo/common/zodTypes";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt-ts";
import {getRoomId} from "./utils/getRoomId"

const app = express();
app.use(express.json());

prismaClient.$connect();

app.post("/signup", async (req, res) => {
  if (!req.body) {
    res.json("No valid inputs");
  }

  const parseddata = SignupSchema.safeParse(req.body);
  if (!parseddata.success) {
    res.json({ message: "Incorrect Inputs"});
    return;
  }

  const hashedPassword = bcrypt.hashSync(parseddata.data.password, 10);
  try {
    const signupResponse = await prismaClient.user.create({
      data: {
        name: parseddata.data.name,
        email: parseddata.data.email,
        password: hashedPassword,
      },
    });

    res.json({
      
      signupResponse,
    });
  } catch (error: any) {
    res.status(400).json(error.message);
    return;
  }
});

app.post("/signin", async(req, res) => {
  if (!req.body) {
    res.json("No Valid inputs");
  }
  const parseddata = SigninSchema.safeParse(req.body);
  if (!parseddata.success) {
    res.json({ message: "Incorrect Inputs" });
    return;
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: {
        email:parseddata.data.email,
      },
    });
    if (!user) {
      res.json({ message: `No user with ${parseddata.data.email}` });
      return;
    }
    
    const checkPassword = await bcrypt.compare(parseddata.data.password, user?.password);
    if (!checkPassword) {
      res.json({ message: "Wrong Password" });
      return;
    }
  
    const token = jwt.sign({ userId:user?.id }, JWT_SECRET);

    res.json({ token });
  } catch (error: any) {
    res.json(error.message);
  }
});

app.post("/create-room", middleware,async (req, res) => {
  const parseddata = CreateRoom.safeParse(req.body);
  if (!parseddata.success) {
    res.json({ message: "Incorrect Inputs" });
    return;
  }

  const userId=req.userId;

 const room= await prismaClient.room.create({
    data:{
      slug:parseddata.data.slug,
      adminId:Number(userId)
    }
  })
  res.json({
    roomId:room.id
  });
});

app.get("/room/:slug",async(req,res)=>{
  const slug=req.params.slug;
  const id=await getRoomId(slug);
  if(id===null){
    return res.status(404).json({ error: "Room not found" });
  }
  const messages=await prismaClient.chatHistory.findMany({
    where:{
      roomId:id
    },orderBy:{
      id:"desc"
    },
    take:50
  })

  res.json(messages);
})

app.listen(3001);
