import connectMongo from "@/lib/db";
import amenity from "@/models/amenity";
import { verify } from "jsonwebtoken";

export async function GET(req, res) {
  try {
    await connectMongo();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const amenities = await amenity.find();
    res.status(200).json(amenities);
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
    if (!admin) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    const { name, type, description, photos, capacity, timings, rules, status, maintenanceSchedule, pricing, location, amenityManager } = await req.json();

    const newAmenity = new amenity({
      name,
      type,
      description,
      photos,
      capacity,
      timings,
      rules,
      status,
      maintenanceSchedule,
      pricing,
      location,
      amenityManager,
    });

    await newAmenity.save();
    res.status(201).json(newAmenity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function PUT(req, res) {
  try {
    await connectMongo();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    const { id } = req.query;
    const updatedData = await req.json();

    const updatedAmenity = await amenity.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedAmenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }

    res.status(200).json(updatedAmenity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function DELETE(req, res) {
  try {
    await connectMongo();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    const { id } = req.query;

    const deletedAmenity = await amenity.findByIdAndDelete(id);
    if (!deletedAmenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }

    res.status(200).json({ message: "Amenity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
