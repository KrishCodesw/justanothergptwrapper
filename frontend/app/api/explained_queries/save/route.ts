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
        const {original_query, explanation}= body;

                if (!original_query || !explanation) {
      return NextResponse.json(
        { error: "Original & Corrected query are required" },
        { status: 400 }
      );
    }
        const savedExplainedQuery=await prisma.explainedQuery.create({
            data:{
               original_query,
               explanation,
               userId:userId
            }
        })
        return NextResponse.json(savedExplainedQuery, { status: 200 });
    }catch(error){
    console.error("Failed to save:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}