<template>
  <div>
    <h2 style="text-align: center; font-size: 3em; font-weight: bold; margin-bottom: 1em; margin-top:20px; ">Scooters</h2>
    <router-link :to="{name: 'addscooters'}" style="display: block; text-align: center;"><button class="btn">Add New Scooters</button></router-link>
    <div class="container">
      <div class="row">
        <!-- Map Container on the Left -->
        <div class="col-4 ">
          <div class="map-container ">
            <div ref="mapContainer" style="width: 450px; height: 400px;"></div>
          </div>
        </div>
        <!-- Scooter Cards -->
        <div class="col-8">
          <div class="row">
            <div class="col-4" v-for="scooter in scooters" :key="scooter._id">
              <div class="card mb-4" style="width: 18rem;">
                <img class="card-img-top" src="../../assets/xiaomi.png" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">{{ scooter.brand }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">{{ scooter.isAvailable ? "Available" : "Not Available" }}</h6>
                  <p class="card-text"><small class="text-muted">{{ scooter.city }}</small></p>
                  <div class="card-body ">
                    <router-link :to="{ name: 'scooterDetails', params: { id: scooter._id } }" class="btn bg-dark text-white" style="margin-right: 1rem; margin-left: 1rem;">See details</router-link>
                    <button :disabled="!scooter.isAvailable" class="btn bg-dark text-white">Rent</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Pagination Controls -->
    <nav aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
        </li>
        <li class="page-item" v-for="pageNumber in totalPages" :key="pageNumber" :class="{ active: pageNumber === currentPage }">
          <a class="page-link" href="#" @click.prevent="changePage(pageNumber)">{{ pageNumber }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>






<script>
import axios from 'axios';
import { useApiPrivate } from "../../composables/useApi"
import { onMounted, ref } from "vue";
import L from "leaflet";

export default {
  data() {
    return {
      scooters: [],
      currentPage: 1,
      itemsPerPage: 6, 
      nbPages: 1, 
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await useApiPrivate().get(`/api/scooter/get_scooters_pagination?page=${this.currentPage}&limit=${this.itemsPerPage}`);
        this.scooters = response.data.scooters;
        this.nbPages = response.data.totalPages;
      } catch (error) {
        console.error('Error fetching scooters:', error);
      }
    }, 
    changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.fetchData();
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchData();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchData();
      }
    },
  },
  computed: {
    totalPages() {
      return this.nbPages;
    },
  },
  setup() {
    const lat = ref(0);
    const lng = ref(0);
    const map = ref();
    const mapContainer = ref();

    onMounted(() => {
      map.value = L.map(mapContainer.value).setView([52.266666, 10.516667], 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.value);

      getLocation();
    });

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
          lat.value = position.coords.latitude;
          lng.value = position.coords.longitude;
          map.value.setView([lat.value, lng.value], 13);

          L.marker([lat.value, lng.value], { draggable: true })
            .addTo(map.value)
            .on("dragend", (event) => {
              console.log(event)
            });
        });
      }
    }

    return { lat, lng, mapContainer };
  }
};
</script>


<style>

  .map-container {
    position: fixed;
    top: 100px;
    left: 0;
    height: 100%;
    overflow-y: auto; /* Enable vertical scrolling */
    padding-left: 20px; /* Adjust as needed */
    background-color: #fff;
  }
  /* Adjust Scooter Card Layout */
  .card {
    margin-bottom: 1rem;
  }
</style>


