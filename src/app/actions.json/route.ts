import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET() {
  // Do whatever you want
  return NextResponse.json(
    {
      rules: [
        {
          pathPattern: "/*/proposals/**",
          apiPath: "https://actions.dialect.to/api/helium/*/proposals/**",
        },
      ],
    },
    { status: 200 }
  );
}
