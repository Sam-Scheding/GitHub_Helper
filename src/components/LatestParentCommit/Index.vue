
<script>

export default {
  name: 'LatestParentCommit',
  props: {
    status: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    icon() {
      const icons = {
        [false]: 'mdi-close',
        [true]: 'mdi-check',
      }

      return icons[this.status]
    },
    color() {
      const colors = {
        [false]: 'red',
        [true]: 'green',
      }

      return colors[this.status]
    },
  },
}
</script>

<template>
  <div>
    <v-icon 
      v-if="status === true"
      :color="color"
      small
    >
      {{ icon }}
    </v-icon>
    <v-icon 
      v-else
      :color="color"
      small
    >
      {{ icon }}
    </v-icon>
  </div>
</template>

<style scoped>
.link {
  text-decoration: none;
}
</style>
