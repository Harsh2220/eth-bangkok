import { NextResponse } from "next/server";

export async function GET() {
  //   const { searchParams } = new URL(req.url);
  //   const addresses = searchParams.get("addresses");
  console.log("first");
  try {
    const url = new URL(
      "https://api.1inch.dev/portfolio/portfolio/v4/general/current_value?addresses=0x16047f2cca5949b8339cb256eae042b41a3a3760&use_cache=true"
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.INCH_API_KEY}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json({ data: data, status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error, status: 500 });
  }
}
