import { signIn } from "@/auth";
import { LoginSchema } from "@/lib/validator";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
    const { email, password } = validatedFields.data;
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json({ error: "Invalid credentials!" });
        default:
          return NextResponse.json({ error: "Something went wrong!" });
      }
    }
    return new NextResponse("Could not signed in" + error, {
      status: 500,
    });
  }
}
