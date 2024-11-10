import connectMongo from "@/lib/db";
import announcement from "@/models/announcement";
import { verify } from "jsonwebtoken";

export async function GET(req, res) {
  try {
    await connectMongo();

    const token = req.headers.authorization?.split(" ")[1]; // Extract bearer token
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const announcements = await announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function POST(req, res) {
  try {
    await connectMongo();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) { // Ensure user is an admin
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    const { title, description, priority, attachments, notifyUsers, audience, targetedUsers } = await req.body;

    const newAnnouncement = new announcement({
      title,
      description,
      priority,
      attachments,
      notifyUsers,
      audience,
      targetedUsers
    });

    await newAnnouncement.save();
    res.status(201).json({ message: "Announcement created successfully", announcement: newAnnouncement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
