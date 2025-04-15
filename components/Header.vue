<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();
const localePath = useLocalePath();

const searchQuery = ref('')

const availableLocales = computed(() => {
  return locales.value.filter(i => i.code !== locale.value)
});

const search = () => {
  if (!searchQuery.value.trim()) {
    return;
  }

  if (searchQuery.value.trim()) {
    router.push(localePath(`/wiki/${encodeURIComponent(searchQuery.value.trim())}`));
  }
};
</script>
<template>
  <header class="mb-4 py-4 flex justify-between items-center">
    <div class="flex gap-10 w-full">
      <NuxtLink class="text-3xl" :to="localePath('/')">Dummypedia</NuxtLink>
      <div class="flex w-1/2 items-center">
        <input
            v-model="searchQuery"
            @keyup.enter="search"
            type="text"
            class="border border-r-0 border-gray-500 px-4 size-full"
            placeholder="Search..."
        />
        <button @click="search" class="bg-gray-200 border border-gray-500 h-full px-3 font-sans font-bold text-sm">Search</button>
        <NuxtLink :to="localePath('/random')" class="ms-4 text-blue-900 font-sans">Random</NuxtLink>
      </div>
    </div>
    <NuxtLink v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
      {{ locale.code }}
    </NuxtLink>
  </header>
</template>