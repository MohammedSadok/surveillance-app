import db from "@/lib/prismadb";
import { DepartementSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const departements = await db.departement.findMany();
    return NextResponse.json(departements);
  } catch {
    return new NextResponse("Could not get Departements", { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom } = DepartementSchema.parse(body);
    const departement = await db.departement.create({
      data: {
        nom,
      },
    });

    return NextResponse.json(departement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create Departement " + error, {
      status: 500,
    });
  }
}
