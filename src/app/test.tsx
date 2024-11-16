import React, { useState } from 'react';
import { getRoutes, RoutesRequest } from "@lifi/sdk";
import { encodeBridgingOps, BridgePlugin, rawTx, batchTx, mcUSDC, buildMultichainReadonlyClient, buildRpcInfo, buildItx,  } from "klaster-sdk";

import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { Loader2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Separator from '@radix-ui/react-separator';
import * as Tooltip from '@radix-ui/react-tooltip';
import { base, optimism } from 'viem/chains';

const CHAINS = {
  POLYGON: { id: 137, name: 'Polygon', symbol: 'MATIC' },
  OPTIMISM: { id: 10, name: 'Optimism', symbol: 'OP' },
  SCROLL: { id: 534352, name: 'Scroll', symbol: 'ETH' },
  BASE: { id: 8453, name: 'Base', symbol: 'ETH' }
};

// LiFi Bridge Plugin implementation
const liFiBridgePlugin: BridgePlugin = async (data) => {
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
    throw Error('No route found');
  }

  const routeSteps = route.steps.map(step => {
    if(!step.transactionRequest) { 
      throw Error('Transaction request missing'); 
    }
    const { to, gasLimit, data: txData, value} = step.transactionRequest;
    if(!to || !gasLimit || !txData || !value) { 
      throw Error('Missing transaction parameters'); 
    } 
    return rawTx({
      to: to as `0x${string}`,
      gasLimit: BigInt(gasLimit),
      data: txData as `0x${string}`,
      value: BigInt(value)
    });
  });

  return {
    receivedOnDestination: BigInt(route.toAmountMin),
    txBatch: batchTx(data.sourceChainId, routeSteps)
  };
};

export const KlasterBridge = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [destinationChain, setDestinationChain] = useState(CHAINS.BASE.id);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [bridgeOps, setBridgeOps] = useState(null);

  // Function to handle the bridge operation
  const handleBridge = async () => {
    if (!address || !amount) return;
    
    setLoading(true);
    setStatus('Calculating optimal route...');

    const mcClient = buildMultichainReadonlyClient([
      buildRpcInfo(optimism.id, 'https://optimism-rpc'),
      buildRpcInfo(base.id, 'https://base-rpc'),
      //... add the rest of the chains
    ])
    
    try {
      // Get unified balance
      const uBalance = await mcClient.getUnifiedErc20Balance({
        tokenMapping: mcUSDC,
        account: klaster.account, //0x34fE1bCb0aBd94C17825ED7795870158FC8039dc
      });

      // Encode bridging operations
      const ops = await encodeBridgingOps({
        tokenMapping: mcUSDC,
        account: klaster.account,
        amount: parseUnits(amount, uBalance.decimals),
        bridgePlugin: liFiBridgePlugin,
        client: mcClient,
        destinationChainId: destinationChain,
        unifiedBalance: uBalance,
      });

      // Build interchain transaction
      const iTx = buildItx({
        steps: ops.steps,
        feeTx: klaster.encodePaymentFee(CHAINS.OPTIMISM.id, "USDC"),
      });

      setBridgeOps(ops);
      setStatus('Route calculated successfully!');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Bridge Tokens
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-xl font-bold mb-4">
            Bridge Tokens
          </Dialog.Title>

          <ScrollArea.Root className="h-full w-full">
            <ScrollArea.Viewport className="h-full w-full">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Amount</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder="Enter amount"
                    />
                    <span className="text-sm text-gray-500">USDC</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Destination Chain</label>
                  <select
                    value={destinationChain}
                    onChange={(e) => setDestinationChain(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  >
                    {Object.values(CHAINS).map(chain => (
                      <option key={chain.id} value={chain.id}>
                        {chain.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Separator.Root className="h-[1px] bg-slate-200 my-4" />

                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        onClick={handleBridge}
                        disabled={loading || !amount || !address}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 w-full"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Bridge Tokens'
                        )}
                      </button>
                    </Tooltip.Trigger>
                    {(!amount || !address) && (
                      <Tooltip.Content className="bg-slate-900 text-white text-sm px-2 py-1 rounded">
                        {!address ? 'Please connect wallet' : 'Enter an amount'}
                      </Tooltip.Content>
                    )}
                  </Tooltip.Root>
                </Tooltip.Provider>

                {status && (
                  <div className="rounded-lg border p-4 text-sm">
                    {status}
                  </div>
                )}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>

          <Dialog.Close className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none">
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default KlasterBridge;