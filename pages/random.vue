<script setup lang="ts">
import { getRandomTopic } from '@/composables/useOpenAi';
import {useI18n} from 'vue-i18n';

const {locale} = useI18n();
const currentLanguage = locale.value;

const topic = await getRandomTopic(currentLanguage);
await navigateTo(`/wiki/${topic}`)
</script>
<template>
  <NuxtLayout>
    Please wait
  </NuxtLayout>
</template>
