import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET() {
    let response = NextResponse.json(
      {
        rules: [
          {
            pathPattern: "/*/proposals/**",
            apiPath: "https://helium.dial.to/*/proposals/**",
          },
        ],
      },
      { status: 200 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
}
