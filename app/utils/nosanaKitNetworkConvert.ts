import { NosanaNetwork } from "@nosana/kit";

export default function toNosanaNetwork(value: string): NosanaNetwork {
  if (value === NosanaNetwork.MAINNET) return NosanaNetwork.MAINNET;
  if (value === NosanaNetwork.DEVNET) return NosanaNetwork.DEVNET;
  throw new Error(`Invalid network: ${value}`);
}
