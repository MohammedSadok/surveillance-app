import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificiation-token";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const existingToken = await getVerificationTokenByToken(params.token);
    if (!existingToken) {
      return NextResponse.json({ error: "Token does not exist!" });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired!" });
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exist!" });
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
    return NextResponse.json({ success: "Email was confirmed" });
  } catch (error) {
    return new NextResponse("Internal error" + error, {
      status: 500,
    });
  }
}
