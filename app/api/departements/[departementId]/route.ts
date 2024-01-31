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

export async function DELETE(
  req: Request,
  { params }: { params: { departementId: string } }
) {
  try {
    if (!params.departementId) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const exam = await db.departement.delete({
      where: {
        id: parseInt(params.departementId),
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[DEPARTEMENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
