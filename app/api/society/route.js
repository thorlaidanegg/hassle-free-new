import connectMongo from "@/lib/db";
import society from "@/models/society"; // Ensure correct path
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongo();

    const token = req.headers.get("authorization")?.split(" ")[1]; // Extract bearer token
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    let user;
    try {
      user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    } catch (err) {
      try {
        user = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
      } catch (err) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const societyId = url.searchParams.get("societyId");

    if (!societyId) {
      return NextResponse.json({ error: "Society ID not provided" }, { status: 400 });
    }

    const societies = await society.findById(societyId);

    return NextResponse.json(societies, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();

    const token = req.headers.get("authorization")?.split(" ")[1]; // Extract bearer token
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN); // Verify admin token
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Inject `adminId` into society creation
    const newSociety = new society({
      ...body,
      adminId: admin.id, // Ensure `id` matches JWT payload structure
    });

    const savedSociety = await newSociety.save();

    return NextResponse.json(savedSociety, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
