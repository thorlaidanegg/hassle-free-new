import connectMongo from "@/lib/db";
import admin from "@/models/admin";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectMongo();

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Please provide email and password" }),
        { status: 400 }
      );
    }

    const user = await admin.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(
        JSON.stringify({ message: "Incorrect email or password" }),
        { status: 400 }
      );
    }

    const accessToken = sign(
      { id: user._id.toString() },
      process.env.ACCESS_TOKEN_SECRET_ADMIN,
      { expiresIn: "5h" }
    )

    return new Response(
      JSON.stringify({ accessToken, societyId: user.societyId, status: "success" }),
      { 
        status: 200
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Something went wrong", status: "error" }),
      { status: 500 }
    );
  }
}
