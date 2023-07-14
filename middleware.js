import { NextResponse } from "next/server";
export default function middleware(req) {
   if(req.nextUrl.pathname =="/api/gpt"){
      if(req.method != 'POST'){
       return new NextResponse("Cannot access this endpoint with " + req.method, { status: 400})
      }
   return NextResponse.next();
   }
}