<template>
  <footer class="footer has-background-white">
    <div class="container">
      <div class="is-flex is-justify-content-space-between is-align-items-center">
        <div class="has-text-grey">© 2025 NOSANA Governance</div>
        <!-- <a href="#" class="has-text-grey" @click.prevent="scrollToTop">Back to top ↑</a> -->
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>


