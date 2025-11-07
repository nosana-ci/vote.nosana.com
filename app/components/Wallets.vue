<template>
  <div>
    <div v-if="!connected">
      <WalletMultiButton />
    </div>
    <div v-else-if="connected && wallet">
      <div :class="['dropdown', { 'is-right': true, 'is-active': isDropdownActive }]">
        <div class="dropdown-trigger">
          <button
            class="button is-light"
            aria-haspopup="true"
            aria-controls="wallet-dropdown-menu"
            @click="toggleDropdown"
          >
          <img v-if="wallet.adapter.icon" :src="wallet.adapter.icon" :alt="wallet.adapter.name + ' icon'" class="wallet-icon mr-2" />
          <WalletIcon v-else />
            <span>{{ shortAddress }}</span>
            <span class="ml-1">▼</span>
          </button>
        </div>
        <div class="dropdown-menu" id="wallet-dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a class="dropdown-item" @click="disconnectAndClose">Disconnect</a>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      Could not find public key. Disconnect and try again
      <p>
        <button @click="disconnect" class="button is-danger">Disconnect</button>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { WalletMultiButton } from "solana-wallets-vue";
import { useWallet } from "solana-wallets-vue";
import WalletIcon from "./WalletIcon.vue";

const { publicKey, connected, disconnect, wallet } = useWallet();

const isDropdownActive = ref(false);
const toggleDropdown = () => {
  isDropdownActive.value = !isDropdownActive.value;
};
const disconnectAndClose = async () => {
  isDropdownActive.value = false;
  await disconnect();
};

const shortAddress = computed(() => {
  if (!publicKey.value) return "";
  const address = publicKey.value.toBase58();
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
});
</script>