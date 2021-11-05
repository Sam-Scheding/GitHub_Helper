
<script>
const STATUSES = [
  'CONFLICTING',
  'MERGEABLE',
  'UNKNOWN',
]

export default {
  name: 'MergeStatus',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => {
        return STATUSES.includes(value)
      },
    },
    url: {
      type: String,
      default: null,
    }
  },
  computed: {
    icon() {
      const icons = {
        CONFLICTING: 'mdi-close',
        MERGEABLE: 'mdi-check',
        UNKNOWN: 'mdi-help',
      }

      return icons[this.status]
    },
    color() {
      const colors = {
        CONFLICTING: 'red',
        MERGEABLE: 'green',
        UNKNOWN: 'yellow',
      }
      return colors[this.status]
    },
  },
}
</script>

<template>
  <div>
    <a
      v-if="status === 'CONFLICTING'"
      target="_blank" 
      :href="url"
    >
      <v-icon 
        :color="color"
        small
      >
        {{ icon }}
      </v-icon>
    </a>
    <v-icon 
      v-else
      :color="color"
      small
    >
      {{ icon }}
    </v-icon>
  </div>
</template>
