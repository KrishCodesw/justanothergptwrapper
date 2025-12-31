import { NextResponse } from "next/server";
import {prisma} from "@/lib/prismaClient"
import { getCurrentUser } from "../../auth/me/route";
export async function POST(req:Request){
    try{
        const userId=await getCurrentUser();
        if(!userId){
            return NextResponse.json({error:"Unauthorized"},{status:401});
        }
        const body= await req.json();
        const {guestHistory}=body;

        if(!guestHistory||!Array.isArray(guestHistory)||guestHistory.length===0){
            return NextResponse.json({message:"Nothing to sync"},{status:200})
        }

        await prisma.correctedQuery.createMany({
            data: guestHistory.map((item:any)=>({
               original_query:item.original_query,
               corrected_query:item.corrected_query,
               type:item.type,
               risk_level: item.risk_level,
               confidence: item.confidence ?? null,
               changes_made: item.changes_made,
               userId:userId,
               created_at:new Date(item.timestamp),
            }))
        })
    return NextResponse.json({ success: true, count: guestHistory.length }, { status: 200 });


    }catch(error){
    console.error("Sync failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}