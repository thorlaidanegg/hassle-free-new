    import connectMongo from "@/lib/db";
    import vehicle from "@/models/vehicle";
    import { verify } from "jsonwebtoken";
    import { NextResponse } from "next/server";

    export async function GET(req, res)
    {
        try{
            await connectMongo();

            const authHeader = req.headers.get("authorization");
            const token = authHeader?.split(" ")[1];
            
            if (!token) {
                return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
            }
                    
            const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
            if (!user) {
                return NextResponse.json({ error: "UnAuthorised" }, { status: 403 });
            }
            
            const url = new URL(req.url);
            const societyId = url.searchParams.get("societyId");

            const userVehicle = await vehicle.find({ userId:user.id , societyId:societyId});

            return NextResponse.json(
                { userVehicle },
                { status: 201 }
            );

        }catch(err){
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }


    export async function POST(req, res)
    {
        try{
            await connectMongo();

            const authHeader = req.headers.get("authorization");
            const token = authHeader?.split(" ")[1];
            
            if (!token) {
                return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
            }
                    
            const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
            if (!user) {
                return NextResponse.json({ error: "UnAuthorised" }, { status: 403 });
            }
            
            const url = new URL(req.url);
            const societyId = url.searchParams.get("societyId");

            const body = await req.json()
            const {number,name,type} = body

            const newVehicle = new vehicle({
                number,
                name,
                type,
                societyId:societyId,
                userId: user.id
            })

            await newVehicle.save();
            return NextResponse.json(
                { message: "Vehicle added successfully", vehicle: newVehicle ,success:true},
                { status: 201 }
            );

        }catch(err){
            return NextResponse.json({ error: err.message ,success:false}, { status: 500 });
        }
    }

export async function DELETE(req, res) {
    try {
        await connectMongo();

        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
        }

        const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const url = new URL(req.url);
        const vehicleId = url.searchParams.get("vehicleId");

        if (!vehicleId) {
            return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });
        }

        // Check if the vehicle exists and belongs to the user
        const vehicleToDelete = await vehicle.findOne({ _id: vehicleId, userId: user.id });
        if (!vehicleToDelete) {
            return NextResponse.json(
                { error: "Vehicle not found or does not belong to the user" },
                { status: 404 }
            );
        }

        // Delete the vehicle
        await vehicle.deleteOne({ _id: vehicleId });

        return NextResponse.json(
            { message: "Vehicle deleted successfully", success: true },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message, success: false }, { status: 500 });
    }
}