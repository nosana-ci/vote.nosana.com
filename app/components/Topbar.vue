<template>
  <nav class="navbar is-spaced has-background-white" role="navigation" aria-label="main navigation">
    <div class="container px-4 py-2 is-flex is-justify-content-space-between is-align-items-center">
      <div class="navbar-brand">
        <Logo />
      </div>

      <div id="navMenu" class="navbar-menu is-active">
        <div class="navbar-end">
          <div class="custom-wallet-button">
            <ClientOnly>
              <WalletMultiButton />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { WalletMultiButton } from "solana-wallets-vue";
</script>
