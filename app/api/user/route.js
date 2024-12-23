import connectMongo from "@/lib/db";
import user from "@/models/user";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { verify } from "jsonwebtoken";
import crypto from "crypto";
import { NextResponse } from "next/server";
import society from "@/models/society";

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

    // Verify admin token
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Parse request body
    const { name, email, age, houseNo, flatNo, photo } = await req.json();

    // Validate input
    if (!name || !email || !age || !houseNo || !flatNo || !photo) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Generate a random password
    const password = crypto.randomBytes(8).toString("hex");

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const url = new URL(req.url);
    const societyId = url.searchParams.get("societyId");

    // Create the user in the database
    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
      age,
      houseNo,
      flatNo,
      photo,
      societyId
    });

    // Send email with credentials
    const transporter = nodemailer.createTransport({
      service: "gmail", // Replace with your email service
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Account Details",
      text: `Hello ${name},\n\nYour account has been created. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password immediately.\n\nBest Regards,\nAdmin`,
    };

    transporter.sendMail(mailOptions,(error,emailres)=>{
      if(error) {
        return NextResponse.json({message:"error in sending email"})
      }
    });

    // Return success response
    return NextResponse.json(
      {
        message: "User created successfully, credentials sent via email",
        user: {
          name: newUser.name,
          email: newUser.email,
          age: newUser.age,
          houseNo: newUser.houseNo,
          flatNo: newUser.flatNo,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
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
