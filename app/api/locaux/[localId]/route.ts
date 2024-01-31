import db from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { localId: string } }
) {
  try {
    if (!params.localId) {
      return new NextResponse("Local id is required", { status: 400 });
    }
    const exam = await db.local.delete({
      where: {
        id: parseInt(params.localId),
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[LOCAL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
