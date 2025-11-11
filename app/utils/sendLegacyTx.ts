import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

export async function sendLegacyTransactionViaAdapter(
  rpcEndpoint: string,
  adapter: any,
  feePayerBase58: string,
  kitIx: any,
  opts?: Parameters<Connection["sendRawTransaction"]>[1]
): Promise<string> {
  const conn = new Connection(rpcEndpoint, "confirmed");
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash("confirmed");
 
  const keys =
    (kitIx.accounts || []).map((m: any) => ({
      pubkey: new PublicKey(m.address),
      isSigner: !!m.signer,
      isWritable: m.role === 1, // AccountRole.WRITABLE
    })) ?? [];

  const ix = new TransactionInstruction({
    programId: new PublicKey(kitIx.programAddress),
    keys,
    data: Buffer.from(kitIx.data),
  });

  const tx = new Transaction({
    feePayer: new PublicKey(feePayerBase58),
    recentBlockhash: blockhash,
  }).add(ix);

  const signed = await adapter.signTransaction(tx);
  const sig = await conn.sendRawTransaction(signed.serialize(), opts);
  await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
  return sig;
}