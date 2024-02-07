import db from "@/lib/db";
import { DepartmentSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const departments = await db.department.findMany();
    return NextResponse.json(departments);
  } catch {
    return new NextResponse("Could not get Departments", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = DepartmentSchema.parse(body);
    const department = await db.department.create({
      data: {
        name,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create Department " + error, {
      status: 500,
    });
  }
}
