import { getMonitoring } from "@/data/session";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    if (!params.sessionId) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const id = parseInt(params.sessionId);
    const session = await db.sessionExam.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(session);
  } catch (error) {
    console.log("[SESSION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    if (!params.sessionId) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const id = parseInt(params.sessionId);
    const monitoring = await getMonitoring(id);
    return NextResponse.json(monitoring);
  } catch (error) {
    console.log("[GET_SESSION]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
