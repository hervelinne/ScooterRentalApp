<template>
    <div id="login">
      <div class="container">
        <div class="card card-body mt-4">
          <h5 class="card-title">Login</h5>
          <form @submit.prevent="submit">
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{errorMessage}}
          </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input v-model="loginData.email" type="email" class="form-control" id="email" autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input v-model="loginData.password" type="password" class="form-control" id="password">
            </div>
            <button type="submit" class="btn btn-success">Login</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore, type LoginData } from '../../stores/auth';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  const loginData = reactive<LoginData>({
    email: "",
    password: "",
  })
  
  const errorMessage = ref<string>("")
  
// Async function to handle login and navigation
async function submit() {
  try {
    await authStore.login(loginData); // Attempt to log in with provided data
    router.replace({ name: 'user' }); // Navigate to the 'user' route upon success
  } catch (err:any) {
      if (err.includes('422')) {
          errorMessage.value = 'Invalid fields!';
        } else if (err.includes('401')) {
          errorMessage.value = 'Email or password is incorrect !!';
        } else if (err.includes('400')) {
          errorMessage.value = 'Error occured. Could not log in!';
        } else {
          errorMessage.value = 'An unexpected error occurred.';
        }
  }
}
  
  </script>
  
  <style scoped>
  #login .card{
    max-width: 40vw;
    margin: auto;
  }
  </style>