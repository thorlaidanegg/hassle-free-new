import connectMongo from "@/lib/db";
import admin from "@/models/admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectMongo();

    const {
      name,
      email,
      password,
      societyName,
      societyAddress,
      pincode,
      latitude,
      longitude, // added longitude
    } = await req.json(); // Use `req.json()` to parse body in Next.js app router

    if (
      !name ||
      !email ||
      !password ||
      !societyName ||
      !societyAddress ||
      !pincode ||
      !latitude ||
      !longitude
    ) {
      return new Response(
        JSON.stringify({ message: "Please provide all the details" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await admin.create({
      name,
      email,
      password: hashedPassword,
      society: {
        name: societyName,
        address: societyAddress,
        pincode: pincode,
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      },
    });

    return new Response(
      JSON.stringify({ message: "Admin created successfully", status: "success" }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Something went wrong", status: "error" }),
      { status: 500 }
    );
  }
}
