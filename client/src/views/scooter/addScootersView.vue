<template>
    <div id="add-scooter">
      <div class="container">
        <div class="card card-body mt-4">
          <h5 class="card-title">Add Scooter</h5>
          <form @submit.prevent="submit">
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
              {{ errorMessage }}
            </div>
            <div class="mb-3">
              <label for="brand" class="form-label">Brand</label>
              <input v-model="scooterData.brand" type="text" class="form-control" id="brand" autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="color" class="form-label">Color</label>
              <select v-model="scooterData.color" class="form-select" id="color">
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Yellow">Yellow</option>
                <option value="Green">Green</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="address" class="form-label">Address</label>
              <input v-model="scooterData.address" type="text" class="form-control" id="address" autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="city" class="form-label">City</label>
              <input v-model="scooterData.city" type="text" class="form-control" id="city" autocomplete="off">
            </div>
            <div class="mb-3">
            <label for="latitude" class="form-label">Latitude</label>
            <input v-model="scooterData.latitude" type="text" class="form-control" id="latitude" autocomplete="off">
          </div>
          <div class="mb-3">
            <label for="longitude" class="form-label">Longitude</label>
            <input v-model="scooterData.longitude" type="text" class="form-control" id="longitude" autocomplete="off">
          </div>
            <div class="mb-3">
              <label for="price" class="form-label">Price</label>
              <input v-model="scooterData.price" type="number" class="form-control" id="price" autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="imageName" class="form-label">Image Name</label>
              <input v-model="scooterData.imageName" type="text" class="form-control" id="imageName" autocomplete="off">
            </div>
            <button type="submit" class="btn btn-success">Add Scooter</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useScooterStore, type Scooter } from '../../stores/scooters';
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const ScooterStore = useScooterStore()
  const router = useRouter()
  
  const scooterData = reactive<Scooter>({
    brand: "",
    color: "Black",
    address: "",
    city: "",
    latitude: 0,
    longitude: 0,
    price: undefined, 
    imageName: ""
  });
  
  const errorMessage = ref<string>("");
  
  async function submit() {
    try {
      await ScooterStore.addScooter(scooterData);
      router.push({ name: 'scooters' });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        errorMessage.value = 'A scooter with this brand and model already exists!';
      } else {
        errorMessage.value = 'An unexpected error occurred.';
      }
    }
  }
  </script>
  
  <style scoped>
  #add-scooter .card {
    max-width: 40vw;
    margin: auto;
  }
  </style>
  