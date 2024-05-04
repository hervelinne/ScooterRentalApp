<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand mx-4 my-lg-0" :to="{name: 'home'}">
      <img :src="scooter"  width="45" height="49" className="d-inline-block align-top" alt=""/>
      <h1 className="d-inline-block px-1">ScooterRental</h1>
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appNavbar" aria-controls="appNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="appNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          
        </ul>
        <ul class="navbar-nav mb-2 mb-lg-0 me-4">
          <li v-if="isAuthenticated" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ user.username }}
            </a>
            <ul class="dropdown-menu ">
              <li><router-link :to="{name: 'user'}" class="dropdown-item">Profile</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><button @click="logout" class="dropdown-item btn btn-danger">Logout</button></li>
            </ul>
          </li>
          <template v-else>
            <li class="nav-item ">
              <router-link :to="{name: 'login'}" class="nav-link" aria-current="page">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'register'}" class="nav-link" aria-current="page">Register</router-link>
            </li>
          </template>
          
        </ul>
      </div>
    </div>
  </nav>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '../stores/auth';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import scooter from '../assets/scooter.png';
  const authStore = useAuthStore()
  
  const router = useRouter()
  
  const user = computed(()=>{
    return authStore.user
  })
  
  const isAuthenticated = computed(()=>{
    return authStore.isAuthenticated
  })
  
  async function logout(){
    await authStore.logout()
      .then( res => {
        router.replace({name: 'home'})
      })
      .catch(err =>{
        console.log(err.message)
      })
  }
  
  </script>


<style scoped>
  #register .card{
    max-width: 40vw;
    margin: auto;
  }
  .nav-link{
    font-size: 1.3em ; 
  }


.dropdown-menu{
  --bs-dropdown-min-width: initial; /* Resets to default */
  /* or specify a custom min-width */
  --bs-dropdown-min-width: 5rem; /* Example of a new min-width */
}
  </style>