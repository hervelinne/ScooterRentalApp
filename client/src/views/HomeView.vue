<script setup>
import homescooter from '../assets/homescooter.png'; // Correct import path
</script>

<template>
  <main>
    <div className="home container-fluid ps-4">
      <div className="row ms-5">
          <div className="col-md-5 mt-5 ms-5 ">
            <img className="rounded float-left img-fluid"  :src="homescooter" alt="man driving a scoter" />
          </div>
          <div id="text" class="col-md-5 mt-5">
          
        <!-- Title for the section -->
        <h1 id="title" class="card-title mt-5">Explore Our Scooter Rentals</h1>
        <!-- Subtitle for additional context -->
        <h2 class="card-subtitle mb-2 mt-3 text-muted">Rent a Scooter with Ease</h2>
        <!-- Description to explain the app's benefits -->
        <p class="card-text mt-5">
          Our app simplifies the process of renting a scooter, allowing you to find and book your ride in just a few easy steps. Choose from a variety of scooters and rental plans that suit your needs, whether for a quick city tour or a longer adventure.
        </p>
      
          </div> 
       </div>
      <div class="container">
   
      

      <!-- You can add more content to describe the features and benefits -->
      
    
  </div>
    </div>
  </main>
</template>

<style scoped>
#title{
  padding-top: 90px;
}
</style>