import { NextResponse } from "next/server";

export async function GET() {
  //   const { searchParams } = new URL(req.url);
  //   const addresses = searchParams.get("addresses");
  try {
    const url = new URL(
      "https://api.1inch.dev/portfolio/portfolio/v4/overview/protocols/current_value?addresses=0x111423FA917A010A4f62c9B2742708744B4CbFc4&use_cache=true"
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
