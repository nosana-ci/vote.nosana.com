<template>
  <div class="app-wrapper">
    <Topbar />
    <main class="main-content">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Topbar from "./components/Topbar.vue";
import Footer from "./components/Footer.vue";
</script>