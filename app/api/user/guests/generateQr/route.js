import connectMongo from "@/lib/db";
import guest from "@/models/guest";
import QRCode from "qrcode";
import { verify } from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectMongo();

    const { userId, guestId } = await req.json();

    if (!userId || !guestId) {
      return new Response(
        JSON.stringify({ error: "Missing userId or guestId" }),
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

    // Verify the access token
    let decoded;
    try {
      decoded = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    } catch {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { status: 401 }
      );
    }

    if (decoded.id !== userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid user" }),
        { status: 403 }
      );
    }

    const g = await guest.findOne({ _id: guestId, userId });

    if (!g) {
      return new Response(
        JSON.stringify({ error: "Guest not found" }),
        { status: 404 }
      );
    }

    // Generate a unique QR code
    const qrData = JSON.stringify({ guestId: g._id, entryToken: `entry-${Date.now()}` });
    const qrCode = await QRCode.toDataURL(qrData);

    // Save the entry token and QR code in the guest record
    g.entryToken = JSON.parse(qrData).entryToken;
    g.qrCode = qrCode;
    await g.save();

    return new Response(
      JSON.stringify({ qrCode, message: "QR code generated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
