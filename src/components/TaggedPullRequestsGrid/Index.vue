<script>
import PullRequestCard from '../PullRequestCard/Index.vue'

export default {
  name: 'TaggedPullRequestsGrid',
  components: {
    PullRequestCard,
  },
  props: {
    pullRequests: {
      default: [],
      type: Array,
    }
  }
}
</script>

<template>
  <v-layout wrap>
    <PullRequestCard 
      v-for="pr in pullRequests"
      :key="pr.number"  
      :author="pr.author"
      :build-status="pr.buildStatus"
      :build="pr.build"
      :fresh-comments="pr.freshComments"    
      :latest-parent-commit="pr.latestParentCommit"
      :merge-status="pr.mergeStatus"
      :number="pr.number"
      :repository="pr.repository"
      :title="pr.title"
      :url="pr.url"
      class="card"
    />
  </v-layout>
</template>

<style scoped>
.card {
  margin-bottom: 12px;
  margin-right: 12px;
}
</style>