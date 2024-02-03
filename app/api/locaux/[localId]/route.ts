import db from "@/lib/prismadb";
import { LocalSchema } from "@/lib/validator";
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

export async function PATCH(
  req: Request,
  { params }: { params: { localId: string } }
) {
  try {
    if (!params.localId) {
      return new NextResponse("Local id is required", { status: 400 });
    }
    const body = await req.json();
    const { nom, emplacement, taille } = LocalSchema.parse(body);
    const exam = await db.local.update({
      where: {
        id: parseInt(params.localId),
      },
      data: {
        nom,
        emplacement,
        taille,
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[LOCAL_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
