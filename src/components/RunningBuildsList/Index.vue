<script>
export default {
  name: 'RunningBuildsList',
  props: {
    items: {
      required: true,
    }
  },
}
</script>

<template>
  <v-list>
    <v-list-item
      v-for="(item, idx) in items"
      :key="idx"
    >
    <a
      class="text-subtitle-2"
      :href="item.buildURL"
    >
      {{ item.pullRequestTitle }}
    </a>
    </v-list-item>
  </v-list>
</template>

