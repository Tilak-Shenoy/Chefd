import { NextResponse } from "next/server";
export default function middleware(req) {
   if(req.nextUrl.pathname =="/api/gpt"){
      if(req.method != 'POST'){
       return new NextResponse("Cannot access this endpoint with " + req.method, { status: 400})
      }

      if(req.body.ingredients === undefined){
         return new NextResponse("Cannot access endpoint without ingredients", {status: 400})
      } else{
         const response = await fetch('/../api/gpt');
         const recipe = response.json();

         return new Response(JSON.stringify({ title: recipe }), {
           status: 200,
           headers: {
             'Content-Type': 'application/json',
           },
         });
      }
   return NextResponse.next();
   }
}