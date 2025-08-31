-- DropForeignKey
ALTER TABLE "public"."ChatHistory" DROP CONSTRAINT "ChatHistory_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."ChatHistory" ADD CONSTRAINT "ChatHistory_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
