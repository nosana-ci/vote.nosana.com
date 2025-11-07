<template>
  <nav class="navbar is-spaced" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item title is-5 mb-0"> NOSANA </a>
      </div>

      <div id="navMenu" class="navbar-menu is-active">
        <div class="navbar-end">
          <div class="navbar-item">
            <ClientOnly>
              <Wallets />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>
