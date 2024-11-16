import { NextRequest, NextResponse } from "next/server";

interface ChainResult {
  chain_id: number | null;
  value_usd: number;
}

interface ProtocolData {
  protocol_name: string;
  result: ChainResult[];
}

interface NullChainData {
  protocol_name: string;
  value: number;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const addresses = searchParams.get("addresses");
  try {
    const url = new URL(
      `https://api.1inch.dev/portfolio/portfolio/v4/overview/erc20/current_value?addresses=${addresses}&use_cache=true`
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.INCH_API_KEY}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    console.log("data", data);
    const nullChainData: NullChainData[] = data.result.map(
      (protocol: ProtocolData) => ({
        protocol_name: protocol.protocol_name,
        value:
          protocol.result.find((item) => item.chain_id === null)?.value_usd ||
          0,
      })
    );

    // Calculate total value
    const totalValue = nullChainData.reduce(
      (sum: number, item: NullChainData) => sum + item.value,
      0
    );

    // Calculate percentages
    const protocolPercentages = nullChainData.map((item:any) => ({
      protocol_name: item.protocol_name,
      value_usd: item.value,
      percentage: ((item.value / totalValue) * 100).toFixed(2),
    }));

    console.log(protocolPercentages);

    return NextResponse.json({ data: data, status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error, status: 500 });
  }
}
