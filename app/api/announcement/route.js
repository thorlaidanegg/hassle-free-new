import connectMongo from "@/lib/db";
import announcement from "@/models/announcement";
import { verify } from "jsonwebtoken";
import { NextResponse } from 'next/server';


export async function GET(req) {
  try {
    await connectMongo();

    const token = req.headers.get('authorization')?.split(' ')[1]; // Extract bearer token
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const societyId = url.searchParams.get("societyId");

    if (!societyId) {
      return NextResponse.json({ error: "Society ID not provided" }, { status: 400 });
    }

    const announcements = await announcement.find({societyId: societyId});
    return NextResponse.json({ announcements }, { status: 200 }); // Return the response
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 }); // Ensure this is returned
  }
}


export async function POST(req) {
  try {
    await connectMongo();

    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, priority, attachments, notifyUsers, audience, targetedUsers ,societyId } = body;

    const newAnnouncement = new announcement({
      title,
      description,
      priority,
      attachments,
      notifyUsers,
      audience,
      targetedUsers,
      societyId
    });

    await newAnnouncement.save();
    return NextResponse.json(
      { message: 'Announcement created successfully', announcement: newAnnouncement },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
