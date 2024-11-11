import connectMongo from "@/lib/db";
import user from "@/models/user";
import { verify } from "jsonwebtoken";

export async function GET(req, res) {
  try {
    await connectMongo();

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decodedUser = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!decodedUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const User = await user.findById(decodedUser.id);
    if (!User) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(User);
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
    res.status(201).json({ message: "User created successfully", user: newUser });
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

    const decodedUser = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
    if (!decodedUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.query;
    if (id !== decodedUser.id) {
      return res.status(403).json({ error: "Forbidden: Cannot edit another user's data" });
    }

    const updatedData = await req.json();
    const updatedUser = await user.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
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

    const deletedUser = await user.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
