import connectMongo from "@/lib/db";
import guest from "@/models/guest";
import { verify } from "jsonwebtoken";

// POST: Add a new guest
export async function POST(req) {
  try {
    await connectMongo();

    const { name, noOfPeople, date, carNo, purpose, validUntil } = await req.json();

    if (!name || !noOfPeople || !date || !purpose || !validUntil) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: No token provided" }),
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    } catch {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { status: 401 }
      );
    }

    const newGuest = new guest({
      guestId: `guest-${Date.now()}`, // Unique guest ID
      name,
      noOfPeople,
      date,
      carNo,
      purpose,
      userId: decoded.id,
      status: "pending",
      validUntil,
      qrCode :"sample"
    });

    await newGuest.save();

    return new Response(
      JSON.stringify({
        message: "Guest added successfully",
        guest: newGuest
      }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}

// GET: Retrieve all guests for the authenticated user
export async function GET(req) {
  try {
    await connectMongo();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: No token provided" }),
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    } catch {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { status: 401 }
      );
    }

    const guests = await guest.find({ userId: decoded.id }).sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({
        message: "Guests retrieved successfully",
        guests
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
