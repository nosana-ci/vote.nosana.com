<template>
  <nav class="navbar is-spaced has-background-white" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <Logo />
      </div>

      <div id="navMenu" class="navbar-menu is-active">
        <div class="navbar-end">
          <div class="navbar-item custom-wallet-button">
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
import { useWallet, WalletMultiButton } from "solana-wallets-vue";
</script>
