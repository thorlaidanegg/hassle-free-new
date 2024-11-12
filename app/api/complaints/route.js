import connectMongo from "@/lib/db";
import complaint from "@/models/complaint";
import { verify } from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongo();

    const token = req.headers.get('authorization')?.split(" ")[1]; // Extract bearer token
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const complaints = await complaint.find();
    return NextResponse.json(complaints, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();

    const token = req.headers.get('authorization')?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, category, location, priority, photos, status ,subCategory,estimatedCost} = await req.json();

    const newComplaint = new complaint({
      title,
      description,
      category,
      location,
      priority,
      photos,
      status,
      subCategory,
      estimatedCost,
      userId: user.id, // Set userId from the token
    });

    await newComplaint.save();
    return NextResponse.json(
      { message: "Complaint created successfully", complaint: newComplaint },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectMongo();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id"); // Extract the complaint ID from query params

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing complaint ID" }, { status: 400 });
    }

    const updateData = await req.json(); // Get update fields from request body

    const updatedComplaint = await complaint.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Complaint updated successfully", complaint: updatedComplaint },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}