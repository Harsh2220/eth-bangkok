import {
  BiconomyV2AccountInitData,
  KlasterSDK,
  initKlaster,
  klasterNodeHost,
  loadBicoV2Account,
} from "klaster-sdk";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function useKlaster() {
  const [klaster, setKlaster] =
    useState<KlasterSDK<BiconomyV2AccountInitData>>();
  const { address } = useAccount();

  async function InitKlaster() {
    const klaster = await initKlaster({
      accountInitData: loadBicoV2Account({
        owner: address as `0x${string}`,
      }),
      nodeUrl: klasterNodeHost.default,
    });

    setKlaster(klaster);
  }

  useEffect(() => {
    if (address) {
      InitKlaster();
    }
  }, [address]);

  return { klaster, InitKlaster };
}
