import connectMongo from "@/lib/db";
import amenity from "@/models/amenity";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

// GET handler
export async function GET(req) {
  try {
    await connectMongo();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const amenities = await amenity.find();
    return NextResponse.json(amenities, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler
export async function POST(req) {
  try {
    await connectMongo();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();

    const newAmenity = new amenity(body);
    await newAmenity.save();

    return NextResponse.json(newAmenity, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT handler
export async function PUT(req) {
  try {
    await connectMongo();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const updatedData = await req.json();

    const updatedAmenity = await amenity.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedAmenity) {
      return NextResponse.json({ error: "Amenity not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAmenity, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(req) {
  try {
    await connectMongo();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const deletedAmenity = await amenity.findByIdAndDelete(id);
    if (!deletedAmenity) {
      return NextResponse.json({ error: "Amenity not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Amenity deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
