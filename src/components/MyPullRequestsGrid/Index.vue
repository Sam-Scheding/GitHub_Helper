<script>
import PullRequestCard from '../PullRequestCard/Index.vue'

export default {
  name: 'MyPullRequestsGrid',
  components: {
    PullRequestCard,
  },
  props: {
    pullRequests: {
      default: () => [],
      type: Array,
    }
  }
}
</script>

<template>
  <v-layout wrap>
    <PullRequestCard 
      v-for="(pr, index) in pullRequests"
      :key="index"
      :approvals="pr.approvals"
      :author="pr.author"
      :build="pr.build"
      :fresh-comments="pr.freshComments"
      :up-to-date-with-parent-branch="pr.upToDateWithParentBranch"
      :merge-status="pr.mergeStatus"
      :number="pr.number"
      :repository="pr.repository"
      :title="pr.title"
      :unpublished-reviews="pr.unpublishedReviews"
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