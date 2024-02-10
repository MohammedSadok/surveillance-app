import db from "@/lib/db";
import { LocationSchema } from "@/lib/validator";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    if (!params.locationId) {
      return new NextResponse("Local id is required", { status: 400 });
    }
    const exam = await db.location.delete({
      where: {
        id: parseInt(params.locationId),
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[LOCAL_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    if (!params.locationId) {
      return new NextResponse("Local id is required", { status: 400 });
    }
    const body = await req.json();
    const { name, size, type } = LocationSchema.parse(body);
    const exam = await db.location.update({
      where: {
        id: parseInt(params.locationId),
      },
      data: {
        name,
        size,
        type,
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[LOCAL_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
