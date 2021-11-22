<script>
import MyPullRequestsGrid from './components/MyPullRequestsGrid/Index.vue';
import TaggedPullRequestsGrid from './components/TaggedPullRequestsGrid/Index.vue';
import ApprovedPullRequestsGrid from './components/ApprovedPullRequestsGrid/Index.vue';
import ToDoList from './components/ToDoList/Index.vue'
import { fetchAllFromGitHub } from './services/graphql'
import * as GithubService from './services/github'
import { 
  GITHUB_USERNAME, 
  GITHUB_OAUTH_URL, 
  GITHUB_APP_CLIENT_ID,
  GITHUB_APP_CALLBACK_URL,
} from './config'

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
    GITHUB_OAUTH_URL,
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
  computed: {
    gitHubURL() {
      const paramsObj = {
        client_id: GITHUB_APP_CLIENT_ID,
        redirect_uri: GITHUB_APP_CALLBACK_URL,
        scope: 'repo read:user read:email'
        // scope: 'repo read:org read:user read:email'
      }

      const params = new URLSearchParams(paramsObj)
      return `${GITHUB_OAUTH_URL}?${params}`
    }
  }
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
      <a :href="gitHubURL">
        LOGIN
      </a>
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
        class="toDoList"
        :builds="runningBuilds"
        :branches="staleBranches"
      />
    </v-main>
  </v-app>
</template>

<style scoped>
.toDoList {
  margin-top: 64px;
  position: fixed;
}

.content {
  margin-left: 24px;
}

.sectionTitle {
  margin-top: 12px;
  margin-bottom: 12px;
}
</style>
