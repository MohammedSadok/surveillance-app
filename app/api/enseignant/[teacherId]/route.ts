import db from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    if (!params.teacherId) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const exam = await db.enseignant.delete({
      where: {
        id: parseInt(params.teacherId),
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[TEACHER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
