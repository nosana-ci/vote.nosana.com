<template>
  <div class="column is-4">
    <div class="box">
      <h3 class="title is-5">
        <span v-if="votingStatus !== 'ended'">Progress</span>
        <span v-else>Results</span>
      </h3>
      <div
        class="notification is-light mt-3 is-size-7"
        style="background-color: #f5f5f5"
        v-if="
          votingStatus !== 'ended' ||
          Date.now() / 1000 <
            new Date(publicRuntimeConfig.resultsPublishedIso).getTime() / 1000
        "
      >
        Vote distribution will be shown after the voting period closes.
      </div>

      <!-- if the current time is after the results published time & voting status is ended -->
      <dl
        class="is-size-7 mt-3"
        v-if="
          votingStatus === 'ended' &&
          Date.now() / 1000 >
            new Date(publicRuntimeConfig.resultsPublishedIso).getTime() / 1000
        "
      >
        <p class="has-text-grey">Votes cast</p>
        <div class="is-flex is-justify-content-space-between mb-2">
          <dt>Yes</dt>
          <dd>{{ yesVotesDisplay }}</dd>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <dt>No</dt>
          <dd>{{ noVotesDisplay }}</dd>
        </div>
      </dl>
    </div>

    <div class="box">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-5"
      >
        <h3 class="title is-5 mb-0">Status</h3>
        <span class="tag is-black is-capitalized">
          <span
            class="status-dot"
            :class="`status-dot--${votingStatus}`"
          ></span>
          {{ votingStatus }}
        </span>
      </div>
      <dl class="is-size-7">
        <div class="is-flex is-justify-content-space-between mb-2">
          <dt>Snapshot</dt>
          <dd>{{ statusDates.snapshot }}</dd>
        </div>
        <div class="is-flex is-justify-content-space-between mb-2">
          <dt>Opens</dt>
          <dd>{{ statusDates.opens }}</dd>
        </div>
        <div class="is-flex is-justify-content-space-between mb-2">
          <dt>Closes</dt>
          <dd>{{ statusDates.closes }}</dd>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <dt>Results published</dt>
          <dd>{{ statusDates.results }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Connection, PublicKey } from "@solana/web3.js";

const props = defineProps<{
  votingStatus: string;
}>();

import { onMounted, ref, computed } from "vue";
import formatCETDate from "~/utils/formatDate";

const publicRuntimeConfig = useRuntimeConfig().public;

const yesVotes = ref<number | null>(null);
const noVotes = ref<number | null>(null);
const loadingVotes = ref<boolean>(false);
const loadError = ref<string | null>(null);

const TOKEN_MINT = publicRuntimeConfig.token as string;

const statusDates = computed(() => ({
  snapshot: formatCETDate(publicRuntimeConfig.snapshotIso),
  opens: formatCETDate(publicRuntimeConfig.votingStartIso),
  closes: formatCETDate(publicRuntimeConfig.votingEndIso),
  results: formatCETDate(publicRuntimeConfig.resultsPublishedIso),
}));

const yesVotesDisplay = computed(() => {
  if (loadingVotes.value && yesVotes.value === null) return "Loading…";
  if (loadError.value) return "—";
  return yesVotes.value !== null
    ? yesVotes.value.toFixed(0).toLocaleString()
    : "—";
});
const noVotesDisplay = computed(() => {
  if (loadingVotes.value && noVotes.value === null) return "Loading…";
  if (loadError.value) return "—";
  return noVotes.value !== null
    ? noVotes.value.toFixed(0).toLocaleString()
    : "—";
});

async function fetchVoteTotals() {
  loadingVotes.value = true;
  loadError.value = null;
  try {
    const { NosanaClient } = await import("@nosana/kit");
    const client = new NosanaClient(publicRuntimeConfig.network as any);
    const rpcEndpoint = client.config.solana.rpcEndpoint;

    const [yes, no] = await Promise.all([
      fetchVotesForOwner(
        rpcEndpoint,
        publicRuntimeConfig.yesAddress as string,
        TOKEN_MINT
      ),
      fetchVotesForOwner(
        rpcEndpoint,
        publicRuntimeConfig.noAddress as string,
        TOKEN_MINT
      ),
    ]);
    yesVotes.value = yes;
    noVotes.value = no;
  } catch (e: any) {
    loadError.value = e?.message || "Failed to load totals";
    yesVotes.value = null;
    noVotes.value = null;
  } finally {
    loadingVotes.value = false;
  }
}

async function fetchVotesForOwner(
  rpcEndpoint: string,
  owner: string,
  mint: string
): Promise<number | null> {
  const connection = new Connection(rpcEndpoint, "confirmed");
  const response = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(owner),
    {
      mint: new PublicKey(mint),
    }
  );
  if (response.value.length === 0) return null;

  const votes = response.value[0];
  const parsed = votes?.account.data.parsed.info;

  return parsed.tokenAmount.uiAmount;
}

onMounted(() => {
  fetchVoteTotals();
});
</script>
<style scoped lang="scss">
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-dot--upcoming {
  background-color: #ffd324;
}

.status-dot--active {
  background-color: #48c78e;
}

.status-dot--ended {
  background-color: #3e8ed0;
}
</style>
