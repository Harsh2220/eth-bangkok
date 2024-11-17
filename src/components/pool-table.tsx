import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ABI } from "@/constants/abi";
import { AAVE_CONTRACT } from "@/constants/contracts";
import useBridge from "@/hooks/useBridge";
import useKlaster from "@/hooks/useKlaster";
import { Pool } from "@/hooks/usePools";
import { TOKENS } from "@/types";
import getTokenContract from "@/utils/getTokenContract";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  MultichainClient,
  MultichainTokenMapping,
  buildItx,
  buildMultichainReadonlyClient,
  buildTokenMapping,
  deployment,
  encodeBridgingOps,
  rawTx,
  singleTx,
} from "klaster-sdk";
import { useState } from "react";
import { createWalletClient, encodeFunctionData, http, parseUnits } from "viem";
import { Chain, arbitrum, base, optimism, polygon } from "viem/chains";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const PoolTableComponent = ({ data }: { data: Pool[] }) => {
  const { klaster } = useKlaster();
  const { liFiBrigePlugin } = useBridge();
  const { address } = useAccount();
  const [amount, setAmount] = useState("");

  async function handleLend(chain: Chain) {
    try {
      if (!klaster || !address) return;

      const mcClient = buildMultichainReadonlyClient(
        [optimism, base, polygon, arbitrum].map((x) => {
          return {
            chainId: x.id,
            rpcUrl: x.rpcUrls.default.http[0],
          };
        })
      );

      const mcUSDC = buildTokenMapping([
        deployment(optimism.id, getTokenContract(optimism, TOKENS.USDC)!),
        deployment(base.id, getTokenContract(base, TOKENS.USDC)!),
        deployment(arbitrum.id, getTokenContract(arbitrum, TOKENS.USDC)!),
        deployment(polygon.id, getTokenContract(polygon, TOKENS.USDC)!),
      ]);

      const intersectTokenAndClients = (
        token: MultichainTokenMapping,
        mcClient: MultichainClient
      ) => {
        return token.filter((deployment) =>
          mcClient.chainsRpcInfo
            .map((info) => info.chainId)
            .includes(deployment.chainId)
        );
      };

      const mUSDC = intersectTokenAndClients(mcUSDC, mcClient);

      const uBalance = await mcClient.getUnifiedErc20Balance({
        tokenMapping: mUSDC,
        account: klaster.account,
      });

      console.log(
        uBalance,
        uBalance.balance - parseUnits("1", uBalance.decimals)
      );

      const bridgingOps = await encodeBridgingOps({
        tokenMapping: mUSDC,
        account: klaster?.account,
        amount: uBalance.balance - parseUnits("1", uBalance.decimals),
        bridgePlugin: liFiBrigePlugin,
        client: mcClient,
        destinationChainId: chain.id,
        unifiedBalance: uBalance,
      });

      console.log(bridgingOps, "opasd");
      const tokenAddress = getTokenContract(chain, TOKENS.USDC);

      if (!tokenAddress) return;

      const supplyTx = rawTx({
        gasLimit: BigInt(100000),
        to: AAVE_CONTRACT,
        data: encodeFunctionData({
          abi: ABI,
          functionName: "supply",
          args: [tokenAddress, BigInt(amount), address, 0],
        }),
      });

      const iTx = buildItx({
        steps: bridgingOps.steps.concat(singleTx(chain.id, supplyTx)),
        feeTx: klaster.encodePaymentFee(chain.id, "USDC"),
      });

      const quote = await klaster.getQuote(iTx);

      const signer = createWalletClient({
        transport: http(),
      });

      const signed = await signer.signMessage({
        message: {
          raw: quote.itxHash,
        },
        account: address,
      });

      const result = await klaster.execute(quote, signed);

      return result;
    } catch (error) {
      console.log("ererer", error);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="!border-b-0">
          <TableHead className="w-[200px]">Token</TableHead>
          <TableHead className="text-right">Chain</TableHead>
          <TableHead className="text-right">APY</TableHead>
          <TableHead className="text-right">APR</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((data) => (
          <TableRow key={data.token.address} className="!border-b-0">
            <TableCell className="font-medium flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={data.token.image}
                  alt="@shadcn"
                  className="rounded-lg"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {data.token.symbol}
            </TableCell>
            <TableCell className="text-right">{data.chain.name}</TableCell>
            <TableCell className="text-right">
              {data.supplyYield.toFixed(2)}%
            </TableCell>
            <TableCell className="text-right">
              {data.borrowYield.toFixed(2)}%
            </TableCell>
            <TableCell className="text-right flex gap-2 justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size={"sm"}>Lend</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Lend</DialogTitle>
                    <DialogDescription>
                      Lend token from various chain and earn highest yield
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="name"
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                        type="number"
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    onClick={() => handleLend(data.chain)}
                  >
                    Borrow
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Borrow</DialogTitle>
                    <DialogDescription>
                      Borrow token from various chain and pay lowest debt
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="name"
                        defaultValue="Pedro Duarte"
                        className="col-span-3"
                        type="number"
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PoolTableComponent;
