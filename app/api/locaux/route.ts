import db from "@/lib/prismadb";
import { LocalSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const locals = await db.local.findMany();
    return NextResponse.json(locals);
  } catch {
    return new NextResponse("Could not get locals", { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, emplacement, taille } = LocalSchema.parse(body);
    const local = await db.local.create({
      data: {
        nom,
        emplacement,
        taille,
      },
    });

    return NextResponse.json(local);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create local " + error, {
      status: 500,
    });
  }
}
