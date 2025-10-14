import { PrismaClient } from "../generated/prisma";

declare global {
	// Using var on purpose to persist Prisma across HMR in dev
	var prismaGlobal: PrismaClient | undefined;
}

const prisma = global.prismaGlobal || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	global.prismaGlobal = prisma;
}

export default prisma;

