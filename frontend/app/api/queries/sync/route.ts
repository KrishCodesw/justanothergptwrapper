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

        await prisma.generatedQuery.createMany({
            data: guestHistory.map((item:any)=>({
                prompt:item.query,
                sql:item.sql,
                sourceSchema:item.schema??"unknown",
                userId:userId,
                created_at:new Date(item.timestamp)
            }))
        })
    return NextResponse.json({ success: true, count: guestHistory.length }, { status: 200 });


    }catch(error){
console.error("Sync failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}