import connectMongo from "@/lib/db";
import user from "@/models/user";
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

    const foundUser = await user.findOne({ email });

    if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
      return new Response(
        JSON.stringify({ message: "Incorrect email or password" }),
        { status: 400 }
      );
    }

    const accessToken = sign(
      { id: foundUser._id.toString() },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(
      JSON.stringify({ accessToken, status: "success" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Something went wrong", status: "error" }),
      { status: 500 }
    );
  }
}
