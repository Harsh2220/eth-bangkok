import { getRoutes, RoutesRequest } from "@lifi/sdk";
import { Address, batchTx, BridgePlugin, rawTx } from "klaster-sdk";
import { Hex } from "viem";

export default function useBridge() {
  const liFiBrigePlugin: BridgePlugin = async (data) => {
    const routesRequest: RoutesRequest = {
      fromChainId: data.sourceChainId,
      toChainId: data.destinationChainId,
      fromTokenAddress: data.sourceToken,
      toTokenAddress: data.destinationToken,
      fromAmount: data.amount.toString(),
      options: {
        order: "FASTEST",
      },
    };

    const result = await getRoutes(routesRequest);
    const route = result.routes.at(0);

    if (!route) {
      console.log("route not found");
      throw Error("...");
    }

    const routeSteps = route.steps.map((step) => {
      console.log(step);
      if (!step.transactionRequest) {
        console.log("in step txreq");
        throw Error("...");
      }
      const { to, gasLimit, data, value } = step.transactionRequest;
      if (!to || !gasLimit || !data || !value) {
        console.log("!gas");
        throw Error("...");
      }
      return rawTx({
        to: to as Address,
        gasLimit: BigInt(gasLimit),
        data: data as Hex,
        value: BigInt(value),
      });
    });

    return {
      receivedOnDestination: BigInt(route.toAmountMin),
      txBatch: batchTx(data.sourceChainId, routeSteps),
    };
  };

  return { liFiBrigePlugin };
}
