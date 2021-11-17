<script>
import RunningBuildsList from '../RunningBuildsList/Index.vue'

export default {
  name: 'ToDoList',
  components: {
    RunningBuildsList,
  },
  props: {
    builds: {
      type: Array,
      required: true,
    },
    branches: {
      type: Array,
      required: true,
    },
  },
  data: () => {
    return {
      drawer: true,
      mini: true,
    }
  }
}
</script>

<template>
  <v-navigation-drawer
    absolute
    right
    permanent
    v-model="drawer"
    :mini-variant="mini"
    width="350"
  >
    <v-list-item class="px-2">
      <v-list-item-icon>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>
            {{ mini ? 'mdi-chevron-left' : 'mdi-chevron-right'}}
          </v-icon>
        </v-btn>
      </v-list-item-icon>

      <v-list-item-content
        class="text-h6"
      >
        <h3>Checklist</h3>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
  
    <v-list dense>
      <v-list-item
        class="itemContainer"
      >
        <v-icon
          class="icon"
          :color="builds.length > 0 ? 'yellow' : 'green'"
        >
          {{ builds.length > 0 ? 'mdi-alpha-b-circle' : 'mdi-check-circle-outline'}}
        </v-icon>

        <v-list-item-content>
          <h3
            class="text-subtitle-1 sectionTitle"
          >Builds</h3>
          <RunningBuildsList 
            v-if="builds.length > 0"
            :items="builds" 
          />
          <p 
            v-else
            class="text-subtitle-2 sectionTitle"
          >
            All builds complete
          </p>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        class="itemContainer"
      >
        <v-icon
          class="icon"
          :color="branches.length > 0 ? 'yellow' : 'green'"
        >
          {{ branches.length > 0 ? 'mdi-source-merge' : 'mdi-check-circle-outline'}}
        </v-icon>

        <v-list-item-content>
          <h3
            class="text-subtitle-1 sectionTitle"
          >Stale Branches</h3>
          <RunningBuildsList
            v-if="branches.length > 0"
            :items="branches" 
          />
          <p 
            v-else
            class="text-subtitle-2 sectionTitle"
          >
            No stale branches
          </p>
        </v-list-item-content>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.icon {
  margin-top: 10px;
}

.itemContainer {
  display: flex;
  align-items: flex-start;
}

.sectionTitle {
  margin-left: 12px;
}
</style>