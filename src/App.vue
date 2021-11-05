<script>
import MyPullRequestsGrid from './components/MyPullRequestsGrid/Index.vue';
import TaggedPullRequestsGrid from './components/TaggedPullRequestsGrid/Index.vue';
import ApprovedPullRequestsGrid from './components/ApprovedPullRequestsGrid/Index.vue';
import { fetchAllFromGitHub } from './services/graphql'
import * as GithubService from './services/github'

export default {
  name: 'App',
  components: {
    MyPullRequestsGrid,
    TaggedPullRequestsGrid,
    ApprovedPullRequestsGrid,
  },
  data: () => ({
    myPullRequests: [],
    approvedPullRequests: [],
  }),
  mounted() {    
    this.setAllPullRequests()
  },
  methods: {
    async setAllPullRequests() {
      this.loading = true
      try {
        const response = await fetchAllFromGitHub()
        const {
          myPullRequests,
          approvedPullRequests,
          user,
        } = GithubService.transformAPIResponse(response)

        this.myPullRequests = myPullRequests
        this.approvedPullRequests = approvedPullRequests        
        this.user = user

      } catch (error) {
        console.error('Ohhhh crap', error)
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
      <h1>GitHub Info</h1>
    </v-app-bar>

    <v-main class="content">
      <v-row>
        <v-col sm="12" md="12" lg="12">
          <h2>My Pull Requests</h2><br>
          <MyPullRequestsGrid
            :pullRequests="myPullRequests"
          />
        </v-col>
        <v-col sm="12" md="12" lg="12">
          <h2>Tagged Pull Requests</h2><br>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="12" lg="12">
          <h2>Approved Pull Requests</h2><br>
          <ApprovedPullRequestsGrid
            :pullRequests="approvedPullRequests"
           />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<style scoped>
.content {
  margin-top: 24px;
  margin-left: 12px;
}
</style>