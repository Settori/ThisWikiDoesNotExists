<script setup lang="ts">
import { getWikiPage, getDummyData } from '@/composables/useOpenAi'
import {useI18n} from 'vue-i18n';

const {locale} = useI18n();
const currentLanguage = locale.value;
const path = useLocalePath();
// const topic = await getRandomTopic(currentLanguage);
// const result = ref(await getWikiPage(topic, currentLanguage));
const result = getDummyData();

</script>
<template>
  <NuxtLayout>
    <Article :article="result" />
  </NuxtLayout>
</template>
