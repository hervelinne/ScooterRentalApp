<template>
  <div class="container">
    <div class="details">
      <div class="image-and-content">
        <div class="image-container">
          <img src="../../assets/xiaomi.png" alt="Scooter Image">
        </div>
        <div class="content-container">
          <h1>{{ scooter.brand }}</h1>
          <ul class="scooterinfo">
            <li><strong>Color : </strong>{{ scooter.color }}</li>
            <li><strong>Address : </strong>{{ scooter.address }}</li>
            <li><strong>City : </strong>{{ scooter.city }}</li>
            <li><strong>Price : </strong>{{ scooter.price }}€ Per One Hour</li>
          </ul>
          <div class="button-group">
            <div class="availability" :class="{ 'available': scooter.isAvailable, 'not-available': !scooter.isAvailable }">
              {{ scooter.isAvailable ? 'Available' : 'Not Available' }}
            </div>
            <router-link :to="{ name: 'updatescooters', params: { id: scooter._id } }" class="btn update-btn bg-dark text-white">Update informations</router-link>
            <button @click="deleteScooter" class="btn delete-btn">Delete Scooter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useApiPrivate } from "../../composables/useApi";

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      scooter: null
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
      }
    },
    async deleteScooter() {
      try {
        await useApiPrivate().delete(`/api/scooter/delete_scooter/${this.id}`);
        this.$router.push({ name: 'scooters' });
      } catch (error) {
        console.error('Error deleting scooter:', error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.details {
  display: flex;
  align-items: center;
}

.image-and-content {
  display: flex;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.image-container {
  margin-right: 20px;
}

.content-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  height: auto;
}

.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.availability,
.update-btn,
.delete-btn {
  width: 200px;
  padding: 10px;
  font-size: 1em;
  font-weight: bold;
  border-radius: 5px;
  text-align: center;
}

.availability.available {
  background-color: #28a745;
  color: white;
}

.availability.not-available {
  background-color: #dc3545;
  color: white;
}

.update-btn {
  background-color: #cce5ff;
}

.delete-btn {
  background-color: orange;
  color: white;
}
</style>
