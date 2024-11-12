import connectMongo from "@/lib/db";
import user from "@/models/user";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongo();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const decodedUser = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const User = await user.findById(decodedUser.id);
    if (!User) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(User, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { name, email, password, age, houseNo, flatNo, photo, noOfCars, carNumbers } = await req.json();

    const newUser = new user({
      name,
      email,
      password,
      age,
      houseNo,
      flatNo,
      photo,
      noOfCars,
      carNumbers,
    });

    await newUser.save();
    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
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

    const decodedUser = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id  = decodedUser.id

    const updatedData = await req.json();
    const updatedUser = await user.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectMongo();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = new URL(req.url).searchParams;

    const deletedUser = await user.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
