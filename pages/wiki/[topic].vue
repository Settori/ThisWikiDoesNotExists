<script setup lang="ts">
import { getWikiPage, getDummyData } from '@/composables/useOpenAi';
import {useI18n} from 'vue-i18n';

const {locale} = useI18n();
const currentLanguage = locale.value;

const route = useRoute();
const result = ref(await getWikiPage(Array.isArray(route.params.topic) ? route.params.topic[0] : route.params.topic, currentLanguage));
</script>
<template>
  <NuxtLayout>
    <Article v-if="result" :article="result" />
  </NuxtLayout>
</template>
