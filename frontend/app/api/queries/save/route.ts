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
        const {prompt,sql,schema}= body;
        const savedQuery=await prisma.generatedQuery.create({
            data:{
                prompt,
                sql,
                sourceSchema:schema,
                userId:userId
            }
        })
        return NextResponse.json(savedQuery, { status: 200 });
    }catch(error){
    console.error("Failed to save:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}