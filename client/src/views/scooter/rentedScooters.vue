<template>
  <div class="rented-scooters">
    <h2 style="text-align: center; font-size: 3em; font-weight: bold; margin-bottom: 1em; margin-top:20px; ">Rented Scooters {{ userId }}</h2>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <div v-if="rentedScooters.length === 0" class="no-rentals">
        You have no rented scooters. {{ userId }}
      </div>
      <div v-else class="scooter-list">
        <div class="col-12">
          <div class="row">
            <div class="col-3" v-for="scooter in rentedScooters" :key="scooter._id">
              <div class="card mb-4" style="width: 18rem;">
                <img class="card-img-top" src="../../assets/xiaomi.png" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">{{ scooter.scooter.brand }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">{{ scooter.scooter.isAvailable ? "Available" : "Not Available" }}</h6>
                  <p class="card-text"><small class="text-muted">{{ scooter.scooter.city }}</small></p>
                  <p class="card-text"><small class="text-muted">{{ scooter.scooter.price }}€/Day</small></p>
                  <p><strong>Start Date:</strong> {{ formatDate(scooter.startTime) }}</p>
                  <p><strong>End Date:</strong> {{ formatDate(scooter.endTime) }}</p>
                  <div class="card-body ">
                    <button  class="btn bg-dark text-white"  @click="deleteRentedScooter(scooter._id)" >Delete</button> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="Pagination">
        <ul class="pagination justify-content-center mt-4">
          <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
            <button class="page-link" @click="prevPage" :disabled="currentPage === 1">Previous</button>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': page === currentPage }">
            <button class="page-link" @click="gotoPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
            <button class="page-link" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../../stores/auth';
import { useApiPrivate } from "../../composables/useApi"

export default {
  data() {
    return {
      authStore: useAuthStore(),
      rentedScooters: [],
      errorMessage: '',
      loading: true,
      currentPage: 1,
      totalPages: 0,
      limit: 10  // Adjust the limit as per your backend pagination settings
    };
  },
  created() {
    this.fetchRentedScooters();
  },
  methods: {
    async fetchRentedScooters() {
      try {
        this.loading = true;
        const userId = this.authStore.user?._id;
        const response = await useApiPrivate().get(`/api/user/rented-scooters/${userId}?page=${this.currentPage}&limit=${this.limit}`);
        this.rentedScooters = response.data.rentedScooters;
        console.log("here"+JSON.stringify(this.rentedScooters));
        this.totalPages = response.data.totalPages;
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteRentedScooter(rentalId) {
      try {
        this.loading = true;
        const response = await useApiPrivate().delete(`/api/rental/${rentalId}`);
        console.log(JSON.stringify(response));
        this.rentedScooters = this.rentedScooters.filter(scooter => scooter._id !== rentalId);
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchRentedScooters();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchRentedScooters();
      }
    },
    gotoPage(page) {
      this.currentPage = page;
      this.fetchRentedScooters();
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  }
};
</script>

<style scoped>
.rented-scooters {
  padding: 20px;
}

.loading {
  font-size: 1.2em;
}

.no-rentals {
  font-size: 1.2em;
  color: gray;
}

.scooter-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scooter-item {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
}

.scooter-item h3 {
  margin: 0 0 10px;
}

.pagination {
  margin-top: 20px;
}
</style>
