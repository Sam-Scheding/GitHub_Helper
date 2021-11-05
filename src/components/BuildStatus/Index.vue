
<script>
const STATES = [
  'EXPECTED',
  'ERROR',
  'FAILURE',
  'PENDING',
  'SUCCESS',
  'UNKNOWN', // Not a real value. Just used in case there has never been a build
]

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
    state() {
      if(!this.status){
        return 'UNKNOWN'
      }

      return this.status
    },
    icon() {
      const icons = {
        EXPECTED: 'mdi-help',
        ERROR: 'mdi-close',
        FAILURE: 'mdi-close',
        PENDING: 'mdi-timer-sand',
        SUCCESS: 'mdi-check',
        UNKNOWN: 'mdi-help',
      }
      return icons[this.state]
    },
    color() {
      const colors = {
        EXPECTED: 'blue',
        ERROR: 'red',
        FAILURE: 'red',
        PENDING: 'yellow',
        SUCCESS: 'green',
      }
      return colors[this.state]
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