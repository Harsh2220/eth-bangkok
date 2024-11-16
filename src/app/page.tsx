"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { createWalletClient, http, parseEther } from "viem";
import {
  initKlaster,
  klasterNodeHost,
  loadBicoV2Account,
} from "klaster-sdk";
import { optimism, base, polygon } from "viem/chains";
import {
  useAppKitAccount,
  useAppKitProvider,
  useAppKit,
} from "@reown/appkit/react";
import type {
  InterchainTransaction,

} from "klaster-sdk";
import { Address, getAddress } from "viem";

const USDT_ABI = [
  {
    inputs: [{ internalType: "address", name: "_proxyTo", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_new",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_old",
        type: "address",
      },
    ],
    name: "ProxyOwnerUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "_new", type: "address" },
      { indexed: true, internalType: "address", name: "_old", type: "address" },
    ],
    name: "ProxyUpdated",
    type: "event",
  },
  { stateMutability: "payable", type: "fallback" },
  {
    inputs: [],
    name: "implementation",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxyOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxyType",
    outputs: [
      { internalType: "uint256", name: "proxyTypeId", type: "uint256" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferProxyOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_newProxyTo", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "updateAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newProxyTo", type: "address" }],
    name: "updateImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];

export default function KlasterDemo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  // Reown AppKit hooks
  const { isConnected, address } = useAppKitAccount();
  const provider = useAppKitProvider("eip155");
  const appKit = useAppKit();
  const USDT_DECIMALS = 6;
  const USDT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';


  const approveToken = async (
    signer: ethers.JsonRpcSigner,
    tokenAddress: string,
    spenderAddress: string,
    requiredAmount: string
  ) => {
    try {
      console.log('Starting token approval...');
      console.log({
        tokenAddress,
        spenderAddress,
        requiredAmount
      });

      const tokenContract = new ethers.Contract(
        tokenAddress,
        USDT_ABI,
        signer
      );

      setStatus('Approving USDT...');
      console.log('Sending approval transaction...');
      
      // Approve with a slightly higher amount to ensure sufficient allowance
      const amount = BigInt(requiredAmount) * BigInt(2);
      
      const approveTx = await tokenContract.approve(
        spenderAddress,
        amount,
        {
          gasLimit: 100000
        }
      );
      
      console.log('Approval transaction hash:', approveTx.hash);
      setStatus('Waiting for approval confirmation...');
      
      await approveTx.wait();
      console.log('Approval transaction confirmed');

    } catch (error) {
      console.error('Approval error:', error);
      throw new Error('Failed to approve USDT');
    }
  };


  console.log("Is connected:", isConnected);

  const executeInterchainTransaction = async () => {
    if (!address || !isConnected || !provider) {
      setError("Please connect your wallet first");
      appKit.open(); // Open Reown AppKit modal
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStatus("Initializing...");

      const formattedAddress = getAddress(address);
      const walletProvider = provider.walletProvider as ethers.Eip1193Provider;

      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      // const signer = createWalletClient({
      //   transport: http(
      //     'https://polygon-mainnet.g.alchemy.com/v2/JxWlGwJmN3m6cTpQ0JDktyI7pafFtMC7',
      //   ),
      // })
      const klaster = await initKlaster({
        accountInitData: loadBicoV2Account({
          owner: formattedAddress,
        }),
        nodeUrl: klasterNodeHost.default,
      });

      console.log("Klaster initialized:", klaster);
      console.log("Smart address :- ", klaster.account.uniqueAddresses);

      setStatus("Building transaction...");

      const transaction = {
        to: formattedAddress,
        value: parseEther("0.00001"),
        gasLimit: BigInt(75000),
      };
      console.log("Transaction:", transaction);

      const optimismOperation = {
        chainId: optimism.id,
        txs: [transaction],
      };

      const baseOperation = {
        chainId: base.id,
        txs: [transaction],
      };
      console.log("Optimism operation:", optimismOperation);
      console.log("Base operation:", baseOperation);

      const nodeFeeOperation = {
        token: getAddress("0xc2132D05D31c914a87C6611C10748AEb04B58e8F"), // USDT contract address
        chainId: polygon.id,
      };
      console.log("Node fee operation:", nodeFeeOperation);

      const iTx: InterchainTransaction = {
        steps: [optimismOperation, baseOperation],
        feeTx: nodeFeeOperation,
      };
      console.log("Interchain transaction:", iTx);

      setStatus("Fetching quote...");
      const quote = await klaster.getQuote(iTx);
      console.log("Quote:", quote);
      console.log('Node address:', quote.node);
      // console.log('Payment amount:', quote.paymentInfo.tokenWeiAmount);

      // Try to approve first
      // await approveToken(
      //   signer,
      //   USDT_ADDRESS,
      //   quote.node,
      //   quote.paymentInfo.tokenWeiAmount
      // );

      setStatus("Requesting signature...");

      // Use provider's signer to sign the message
      // const signature = await signer.signMessage({
      //   message: quote.itxHash,
      //   account: formattedAddress as `0x${string}`, // Added the account parameter
      // });

      const messageBytes = ethers.getBytes(quote.itxHash);

      // Sign using ethers signer
      const signature = await signer.signMessage(messageBytes);

      console.log("Signature:", signature);

      setStatus("Executing transaction...");
      const result = await klaster.execute(quote, signature);

      setTxHash(result.itxHash);
      setStatus("Transaction submitted successfully!");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Klaster Interchain Transaction Demo
          </h1>

          <div className="space-y-6">
            {/* Connect Wallet Button (when not connected) */}
            {!isConnected && (
              <button
                onClick={() => appKit.open()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            )}

            {/* Wallet Status */}
            {isConnected && address && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">Connected: {address}</p>
              </div>
            )}

            {/* Status Display */}
            {status && (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-blue-700">{status}</p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-700">Error: {error}</p>
              </div>
            )}

            {/* Success Display */}
            {txHash && (
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-700">Transaction Hash: {txHash}</p>
                <a
                  href={`https://explorer.klaster.io/details/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-500 underline mt-2 inline-block"
                >
                  View on Explorer
                </a>
              </div>
            )}

            {/* Execute Button (only shown when connected) */}
            {isConnected && (
              <button
                onClick={executeInterchainTransaction}
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? "Processing..." : "Execute Test Transaction"}
              </button>
            )}
          </div>

          {/* Transaction Details */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Transaction Details
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Sends 0.00001 ETH on Optimism</p>
              <p>• Sends 0.00001 ETH on Base</p>
              <p>• Pays fees in USDT on Polygon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
