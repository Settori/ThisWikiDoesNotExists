<script setup lang="ts">
import {getDummyData, getRandomTopics} from '@/composables/useOpenAi'
import {useI18n} from 'vue-i18n';

const localePath = useLocalePath();
const {locale} = useI18n();
const currentLanguage = locale.value;
const similarTopics = ref<string[] | null>(null);
onMounted(async () => {
  similarTopics.value = await getRandomTopics(20, currentLanguage);
})
</script>
<template>
  <NuxtLayout>
    <section class="grid grid-cols-12 gap-x-4">
      <div class="w-full col-span-2 hidden lg:block">left bar</div>
      <div class="col-span-12 lg:col-span-8">
        <h2 class="text-3xl mb-4">{{ $t('randomTopics') }}</h2>
        <ul v-if="similarTopics" class="list-disc flex flex-wrap col-span-12 lg:col-span-8">
          <li
              v-for="(topic, index) in similarTopics"
              :key="`simmilarTopic${index}`"
              class="mx-4"
          >
            <NuxtLink :to="localePath(`/wiki/${encodeURIComponent(topic)}`)" class="text-blue-700 font-sans italic">{{ topic }}</NuxtLink>
          </li>
        </ul>
        <Spinner v-else class="w-full flex items-center justify-center my-10"/>
      </div>
      <div class="col-span-12 lg:col-span-2 w-full px-4">right bar</div>
    </section>
  </NuxtLayout>
</template>
