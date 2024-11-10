import connectMongo from "@/lib/db";
import guest from "@/models/guest";

// POST: Verify QR code
export async function POST(req) {
  try {
    await connectMongo();

    const { qrData } = await req.json();

    if (!qrData) {
      return new Response(
        JSON.stringify({ error: "Missing QR data" }),
        { status: 400 }
      );
    }

    const { guestId, entryToken } = JSON.parse(qrData);

    const g = await guest.findOne({ _id: guestId, entryToken });

    if (!g) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired QR code" }),
        { status: 400 }
      );
    }

    // Mark the guest as checked-in and invalidate the token
    g.status = "checked-in";
    g.entryToken = null; // Invalidate the token
    await g.save();

    return new Response(
      JSON.stringify({ message: "QR code verified successfully", guest }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
