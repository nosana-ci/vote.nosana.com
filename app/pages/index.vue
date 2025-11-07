<template>
  <div>
    <div class="container">
      <section class="section">
        <div class="columns is-variable is-6">
          <div class="column is-8">
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
                class="is-flex is-justify-content-space-between is-align-items-center mb-4"
              >
                <h2 class="title is-5">Cast Your Vote</h2>
                <div class="has-text-grey">Voting Power: —</div>
              </div>

              <div class="field">
                <label class="box is-clickable">
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
                <label class="box is-clickable">
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

              <div class="is-flex is-align-items-center mt-3">
                <ClientOnly>
                  <template v-if="!connected">
                    <WalletMultiButton />
                    <p class="has-text-grey ml-4 is-size-7">
                      Connect the same wallet that held NOS at the snapshot (Nov
                      13, 12:00 CET). Once your vote is cast, it is final and
                      cannot be changed.
                    </p>
                  </template>
                  <template v-else>
                    <button
                      class="button is-primary"
                      :disabled="!selectedOption"
                      @click="onVote"
                    >
                      Vote
                    </button>
                    <span class="ml-3 has-text-grey is-size-7"
                      >Voting as {{ publicKey?.toBase58() }}</span
                    >
                  </template>
                </ClientOnly>
              </div>
            </div>
          </div>

          <div class="column is-4">
            <div class="box">
              <h3 class="title is-5">Progress</h3>
              <div class="is-size-7 has-text-grey">Votes cast —</div>
              <div class="notification is-light mt-3 is-size-7">
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
import { ref, computed } from "vue";
import { useWallet, WalletMultiButton } from "solana-wallets-vue";

const { connected } = useWallet();
const selectedOption = ref<string | null>(null);

const onVote = () => {};

const { publicKey } = useWallet();
const shortAddress = computed(() => {
  if (!publicKey.value) return "";
  const address = publicKey.value.toBase58();
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
});
</script>
