<template>
  <DefaultLayout title="Event Favorites">
    <pre>
      {{ favoriteEventItems }}
    </pre>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '../../layouts/default.vue';

const dataStore = useDataStore();

const favoriteEventItems = computed(() => {
  const favoriteEventItems = [];

  for (const event of dataStore.data.nysfairWebsite.events) {
    for (const eventDate of event.dates) {
      if (eventDate.isFavorite) {
        favoriteEventItems.push({
          event: {
            id: event.id,
            title: event.title,
          },
          eventDate,
        });
      }
    }
  }

  return favoriteEventItems;
});
</script>
