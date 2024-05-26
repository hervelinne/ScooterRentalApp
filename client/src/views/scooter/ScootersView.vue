<template>
<div>
    <h2 style="text-align: center; font-size: 3em; font-weight: bold; margin-bottom: 1em; margin-top:20px; ">Scooters</h2>
    <router-link :to="{name: 'addscooters'}" style="display: block; text-align: center;"><button class="btn">Add New Scooters</button></router-link>
    <div class="container">
      <div class="row">

     <!-- Map and Draggable Filters Sidebar -->
        <div id="sidebar" class="draggable-sidebar" v-show="sidebarVisible">
          <div class="draggable-handle">Filters</div>
          <div class="map-container">
            <div ref="mapContainer" style="width: 450px; height: 400px;"></div>
            <!-- Filter Controls -->
            <div class="filter-container">
              <!-- Color Filter -->
              <div class="filter-option">
                <label for="color">Color:</label>
                <select v-model="selectedColor" @change="applyFilters">
                  <option value="">All</option>
                  <option v-for="color in colors" :key="color">{{ color }}</option>
                </select>
              </div>

              <!-- City Filter -->
              <div class="filter-option">
                <label for="city">City:</label>
                <select v-model="selectedCity" @change="applyFilters">
                  <option value="">All</option>
                  <option v-for="city in cities" :key="city">{{ city }}</option>
                </select>
              </div>

              <!-- Brand Filter -->
              <div class="filter-option">
                <label for="brand">Brand:</label>
                <select v-model="selectedBrand" @change="applyFilters">
                  <option value="">All</option>
                  <option v-for="brand in brands" :key="brand">{{ brand }}</option>
                </select>
              </div>

              <!-- Price Filter -->
              <div class="filter-option">
                 <label for="price">Price:</label>
                <label for="minPrice">Min Price:</label>
                <input type="number" v-model="minPrice" @change="applyFilters" :min="priceRange.max" :max="maxPrice">
                <label for="maxPrice">Max Price:</label>
                <input type="number" v-model="maxPrice" @change="applyFilters" :min="minPrice" :max="priceRange.max">
              
              </div>

              <!-- Near Me Filter -->
              <div class="filter-option">
                <button @click="fetchNearbyScooters">Near Me</button>
              </div>
            </div>
            <!-- Reset button -->
            <button @click="resetFilters">Reset</button>
          </div>
        </div>

        <!-- Round Button to Toggle Sidebar -->
        <button @click="toggleSidebar" class="toggle-sidebar-button">
          <span v-if="sidebarVisible">✖</span>
          <span v-else>☰</span>
        </button>
        <!-- Scooter Cards -->
        <div :class="[{'offset-4': sidebarVisible}, sidebarVisible ? 'col-8' :'col-12' ]">
          <div class="row">
            <div :class="sidebarVisible ? 'col-4' :'col-3'" v-for="scooter in scooters" :key="scooter._id">
              <div class="card mb-4" style="width: 18rem;">
                <img class="card-img-top" src="../../assets/xiaomi.png" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">{{ scooter.brand }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">{{ scooter.isAvailable ? "Available" : "Not Available" }}</h6>
                  <p class="card-text"><small class="text-muted">{{ scooter.city }}</small></p>
                  <p class="card-text"><small class="text-muted">{{ scooter.price }}€/hour</small></p>
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
import interact from 'interactjs';
import $ from 'jquery';

export default {
  data() {
    return {
      scooters: [],
      currentPage: 1,
      itemsPerPage: 6, 
      nbPages: 1, 
      //userLocation: { latitude: 0, longitude: 0 }, // Default user location
      sidebarVisible: true, // Controls sidebar visibility
      selectedColor: '',
      selectedCity: '',
      selectedBrand: '',
      minPrice: 0, // Initial min price
      maxPrice: 100, // Initial max price
      priceRange: { min: 0, max: 100 } 
    };
  },
  created() {
    this.fetchData();
    this.fetchFilterOptions();
  },
  methods: {
    async fetchData() {
      try {
        const response = await useApiPrivate().get(`/api/scooter/get_scooters_pagination?page=${this.currentPage}&limit=${this.itemsPerPage}`);
        this.scooters = response.data.scooters;
        this.nbPages = response.data.totalPages;
        this.applyFilters(); // Apply initial filters
      } catch (error) {
        console.error('Error fetching scooters:', error);
      }
    }, 
    async fetchFilterOptions() {
      try {
        const response = await useApiPrivate().get('/api/scooter/filter_options');
        this.colors = response.data.colors;
        this.cities = response.data.cities;
        this.brands = response.data.brands;
        this.priceRange = { min: response.data.minPrice, max: response.data.maxPrice };
        this.minPrice = this.priceRange.min;
        this.maxPrice = this.priceRange.max;
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    },
    async applyFilters() {
      try {
        const response = await useApiPrivate().get(`/api/scooter/get_scooters_pagination`, {
          params: {
            page: this.currentPage,
            limit: this.itemsPerPage,
            color: this.selectedColor,
            city: this.selectedCity,
            brand: this.selectedBrand,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice
          }
        });        
        this.scooters = response.data.scooters;
        this.nbPages = response.data.totalPages;
      } catch (error) {
        console.error('Error applying filters:', error);
      }
    },
    resetFilters() {
      this.selectedColor = '';
      this.selectedCity = '';
      this.selectedBrand = '';
       this.minPrice = this.priceRange.min; // Reset min price to default
      this.maxPrice = this.priceRange.max; // Reset max price to default
      this.fetchData();
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
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
      if (this.sidebarVisible) {
        this.initializeMap(); // Reinitialize the map when the sidebar is shown
      }
    }, 
    async fetchNearbyScooters() {
        try {
            const position = await this.getCurrentPosition();
            console.log("position"+position.coords.latitude); 
            const response = await useApiPrivate().get(`/api/scooter/nearby`,{
              params: {
                longitude: position.coords.longitude,
                latitude: position.coords.latitude,
                page: this.currentPage,
                limit: this.itemsPerPage
              }
            }); 
            this.scooters = response.data.scooters;
            console.log(this.scooters.length()); 
        } catch (error) {
            console.error('Error fetching nearby scooters:', error);
        }
    },
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
  },
  
  computed: {
    totalPages() {
      return this.nbPages;
    },
  },
  setup() {
    const lat = ref(0);
    const lng = ref(0);
    const map = ref(null);
    const mapContainer = ref(null);

    onMounted(() => {
       initializeMap();

      interact('#sidebar').draggable({
        allowFrom: '.draggable-handle',
        listeners: {
          move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          }
        }
      });
      
    });
  function initializeMap() {
      if (map.value) {
        map.value.remove(); // Remove the existing map instance if it exists
      }
      map.value = L.map(mapContainer.value).setView([52.266666, 10.516667], 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map.value);
      getLocation();
    }

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
  height: 100%;
  padding-left: 20px;
  background-color: #fff;
}

.draggable-sidebar {
  position: absolute;
  top: 100px;
  left: 0;
  width: 500px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000; /* Ensure the sidebar is on top */
}

.draggable-handle {
  cursor: move;
  background-color: #f5f5f5;
  padding: 5px;
  margin-bottom: 10px;
  text-align: center;
}

.filter-container {
  margin-top: 20px;
}

.card {
  margin-bottom: 1rem;
}

.toggle-sidebar-button {
  position: fixed;
  top: 50px;
  left: 10px;
  z-index: 1001; /* Ensure the button is on top */
  background-color: #007bff;
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.toggle-sidebar-button:hover {
  background-color: #0056b3;
}

.slider-container {
  position: relative;
}

</style>
