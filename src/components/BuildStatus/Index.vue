
<script>
import { BUILD_STATUSES } from '../../services/github'

const COLORS = {
  EXPECTED: 'blue',
  ERROR: 'red',
  FAILURE: 'red',
  PENDING: 'yellow',
  SUCCESS: 'green',
}

const ICONS = {
  EXPECTED: 'mdi-help',
  ERROR: 'mdi-close',
  FAILURE: 'mdi-close',
  PENDING: 'mdi-timer-sand',
  SUCCESS: 'mdi-check',
}

export default {
  name: 'BuildStatus',
  props: {
    status: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    }
  },
  computed: {
    icon() {
      return ICONS[this.status]
    },
    color() {
      return COLORS[this.status]
    },
  },
}
</script>

<template>
  <a 
    class="link"
    :href="url"
    target="_blank"
  >
    <v-icon 
      :color="color"
      small
    >
      {{ icon }}
    </v-icon>
  </a>
</template>

<style scoped>
.link {
  text-decoration: none;
}
</style>