<template>
  <div class="column is-4">
    <div class="box">
      <h3 class="title is-5">Progress</h3>
      <div class="is-size-7 has-text-grey">Votes cast —</div>
      <div
        class="notification is-light mt-3 is-size-7"
        style="background-color: #f5f5f5"
      >
        Vote distribution will be shown after the voting period closes.
      </div>
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
          <dd>November 13, 12:00 CET</dd>
        </div>
        <div class="is-flex is-justify-content-space-between mb-2">
          <dt>Opens</dt>
          <dd>November 17, 12:00 CET</dd>
        </div>
        <div class="is-flex is-justify-content-space-between mb-2">
          <dt>Closes</dt>
          <dd>November 21, 12:00 CET</dd>
        </div>
        <div class="is-flex is-justify-content-space-between">
          <dt>Results published</dt>
          <dd>November 21, 18:00 CET</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  votingStatus: string;
}>();
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