import { cancelSession, getMonitoring, validateSession } from "@/data/session";
import db from "@/lib/db";
import { sessionsSchema } from "@/lib/validator";
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

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    if (!params.sessionId) {
      return new NextResponse("Session id is required", { status: 400 });
    }

    const body = await req.json();
    const { type } = sessionsSchema.parse(body);
    const id = parseInt(params.sessionId);
    let response;
    if (type === "validate") {
      const validatedSession = await validateSession(id);
      response = validatedSession;
    } else if (type === "cancel") {
      await cancelSession(id);
      response = { message: "Session canceled successfully." };
    } else {
      return new NextResponse("Invalid action type", { status: 400 });
    }

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[POST_SESSION]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
