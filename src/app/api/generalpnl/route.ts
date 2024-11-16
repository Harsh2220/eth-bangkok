import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const addresses = searchParams.get("addresses");

  try {
    const url = new URL(
      `https://api.1inch.dev/portfolio/portfolio/v4/general/profit_and_loss?addresses=${addresses}&use_cache=true`
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.INCH_API_KEY}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    const filteredData = data.result.filter((item: any) => item.chain_id === null)[0]; // Get the first item directly

    // Only proceed if we found a matching item
    if (filteredData) {
        const extractedData = {
            abs_profit_usd: Number(filteredData.abs_profit_usd.toFixed(2)),
            roi: Number(filteredData.roi.toFixed(4))
        };

        console.log('extractedData', extractedData);

    return NextResponse.json({ 
        data: extractedData, 
        status: 200 
    });

    }
  } catch (error) {
    return NextResponse.json({ data: error, status: 500 });
  }
}
