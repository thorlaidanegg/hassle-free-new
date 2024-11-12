import connectMongo from "@/lib/db";
import amenity from "@/models/amenity";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken"; // Ensure this import is correct

export async function GET(req, { params }) {
  try {
    await connectMongo();

    const { id } = params; // Extract the ID from params
    if (!id) {
      return NextResponse.json({ error: "Amenity ID is required" }, { status: 400 });
    }

    const token = req.headers.get('authorization')?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const Amenity = await amenity.findById(id);
    if (!Amenity) {
      return NextResponse.json({ error: "Amenity not found" }, { status: 404 });
    }

    return NextResponse.json(Amenity, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(req, { params }) {
  try {
    await connectMongo();

    const { id } = params; // Extract the ID from params
    if (!id) {
      return NextResponse.json({ error: "Amenity ID is required" }, { status: 400 });
    }

    const token = req.headers.get('authorization')?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const updatedFields = await req.json(); // Parse the request body to get updated fields

    const updatedAmenity = await amenity.findByIdAndUpdate(id, updatedFields, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation for updated fields
    });

    if (!updatedAmenity) {
      return NextResponse.json({ error: "Amenity not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAmenity, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}