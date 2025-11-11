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
                  <template v-else>—</template>
                </div>
              </div>

              <template
                v-if="
                  votingStatus === 'active' &&
                  !hasVoted &&
                  !claimStatusError &&
                  !eligibilityError
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
              <template v-else-if="votingStatus === 'upcoming'">
                <div class="mt-5">
                  <p class="has-text-grey mt-3">
                    Voting has not started yet. Please wait until November 17,
                    12:00 CET. You can connect your wallet to check your voting power.
                  </p>
                </div>
              </template>
              <template v-else-if="votingStatus === 'ended'">
                <div class="mt-5">
                  <p class="has-text-grey mt-3">
                    Voting has ended. Results will be published soon.
                  </p>
                </div>
              </template>
              <ClientOnly>
                <template v-if="!connected">
                  <div class="mt-5 custom-wallet-button">
                    <WalletMultiButton />
                    <p class="has-text-grey is-size-7 mt-3">
                      Connect the same wallet that held NOS at the snapshot (Nov
                      13, 12:00 CET). Once your vote is cast, it is final and
                      cannot be changed.
                    </p>
                  </div>
                </template>
                <template
                  v-else-if="
                    votingStatus === 'active' &&
                    !hasVoted &&
                    !eligibilityError &&
                    !claimStatusError
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
                  <div class="notification is-info is-light mt-3">
                    You have already voted with this wallet.
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
import toNosanaNetwork from "~/utils/nosanaKitNetworkConvert";

const API_URL = useRuntimeConfig().public.apiUrl;
const { connected } = useWallet();
const selectedOption = ref<string | null>(null);
const voteLoading = ref(false);
const voteError = ref<string | null>(null);
const voteSuccess = ref(false);
const hasVoted = ref(false);
const claimStatusLoading = ref(false);
const claimStatusError = ref<string | null>(null);
const claimStatus = ref<any | null>(null);

// Unix timestamps
// November 17, 2025 12:00 CET (11:00 UTC)
const VOTING_START_TS = new Date("2025-11-17T12:00:00Z").getTime() / 1000;
// November 21, 2025 12:00 CET (11:00 UTC)
const VOTING_END_TS = new Date("2025-11-21T12:00:00Z").getTime() / 1000;

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

type ClaimInfo = {
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
type EligibilityInfo = ClaimInfo;
const eligibilityInfo = ref<EligibilityInfo | null>(null);

const isEligible = computed(
  () => !!eligibilityInfo.value && eligibilityInfo.value?.claimable_amount > 0
);

const onVote = async (eligibility: EligibilityInfo | null) => {
  console.log(eligibility);
  console.log(selectedOption.value);
  voteLoading.value = true;
  try {
    if (selectedOption.value === "yes") {
      console.log("yes");
    } else if (selectedOption.value === "no") {
      console.log("no");
    }

    // refresh eligibility
    // fetchEligibility(publicKey.value?.toBase58() || "");
    // voteSuccess.value = true;
    // temp
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch (err: any) {
    console.error(err);
    voteError.value = err.message;
    voteSuccess.value = false;
  }
  await fetchEligibility(publicKey.value?.toBase58() || "");
  voteLoading.value = false;
};

const { publicKey, wallet } = useWallet();

// fetch eligibility info from API
async function fetchEligibility(pubkeyBase58: string) {
  eligibilityLoading.value = true;
  eligibilityError.value = null;
  eligibilityInfo.value = null;
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
  try {
    hasVoted.value = false;
    claimStatus.value = null;
    if (!connected.value || !publicKey.value || !wallet.value)
      throw new Error("Wallet not connected");

    const distributor = eligibilityInfo.value?.merkle_tree;
    if (!distributor) throw new Error("Distributor not found");

    const { NosanaClient, NosanaNetwork, address } = await import(
      "@nosana/kit"
    );
    console.log("network", useRuntimeConfig().public.network);
    const client = new NosanaClient(
      toNosanaNetwork(useRuntimeConfig().public.network)
    );
    await client.setWallet(wallet.value.adapter as any);
    console.log("client", client.config);
    const status = await client.merkleDistributor.getClaimStatusForDistributor(
      address(distributor)
    );
    claimStatus.value = status;
    hasVoted.value = status !== null;
    console.log("status", status);
  } catch (e: any) {
    claimStatusError.value = e.message;
    console.error(e);
  } finally {
    claimStatusLoading.value = false;
  }
}

watch(eligibilityInfo, () => {
  if (eligibilityInfo.value) {
    checkClaimStatus();
  }
});
</script>
