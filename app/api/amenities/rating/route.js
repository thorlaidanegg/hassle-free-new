import connectMongo from "@/lib/db";
import AmenityRating from "@/models/amenityRating";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

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

    const url = new URL(req.url);
    const amenityId = url.searchParams.get("amenityId");

    if (!amenityId) {
      return NextResponse.json({ error: "Amenity ID is required" }, { status: 400 });
    }

    const ratings = await AmenityRating.find({ amenityId }).populate('userId', 'name'); // Example of populating user data
    return NextResponse.json(ratings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
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

    const { amenityId, rating, cleanliness, maintenance, staff, equipment, review, photos, bookingId, isVerifiedBooking } = await req.json();

    if (!amenityId || !rating) {
      return NextResponse.json({ error: "Amenity ID and rating are required" }, { status: 400 });
    }

    const newRating = new AmenityRating({
      amenityId,
      userId: user.id, // Extracted from the token
      bookingId,
      rating,
      cleanliness,
      maintenance,
      staff,
      equipment,
      review,
      photos,
      isVerifiedBooking
    });

    await newRating.save();
    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
