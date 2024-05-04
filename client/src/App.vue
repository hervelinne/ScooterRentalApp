<script setup lang="ts">
import { RouterView } from 'vue-router'
import Nav from "./components/NavBar.vue";
</script>

<template>
  <div id="app">
    <Nav/>
    <RouterView />
  </div>
</template>


