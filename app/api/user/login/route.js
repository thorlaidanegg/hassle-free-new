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
        { status: 401 } // Use 401 for unauthorized
      );
    }

    const accessToken = sign(
      { id: foundUser._id.toString() },
      process.env.ACCESS_TOKEN_SECRET_USER,
      { expiresIn: "7d" }
    );

    const response = new Response(
      JSON.stringify({
        message: "Login successful",
        accessToken,
        status: "success",
        societyId: foundUser.societyId, // Returning societyId if required in client
      }),
      { status: 200 }
    );
    return response;
  } catch (err) {
    console.error("Error during login:", err);

    return new Response(
      JSON.stringify({
        message: "Internal server error",
        status: "error",
      }),
      { status: 500 }
    );
  }
}
