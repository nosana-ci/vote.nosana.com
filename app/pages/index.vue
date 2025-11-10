<template>
  <div>
    <div class="container my-5">
      <section class="section">
        <div class="columns is-variable is-6">
          <div class="column is-8">
            <div class="has-text-grey">NNP-0001: Tokenomics</div>
            <h1 class="title is-1 mb-5">
              From Yield to Growth: Aligning NOS Rewards with Real Usage
            </h1>
            <p class="subtitle is-5 has-text-grey">
              This proposal shifts NOS rewards from passive yield to usage-based
              incentives. The goal is to reward capacity, reliability, and
              returning demand, so every NOS spent helps the network grow.
            </p>
            <div class="mb-5">
              <a
                href="https://github.com/nosana-ci/network-proposals/blob/main/nnp/NNP-0001-tokenomics.md"
                target="_blank"
                class="button is-light"
              >
                View Full Proposal
                <img
                  style="width: 16px; height: 16px"
                  src="~/assets/img/arrow-right.svg"
                  alt="Arrow Right"
                  class="ml-2"
                />
              </a>
            </div>

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
                    claimInfo?.claimable_amount
                      ? (claimInfo?.claimable_amount / 1e6).toFixed(2)
                      : "—"
                  }}</template>
                  <template v-else>—</template>
                </div>
              </div>

              <template v-if="votingStatus === 'active'">
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
              <template v-else-if="votingStatus === 'upcoming'">
                <div class="mt-5">
                  <p class="has-text-grey mt-3">
                    Voting has not started yet. Please wait until November 17,
                    12:00 CET.
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
                <template v-else-if="votingStatus === 'active'">
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
                      @click="onVote(claimInfo)"
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

const API_URL = useRuntimeConfig().public.apiUrl;
const { connected } = useWallet();
const selectedOption = ref<string | null>(null);
const voteLoading = ref(false);
const voteError = ref<string | null>(null);
const voteSuccess = ref(false);

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
const claimInfo = ref<ClaimInfo | null>(null);

const isEligible = computed(
  () => !!claimInfo.value && claimInfo.value?.claimable_amount > 0
);

const onVote = async (eligibility: ClaimInfo | null) => {
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

const { publicKey } = useWallet();

async function fetchEligibility(pubkeyBase58: string) {
  eligibilityLoading.value = true;
  eligibilityError.value = null;
  claimInfo.value = null;
  try {
    const data = await $fetch<ClaimInfo>(
      `${API_URL}/eligibility/${pubkeyBase58}`,
      {
        method: "GET",
      }
    );
    claimInfo.value = data;
  } catch (err: any) {
    // 404 is not eligible
    const status = err?.response?.status || err?.statusCode;
    if (status === 404) {
      eligibilityError.value = "This wallet is not eligible to vote.";
    } else {
      eligibilityError.value = "Failed to check eligibility. Try again later.";
    }
    claimInfo.value = null;
  } finally {
    eligibilityLoading.value = false;
  }
}

watch(
  [connected, publicKey],
  ([isConnected, pk]) => {
    // Reset on wallet change
    eligibilityError.value = null;
    claimInfo.value = null;
    if (isConnected && pk) {
      const address = pk.toBase58();
      fetchEligibility(address);
    }
  },
  { immediate: true }
);
</script>
