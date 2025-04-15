<script setup lang="ts">
defineProps({
  topics: Array<string>,
});
</script>
<template>
  <section class="h-screen sticky top-0">
    <div class="pt-10">
      <div
          v-for="(topic, index) in topics"
          :key="'topic-' + index"
          class="mb-3"
      >
        <a
            class="font-sans text-sm text-blue-800 break-words"
            :href="`#section-${index + 1}`"
        >
          {{ topic }}
        </a>
      </div>
    </div>
  </section>
</template>