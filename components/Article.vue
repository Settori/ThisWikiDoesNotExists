<script setup lang="ts">
const localePath = useLocalePath();

defineProps<{
  article: Article,
}>();
</script>

<template>
  <section class="grid grid-cols-12 gap-x-4">
    <LeftBar class="w-full col-span-2 hidden lg:block" :topics="article.sections.map(item => item.title)"/>
    <div class="col-span-12 lg:col-span-8">
      <h1 id="section-1" class="text-3xl italic border-b border-gray-400">{{ article.title }}</h1>
      <div>
        <div v-for="(section, index) in article.sections" class="mt-6">
          <h2
              v-if="index > 0"
              class="text-2xl border-b border-gray-400"
              :id="`section-${index + 1}`"
          >{{ section.title }}</h2>
          <p class="mt-2">{{ section.content }}</p>
        </div>
        <h2 class="text-2xl border-b border-gray-400 mt-6 mb-2">External links</h2>
        <ul class="list-disc flex flex-wrap">
          <li
              v-for="(topic, index) in article.similarTopics"
              :key="`simmilarTopic${index}`"
              class="mx-4"
          >
            <NuxtLink :to="localePath(`/wiki/${topic}`)" class="text-blue-700 font-sans italic">{{ topic }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-2 w-full px-4">right bar</div>
  </section>
</template>

<style scoped>

</style>