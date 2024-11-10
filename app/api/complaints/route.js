import connectMongo from "@/lib/db";
import complaint from "@/models/complaint";

export async function GET(req, res)
{
    try{

        await connectMongo();

        const token = req.headers.authorization?.split(" ")[1]; // Extract bearer token
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
        if (!user) {    
            return res.status(401).json({ error: "Unauthorized" });
        }

        const complaints = await complaint.find();
        res.status(200).json(complaints); 


    }catch(error){
        res.status(500).json({ error: error.message });
    }
}


export async function POST(req, res)
{
    try{

        await connectMongo();

        const token = req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const user = verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
        if (!user) {    
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { title, description, category, location, priority, attachments, status } = await req.body;

        const newComplaint = new complaint({
            title,
            description,
            category,
            location,
            priority,
            attachments,
            status
        });

        await newComplaint.save();
        res.status(201).json({ message: "Complaint created successfully", complaint: newComplaint });


    }catch(error){
        res.status(500).json({ error: error.message });
    }
}