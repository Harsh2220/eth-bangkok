import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest) {
    const { searchParams } = new URL(req.url);
    const addresses = searchParams.get("addresses");
    const timerange = searchParams.get("timerange");
  try {
    const url = new URL(
      `https://api.1inch.dev/portfolio/portfolio/v4/overview/erc20/details?addresses=${addresses}&use_cache=true&timerange=${timerange}`
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
