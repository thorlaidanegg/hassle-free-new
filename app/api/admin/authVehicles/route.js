import connectMongo from "@/lib/db"
import vehicle from "@/models/vehicle";
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req,res){
    try{

        await connectMongo();

        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];

        if (!token) {
        return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
        }
        
        const admin = verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
        if (!admin) {
        return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const url = new URL(req.url);
        const societyId = url.searchParams.get("societyId");

        const vehicles = await vehicle.find({societyId: societyId})
       
        return NextResponse.json({vehicles},{status: 200});

    }catch(err){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}