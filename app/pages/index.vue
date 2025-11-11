<template>
  <div>
    <div class="container my-5">
      <section class="section">
        <div class="columns is-variable is-6">
          <div class="column is-8">
            <Intro />
            <div class="box">
              <div
                class="is-flex is-justify-content-space-between is-align-items-center mb-5"
              >
                <h2 class="title is-5 mb-0">Cast Your Vote</h2>
                <div
                  class="has-text-grey"
                  v-if="
                    votingStatus === 'active' || votingStatus === 'upcoming'
                  "
                >
                  Voting Power:
                  <template v-if="isEligible">{{
                    eligibilityInfo?.claimable_amount
                      ? (eligibilityInfo?.claimable_amount / 1e6).toFixed(2)
                      : "—"
                  }}</template>
                  <template v-else-if="hasVoted">
                    {{ eligibilityInfo?.claimed_amount
                      ? (eligibilityInfo?.claimed_amount / 1e6).toFixed(2)
                      : "—" }}
                  </template>
                  <template v-else>—</template>
                </div>
              </div>

              <template
                v-if="
                  votingStatus === 'active' &&
                  !hasVoted &&
                  !claimStatusError &&
                  !eligibilityError &&
                  (!connected || (eligibilityInfo && !claimStatusLoading))
                "
              >
                <div class="field pt-2">
                  <label
                    class="option-card is-clickable"
                    :class="{ 'is-selected': selectedOption === 'yes' }"
                  >
                    <div class="is-flex is-align-items-center">
                      <input
                        class="mr-3"
                        type="radio"
                        name="vote"
                        value="yes"
                        v-model="selectedOption"
                      />
                      <span>Yes — Adopt the updated NOS reward model</span>
                    </div>
                  </label>
                </div>

                <div class="field">
                  <label
                    class="option-card is-clickable"
                    :class="{ 'is-selected': selectedOption === 'no' }"
                  >
                    <div class="is-flex is-align-items-center">
                      <input
                        class="mr-3"
                        type="radio"
                        name="vote"
                        value="no"
                        v-model="selectedOption"
                      />
                      <span>No — Keep the current reward model</span>
                    </div>
                  </label>
                </div>
              </template>
              <template v-else-if="eligibilityError || claimStatusError">
                <div class="mt-5">
                  <p class="has-text-grey mt-3">
                    {{ eligibilityError || claimStatusError }}
                  </p>
                </div>
              </template>
              <template
                v-else-if="
                  votingStatus === 'upcoming' &&
                  (!connected ||
                    (eligibilityInfo &&
                      !claimStatusLoading &&
                      !eligibilityLoading &&
                      !hasVoted))
                "
              >
                <div class="mt-5">
                  <p class="has-text-grey mt-3">
                    Voting has not started yet. Please wait until
                    {{ formatCETDate(publicRuntimeConfig.votingStartIso) }}. You
                    can connect your wallet to check your voting power.
                  </p>
                </div>
              </template>
              <template
                v-else-if="
                  votingStatus === 'ended' &&
                  (!connected ||
                    (eligibilityInfo && !claimStatusLoading && !hasVoted))
                "
              >
                <div class="mt-5">
                  <p class="has-text-grey mt-3">Voting has ended.</p>
                </div>
              </template>
              <ClientOnly>
                <template v-if="!connected">
                  <div class="mt-5 custom-wallet-button">
                    <WalletMultiButton />
                    <p class="has-text-grey is-size-7 mt-3">
                      Connect the same wallet that held NOS at the snapshot ({{
                        formatCETDate(publicRuntimeConfig.snapshotIso)
                      }}). Once your vote is cast, it is final and cannot be
                      changed.
                    </p>
                  </div>
                </template>
                <template
                  v-else-if="
                    votingStatus === 'active' &&
                    !hasVoted &&
                    !eligibilityError &&
                    !claimStatusError &&
                    !claimStatusLoading &&
                    !eligibilityLoading
                  "
                >
                  <div class="mt-5">
                    <button
                      class="button is-primary has-text-white"
                      :class="{ 'is-loading': voteLoading }"
                      :disabled="
                        !selectedOption ||
                        !isEligible ||
                        eligibilityLoading ||
                        claimStatusLoading ||
                        votingStatus !== 'active' ||
                        voteLoading
                      "
                      @click="onVote(eligibilityInfo)"
                    >
                      Vote
                    </button>
                    <p
                      v-if="connected && !eligibilityLoading && !isEligible"
                      class="has-text-grey mt-3"
                    >
                      This wallet is not eligible to vote.
                    </p>
                    <p
                      v-else-if="
                        connected && !eligibilityLoading && eligibilityError
                      "
                      class="has-text-grey mt-3"
                    >
                      {{ eligibilityError }}
                    </p>
                    <p
                      v-if="
                        connected &&
                        !eligibilityLoading &&
                        isEligible &&
                        votingStatus === 'active'
                      "
                      class="has-text-grey is-size-7 mt-3"
                    >
                      Voting as {{ publicKey?.toBase58() }}
                    </p>

                    <div
                      class="notification is-success is-light mt-3"
                      v-if="voteSuccess"
                    >
                      Vote cast successfully!
                    </div>
                    <div
                      class="notification is-danger is-light mt-3"
                      v-if="voteError"
                    >
                      Voting failed: {{ voteError }}
                    </div>
                  </div>
                </template>
                <template v-else-if="connected && hasVoted">
                  <div class="mt-5">
                    <div class="notification is-success is-light">
                      Thank you for voting! Your vote has been cast
                      successfully.
                      <p v-if="votedFor === 'yes'" class="mt-2">
                        You voted:
                        <span class="has-text-weight-semibold">
                          Yes — Adopt the updated NOS reward model
                        </span>
                      </p>
                      <p v-else-if="votedFor === 'no'" class="mt-2">
                        You voted:
                        <span class="has-text-weight-semibold">
                          No — Keep the current reward model
                        </span>
                      </p>
                    </div>
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
          <Sidebar :votingStatus="votingStatus" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useWallet, WalletMultiButton } from "solana-wallets-vue";
import formatCETDate from "~/utils/formatDate";

const publicRuntimeConfig = useRuntimeConfig().public;
const API_URL = publicRuntimeConfig.apiUrl;
const { connected } = useWallet();
const selectedOption = ref<string | null>(null);
const voteLoading = ref(false);
const voteError = ref<string | null>(null);
const voteSuccess = ref(false);
const hasVoted = ref(false);
const claimStatusLoading = ref(false);
const claimStatusError = ref<string | null>(null);
const claimStatus = ref<any | null>(null);
const votedFor = ref<"yes" | "no" | null>(null);
const voteDetailsLoading = ref(false);

// Unix timestamps for voting start and end
const VOTING_START_TS =
  new Date(publicRuntimeConfig.votingStartIso).getTime() / 1000;
const VOTING_END_TS =
  new Date(publicRuntimeConfig.votingEndIso).getTime() / 1000;

const votingStatus = computed(() => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  if (now < VOTING_START_TS) {
    return "upcoming";
  } else if (now >= VOTING_START_TS && now < VOTING_END_TS) {
    return "active";
  } else {
    return "ended";
  }
});

type EligibilityInfo = {
  claimant: string;
  merkle_tree: string;
  mint: string;
  start_ts: number;
  end_ts: number;
  proof: number[][];
  start_amount: number;
  end_amount: number;
  unvested_amount: number;
  claimed_amount: number;
  unlocked_amount_claimed: number;
  locked_amount_withdrawn: number;
  locked_amount: number;
  claimable_amount: number;
};

const eligibilityLoading = ref(false);
const eligibilityError = ref<string | null>(null);
const eligibilityInfo = ref<EligibilityInfo | null>(null);

const isEligible = computed(
  () =>
    !!eligibilityInfo.value &&
    eligibilityInfo.value?.claimable_amount > 0 &&
    !eligibilityLoading.value
);

const onVote = async (eligibility: EligibilityInfo | null) => {
  voteLoading.value = true;
  voteError.value = null;
  voteSuccess.value = false;
  try {
    if (!connected.value || !publicKey.value || !wallet.value)
      throw new Error("Wallet not connected");
    if (!eligibility) throw new Error("Eligibility not loaded");
    if (!selectedOption.value) throw new Error("Please select an option");
    if (!isEligible.value)
      throw new Error("This wallet is not eligible to vote");
    if (hasVoted.value) throw new Error("This wallet has already voted");
    if (eligibility.claimable_amount === 0)
      throw new Error("This wallet is not eligible to vote");

    const distributor = String(eligibility.merkle_tree).trim();
    const proof = (eligibility.proof || []).map((p) => Uint8Array.from(p));
    const amountUnlocked = eligibility.claimable_amount;

    const { NosanaClient, address, ClaimTarget } = await import("@nosana/kit");
    const client = new NosanaClient(useRuntimeConfig().public.network as any);
    await client.setWallet(wallet.value.adapter as any);
    const claimInstruction = await client.merkleDistributor.claim({
      distributor: address(distributor),
      amountUnlocked,
      amountLocked: 0,
      proof,
      target: selectedOption.value === "yes" ? ClaimTarget.YES : ClaimTarget.NO,
    });

    const signature = await sendLegacyTransactionViaAdapter(
      client.config.solana.rpcEndpoint,
      wallet.value.adapter as any,
      publicKey.value.toBase58(),
      claimInstruction as any
    );
    console.log("Claim transaction:", signature);

    // small delay before checking claim status
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await checkClaimStatus();
    voteSuccess.value = true;
  } catch (err: any) {
    console.error(err);
    voteError.value = err.message;
    voteSuccess.value = false;
  }
  voteLoading.value = false;
};

const { publicKey, wallet } = useWallet();

// fetch eligibility info from API
async function fetchEligibility(pubkeyBase58: string) {
  eligibilityLoading.value = true;
  eligibilityError.value = null;
  eligibilityInfo.value = null;
  voteSuccess.value = false;
  voteError.value = null;
  try {
    const data = await $fetch<EligibilityInfo>(
      `${API_URL}/eligibility/${pubkeyBase58}`,
      {
        method: "GET",
      }
    );
    eligibilityInfo.value = data;
  } catch (err: any) {
    // 404 is not eligible
    const status = err?.response?.status || err?.statusCode;
    if (status === 404) {
      eligibilityError.value = "This wallet is not eligible to vote.";
    } else {
      eligibilityError.value = "Failed to check eligibility. Try again later.";
    }
    eligibilityInfo.value = null;
  } finally {
    eligibilityLoading.value = false;
  }
}

watch(
  [connected, publicKey],
  ([isConnected, pk]) => {
    // Reset on wallet change
    eligibilityError.value = null;
    eligibilityInfo.value = null;
    if (isConnected && pk) {
      const address = pk.toBase58();
      fetchEligibility(address);
    }
  },
  { immediate: true }
);

// Check claim/vote status with @nosana/kit
async function checkClaimStatus() {
  claimStatusLoading.value = true;
  claimStatusError.value = null;
  voteDetailsLoading.value = false;
  votedFor.value = null;
  try {
    hasVoted.value = false;
    claimStatus.value = null;
    if (!connected.value || !publicKey.value || !wallet.value)
      throw new Error("Wallet not connected");

    const distributor = eligibilityInfo.value?.merkle_tree;
    if (!distributor) throw new Error("Distributor not found");

    const { NosanaClient, address } = await import("@nosana/kit");
    const client = new NosanaClient(useRuntimeConfig().public.network as any);
    await client.setWallet(wallet.value.adapter as any);
    const status = await client.merkleDistributor.getClaimStatusForDistributor(
      address(distributor)
    );
    claimStatus.value = status;
    hasVoted.value = status !== null;
    console.log("claim status", status);
    if (status) {
      await fetchVoteDetails(status, client);
    }
  } catch (e: any) {
    claimStatusError.value = e.message;
    console.error(e);
  } finally {
    claimStatusLoading.value = false;
  }
}

async function fetchVoteDetails(status: any, client: any) {
  voteDetailsLoading.value = true;
  votedFor.value = null;
  try {
    const statusAddress = status?.address;
    if (!statusAddress) {
      throw new Error("Missing claim status address");
    }

    const signaturesResponse = await client.solana.rpc
      .getSignaturesForAddress(statusAddress)
      .send();

    const signaturesList = Array.isArray(signaturesResponse?.value)
      ? signaturesResponse.value
      : signaturesResponse;

    if (!Array.isArray(signaturesList) || signaturesList.length === 0) {
      console.error("No vote transactions found.");
      return;
    }

    const claimSignatureInfo = signaturesList[signaturesList.length - 1];
    const claimSignature = claimSignatureInfo?.signature;

    if (!claimSignature) {
      return;
    }

    const transactionResponse = await client.solana.rpc
      .getTransaction(claimSignature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      })
      .send();

    const yesAddress = publicRuntimeConfig.yesAddress;
    const noAddress = publicRuntimeConfig.noAddress;

    // check changes balances in the transaction
    const postBalances = Array.isArray(
      transactionResponse?.meta?.postTokenBalances
    )
      ? transactionResponse.meta.postTokenBalances
      : [];

    // find match with yes or no address in the post balances
    const match = postBalances.find((balance: any) => {
      const owner = balance?.owner;
      return owner === yesAddress || owner === noAddress;
    });

    if (match?.owner === yesAddress) {
      votedFor.value = "yes";
    } else if (match?.owner === noAddress) {
      votedFor.value = "no";
    } else {
      console.error("Unable to determine vote option from transaction.");
    }
  } catch (err: any) {
    console.error("Failed to load vote details:", err);
  } finally {
    voteDetailsLoading.value = false;
  }
}

watch(eligibilityInfo, () => {
  if (eligibilityInfo.value) {
    checkClaimStatus();
  }
});
</script>
