import { NextResponse, NextRequest } from "next/server";

export async function GET(req:NextRequest ) {
    const { searchParams } = new URL(req.url);
    const addresses = searchParams.get("addresses");
    const timerange = searchParams.get("timerange");
    const chain_id = searchParams.get("chain_id");
  try {
    const url = new URL(
      `https://api.1inch.dev/portfolio/portfolio/v4/general/value_chart?addresses=${addresses}`
    );

    if (chain_id) {
      url.searchParams.append("chain_id", chain_id);
    }
    if (timerange) {
      url.searchParams.append("timerange", timerange);
    } else {
      url.searchParams.append("timerange", "1year");
    }

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
