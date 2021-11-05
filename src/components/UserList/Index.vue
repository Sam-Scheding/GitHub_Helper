
<script>

export default {
  name: 'UserList',
  props: {
    items: {
      type: Array,
      default: [],
    },
  },
}
</script>

<template>
  <v-list class="root">
    <template v-for="(item, index) in items">
      <div
        :key="index"
        class="item"
      >
        <v-list-item-content>
          {{ item.name }}
        </v-list-item-content>
      </div>
    </template>    
  </v-list>
</template>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.item {
  display: flex;
  line-height: 10px;
  padding: 0px;
  margin: 0px;
}
</style>
