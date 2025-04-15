<script setup lang="ts">
import {getDummyData, getRandomTopics} from '@/composables/useOpenAi'
import {useI18n} from 'vue-i18n';

const {locale} = useI18n();
const currentLanguage = locale.value;
const path = useLocalePath();
const dummyData = getDummyData();
const randomTopics = await getRandomTopics(10, currentLanguage);
const result = computed(() => {
  return {
    title: dummyData.title,
    sections: dummyData.sections,
    similarTopics: randomTopics
  };
});
console.log(randomTopics)
</script>
<template>
  <NuxtLayout>
    <Article :article="result" />
  </NuxtLayout>
</template>
