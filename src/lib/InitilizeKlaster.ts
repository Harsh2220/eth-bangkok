import { initKlaster, klasterNodeHost, loadBicoV2Account } from 'klaster-sdk';

export default async function InitKlaster(address: string) {
    let klasterApp;

    if (!klasterApp) {
        const klaster = await initKlaster({
            accountInitData: loadBicoV2Account({
                owner: address as `0x${string}`,
            }),
            nodeUrl: klasterNodeHost.default,
        });
        let klasterApp = klaster
        return klaster
    }

    return klasterApp;
}
