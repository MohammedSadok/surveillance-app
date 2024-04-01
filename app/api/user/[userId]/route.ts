import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";
import { RegisterSchema } from "@/lib/validator";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }
    const user = await db.user.delete({
      where: {
        id: parseInt(params.userId),
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await req.json();
    const { email, password, name, isAdmin } = RegisterSchema.parse(body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.update({
      where: { id: parseInt(params.userId) },
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_UPDATE]", error);
    return new NextResponse("Error essayer une autre fois", { status: 500 });
  }
}
