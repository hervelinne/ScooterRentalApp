<template>
  <div id="update-scooter">
    <div class="container">
      <div class="card card-body mt-4">
        <h5 class="card-title">Update Scooter</h5>
        <form @submit.prevent="submit">
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
          <div class="mb-3">
            <label for="brand" class="form-label">Brand</label>
            <input v-model="scooter.brand" type="text" class="form-control" id="brand" autocomplete="off">
          </div>
          <div class="mb-3">
            <label for="color" class="form-label">Color</label>
            <select v-model="scooter.color" class="form-select" id="color">
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
            <input v-model="scooter.address" type="text" class="form-control" id="address" autocomplete="off">
          </div>
          <div class="mb-3">
            <label for="city" class="form-label">City</label>
            <input v-model="scooter.city" type="text" class="form-control" id="city" autocomplete="off">
          </div>
          <div class="mb-3">
            <label for="price" class="form-label">Price</label>
            <input v-model="scooter.price" type="number" class="form-control" id="price" autocomplete="off">
          </div>
          <button type="submit" class="btn btn-success">Update Scooter</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useApiPrivate } from "../../composables/useApi";
import { useRouter } from 'vue-router';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      scooter: {
        brand: '',
        color: '',
        address: '',
        city: '',
        price: 0
      },
      errorMessage: ''
    };
  },
  async created() {
    await this.fetchScooterDetails();
  },
  methods: {
    async fetchScooterDetails() {
      try {
        const response = await useApiPrivate().get(`/api/scooter/get_scooter/${this.id}`);
        this.scooter = response.data;
      } catch (error) {
        console.error('Error fetching scooter details:', error);
        this.errorMessage = 'Error fetching scooter details';
      }
    },
    async submit() {
      try {
        await useApiPrivate().put(`/api/scooter/update_scooter/${this.id}`, {
          brand: this.scooter.brand,
          color: this.scooter.color,
          address: this.scooter.address,
          city: this.scooter.city,
          price: this.scooter.price
        });
        this.$router.push({ name: 'scooters' });
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = 'A scooter with this brand already exists!';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    }
  }
};
</script>

<style scoped>
#update-scooter .card {
  max-width: 40vw;
  margin: auto;
}
</style>
