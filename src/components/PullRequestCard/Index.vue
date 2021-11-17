<script>
import BuildStatus from '../BuildStatus/Index.vue'
import MergeStatus from '../MergeStatus/Index.vue'
import LatestParentCommit from '../LatestParentCommit/Index.vue'
import UserList from '../UserList/Index.vue'
import { BUILD_STATUSES, MERGE_STATUSES } from '../../services/github'

export default {
  name: 'PullRequestCard',
  components: {
    BuildStatus,
    MergeStatus,
    LatestParentCommit,
    UserList,
  },
  props: {
    approvals: {
      type: Array,
      default: () => [],
    },
    author: {
      type: String,
      required: true,
    },
    build: {
      type: Object,
      default: () => {},
    },
    freshComments: {
      type: Number,
      default: null,
    },
    upToDateWithParentBranch: {
      type: Boolean,
      default: true,
    },
    mergeStatus: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    repository: {
      type: String,
      required: true,
    },
    staleComments: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    unpublishedReviews: {
      type: Array,
      default: () => [],
    },
    url: {
      type: String,
      required: true,
    },
  },
  methods: {
    needsAttention() {
      if(this.build.status === BUILD_STATUSES.FAILURE) {
        return true
      }

      if(this.mergeStatus === MERGE_STATUSES.CONFLICTING) {
        return true
      }

      if(this.freshComments !== null && this.freshComments > 0) {
        return true
      }

      if(this.staleComments !== null && this.staleComments > 0) {
        return true
      }

      if(this.latestParentCommit === false) {
        return true
      }

      return false
    }
  }
}
</script>

<template>
  <v-card
    elevation="2"
    outlined
    tile
    width="300"
    :class="needsAttention() === true && 'attention'"
  >
    <v-card-title class="title">
      <a target="_blank" :href="url">
        {{ title }} ({{ number }})
      </a>
    </v-card-title>
    <div class="subtitleGroup">
      <v-card-subtitle>{{ author }}</v-card-subtitle>
      <v-card-subtitle>
        <a
          target="_blank"
          :href="`https://github.com/siteminder-au/${repository}/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc`"
        >
          {{ repository }}
        </a>        
      </v-card-subtitle>
    </div>
    <v-divider class="mx-4"></v-divider>
    <v-card-text>

      <div 
        v-if="build.status && build.url"
        class="bar"
      >
        Build Status: 
        <BuildStatus 
          :status="build.status"
          :url="build.url"
        />
      </div>
      <div class="bar">
        Merge Status: 
        <MergeStatus 
          :status="mergeStatus"
          :url="`https://github.com/siteminder-au/${repository}/pull/${number}/conflicts`"
        />
      </div>
      <div class="bar">
        Latest Parent Commit:
        <LatestParentCommit 
          :status="upToDateWithParentBranch"
        />
      </div>
      <div 
        v-if="staleComments !== null"
        class="bar"
      >
        Stale Comments:
        <b :class="staleComments === 0 ? 'success' : 'failure'">
          {{ staleComments }}
        </b>
      </div>
      <div 
        v-if="freshComments !== null"
        class="bar"
      >
        Fresh Comments:
        <b :class="freshComments === 0 ? 'success' : 'failure'">
          {{ freshComments }}
        </b>
      </div>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>
    <v-card-subtitle>
      <b>
        REVIEWS
      </b>
    </v-card-subtitle>
    <v-card-text>
      <div class="bar">
        <div v-if="approvals.length > 0">
          Approvals
          <UserList
            class="userList"
            :items="approvals"
          />
        </div>
        <div v-if="unpublishedReviews.length > 0">
          Unpublished
          <UserList
            class="userList"
            :items="unpublishedReviews"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>

.attention {
  background-color: #391E1E !important;
  /* TODO: Add another theme colour for this instead of !important */
}

/* TODO: Use an actual Bar component */
.bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.title {
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.subtitleGroup {
  display: flex; 
  justify-content: space-between;
  margin-top: 0px;
}

.success {
  color: green;
  background-clip: initial;
  -webkit-background-clip: text;
  margin-right: 5px;
}

.failure {
  color: red;
  background-clip: initial;
  -webkit-background-clip: text;
  margin-right: 5px;
}

.userList {
  background-clip: initial;
  -webkit-background-clip: text;
}
</style>