<template>
  <div>
    <div class="container my-5">
      <section class="section">
        <div class="columns is-variable is-6">
          <div class="column is-8">
            <div class="has-text-grey">NNP-0001</div>
            <h1 class="title is-1 mb-5">
              From Yield to Growth: Aligning NOS Rewards with Real Usage
            </h1>
            <p class="subtitle is-5 has-text-grey">
              This proposal shifts NOS rewards from passive yield to usage-based
              incentives. The goal is to reward capacity, reliability, and
              returning demand, so every NOS spent helps the network grow.
            </p>
            <div class="mb-5">
              <button class="button is-light">
                View Full Proposal <span class="ml-2">→</span>
              </button>
            </div>

            <div class="box">
              <div
                class="is-flex is-justify-content-space-between is-align-items-center mb-5"
              >
                <h2 class="title is-5 mb-0">Cast Your Vote</h2>
                <div class="has-text-grey">
                  Voting Power:
                  <template v-if="isEligible">{{ claimInfo?.claimable_amount ? (claimInfo?.claimable_amount / 1e6).toFixed(4) : '—' }}</template>
                  <template v-else>—</template>
                </div>
              </div>

              <div class="field pt-2">
                <label class="option-card is-clickable" :class="{ 'is-selected': selectedOption === 'yes' }">
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
                <label class="option-card is-clickable" :class="{ 'is-selected': selectedOption === 'no' }">
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
                <template v-else>
                  <div class="mt-5">
                    <button
                      class="button is-primary has-text-white"
                      :disabled="!selectedOption || !isEligible || eligibilityLoading"
                      @click="onVote(claimInfo)"
                    >
                      Vote
                    </button>
                    <p
                      v-if="connected && !eligibilityLoading && !isEligible"
                      class="has-text-grey is-size-7 mt-3"
                      >This wallet is not eligible to vote.</p
                    >
                    <p v-if="connected && !eligibilityLoading && isEligible" class="has-text-grey is-size-7 mt-3"
                      >Voting as {{ publicKey?.toBase58() }}</p
                    >
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
          <div class="column is-4">
            <div class="box">
              <h3 class="title is-5">Progress</h3>
              <div class="is-size-7 has-text-grey">Votes cast —</div>
              <div class="notification is-light mt-3 is-size-7" style="background-color: #F5F5F5;">
                Vote distribution will be shown after the voting period closes.
              </div>
            </div>

            <div class="box">
              <h3 class="title is-5">Status</h3>
              <div class="is-flex is-align-items-center mb-2">
                <span class="tag is-success is-light mr-2">Active</span>
              </div>
              <dl class="is-size-7">
                <div class="is-flex is-justify-content-space-between mb-2">
                  <dt>Opens</dt>
                  <dd>November 17, 12:00 CET</dd>
                </div>
                <div class="is-flex is-justify-content-space-between mb-2">
                  <dt>Closes</dt>
                  <dd>November 21, 12:00 CET</dd>
                </div>
                <div class="is-flex is-justify-content-space-between mb-2">
                  <dt>Results published</dt>
                  <dd>November 21, 18:00 CET</dd>
                </div>
                <div class="is-flex is-justify-content-space-between">
                  <dt>Snapshot</dt>
                  <dd>November 13, 12:00 CET</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useWallet, WalletMultiButton } from "solana-wallets-vue";

const API_URL = "";
const { connected } = useWallet();
const selectedOption = ref<string | null>(null);

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

const isEligible = computed(() => !!claimInfo.value && claimInfo.value?.claimable_amount > 0);

const onVote = (eligibility: ClaimInfo | null) => {
  console.log(eligibility);
  console.log(selectedOption.value);
  if (selectedOption.value === 'yes') {
    console.log('yes');
  } else {
    console.log('no');
  }
};

const { publicKey } = useWallet();


async function fetchEligibility(pubkeyBase58: string) {
  eligibilityLoading.value = true;
  eligibilityError.value = null;
  claimInfo.value = null;
  try {
    const data = await $fetch<ClaimInfo>(`${API_URL}/eligibility/${pubkeyBase58}`, {
      method: "GET",
    });
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
