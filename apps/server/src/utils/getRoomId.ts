import { prismaClient } from "@repo/db/client";

export async function getRoomId(name:string):Promise<string | null>{
    try {
        const room=await prismaClient.room.findFirst({
            where:{
                slug:name
            },
            select:{
                id:true
            }
        });

        return room ? room.id: null;
    } catch (error:any) {
        console.error("Error fetching roomId:", error);
        return null;
    }

    
}