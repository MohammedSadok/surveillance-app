import db from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { departementId: string } }
) {
  try {
    const teachers = await db.enseignant.findMany({
      where: {
        departementId: parseInt(params.departementId),
      },
    });
    return NextResponse.json(teachers);
  } catch {
    return new NextResponse("Could not get Departements", { status: 500 });
  }
}
