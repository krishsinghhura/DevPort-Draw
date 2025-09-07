import { prismaClient } from "@repo/db/client";

prismaClient.$connect();

export { prismaClient };
