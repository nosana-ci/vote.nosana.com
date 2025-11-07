<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-menu is-active">
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
    <div class="container">
      <section class="section">
        <h1 class="title is-1">Voting UI</h1>
        <div class="columns">
          <div class="column is-8">
            <div class="box">
              <p>Proposal</p>
            </div>
            <div class="box">
              <p>Voting Options</p>
            </div>
          </div>
          <div class="column is-4">
            <div class="box">
              <p>Progress</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
