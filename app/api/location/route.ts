import db from "@/lib/db";
import { LocationSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const locations = await db.location.findMany();
    return NextResponse.json(locations);
  } catch {
    return new NextResponse("Could not get locations", { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, size } = LocationSchema.parse(body);
    const location = await db.location.create({
      data: {
        name,
        size,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create location " + error, {
      status: 500,
    });
  }
}
