import { NextResponse } from "next/server";
import {prisma} from "@/lib/prismaClient"
import { getCurrentUser } from "../../auth/me/route";

export async function POST(req:Request){
    try{
        const userId=await getCurrentUser()
        if(!userId){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
        const body=await req.json();
        const {original_query,
                corrected_query,
                type,
                risk_level,
                confidence,
                changes_made,}= body;

                if (!original_query || !corrected_query) {
      return NextResponse.json(
        { error: "Original & Corrected query are required" },
        { status: 400 }
      );
    }
        const savedCorrectedQuery=await prisma.correctedQuery.create({
            data:{
               original_query,
               corrected_query,
               type:type ?? "Unknown",
               risk_level: risk_level ?? "low",
               confidence: confidence ?? null,
               changes_made: Array.isArray(changes_made) ? changes_made : [],
               userId:userId
            }
        })
        return NextResponse.json(savedCorrectedQuery, { status: 200 });
    }catch(error){
    console.error("Failed to save:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}