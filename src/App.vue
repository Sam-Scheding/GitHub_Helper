<script>
import MyPullRequestsGrid from './components/MyPullRequestsGrid/Index.vue';
import TaggedPullRequestsGrid from './components/TaggedPullRequestsGrid/Index.vue';
import ApprovedPullRequestsGrid from './components/ApprovedPullRequestsGrid/Index.vue';
import ToDoList from './components/ToDoList/Index.vue'
import { fetchAllFromGitHub } from './services/graphql'
import * as GithubService from './services/github'
import { GITHUB_USERNAME } from './config'

export default {
  name: 'App',
  components: {
    MyPullRequestsGrid,
    TaggedPullRequestsGrid,
    ApprovedPullRequestsGrid,
    ToDoList,
  },
  data: () => ({
    myPullRequests: [],
    approvedPullRequests: [],
    taggedPullRequests: [],
    runningBuilds: [],
    staleBranches: [],
    GITHUB_USERNAME,
  }),
  mounted() {    
    this.setData()
  },
  methods: {
    async setData() {
      this.loading = true
      try {
        const response = await fetchAllFromGitHub()
        const {
          myPullRequests,
          taggedPullRequests,
          approvedPullRequests,
          user,
          runningBuilds,
        } = GithubService.transformAPIResponse(response)

        this.myPullRequests = myPullRequests
        this.taggedPullRequests = taggedPullRequests
        this.approvedPullRequests = approvedPullRequests        
        this.user = user
        this.runningBuilds = runningBuilds

      } catch (error) {
        console.error('Could not fetch data from GitHub', error)
      } finally {
        this.loading = false
      }
    },  
  },
};
</script>

<template>
  <v-app>
    <v-app-bar
      app
      dark
    >
    <v-app-bar-nav-icon>
      <v-icon
        size="40"
        color="blue"
      >
        mdi-git
      </v-icon>
    </v-app-bar-nav-icon>
      <h1 class="d-none">
        GitHub Helper
      </h1>
    </v-app-bar>
    <v-main class="content">
      <v-row>
        <v-col 
          v-if="myPullRequests.length > 0"
          sm="10"
          md="10" 
          lg="10"
        >
          <h2 class="headline sectionTitle">
            {{ GITHUB_USERNAME }}
          </h2>
          <MyPullRequestsGrid
            :pullRequests="myPullRequests"
          />
        </v-col>

        <v-col 
          v-if="taggedPullRequests.length > 0"
          sm="12" 
          md="6" 
          lg="6"
        >
          <h2 class="headline sectionTitle">TAGGED</h2><br>
          <TaggedPullRequestsGrid
            :pullRequests="taggedPullRequests"
          />
        </v-col>

        <v-col 
          v-if="approvedPullRequests.length > 0"
          sm="12" 
          md="6" 
          lg="6"
        >
          <h2 class="headline sectionTitle">APPROVED</h2><br>
          <ApprovedPullRequestsGrid
            :pullRequests="approvedPullRequests"
           />
        </v-col>
      </v-row>
      <ToDoList 
        :builds="runningBuilds"
        :branches="staleBranches"
      />
    </v-main>
  </v-app>
</template>

<style scoped>
.content {
  margin-left: 24px;
}

.sectionTitle {
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>
