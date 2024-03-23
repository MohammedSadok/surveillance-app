import { validateSession } from "@/data/session";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const id = parseInt(params.id);
    const validatedSession = await validateSession(id);
    return NextResponse.json(validatedSession);
  } catch (error) {
    console.log("[GET_SESSION]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
