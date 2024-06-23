<template>
  <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;" v-if="visible">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Rent Scooter</h5>
        </div>
        <div class="modal-body">
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
          <div class="form-group">
            <label for="start-time">Start Date:</label>
            <input
              type="date"
              class="form-control"
              id="start-time"
              v-model="startTime"
              :min="minStartDate"
              :max="maxStartDate"
              @change="validateStartDate"
            />
          </div>
          <div class="form-group">
            <label for="end-time">End Date:</label>
            <input
              type="date"
              class="form-control"
              id="end-time"
              v-model="endTime"
              :min="minEndDate"
              :max="maxEndDate"
              @change="validateEndDate"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
          <button type="button" class="btn btn-primary" @click="confirmRental">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useApiPrivate } from "../../../composables/useApi";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    scooter: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      startTime: '',
      endTime: '',
      rentals: [],
      errorMessage: '',
      minStartDate: '',
      maxStartDate: '',
      minEndDate: '',
      maxEndDate: ''
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.fetchRentalData();
      }
    }
  },
  methods: {
    async fetchRentalData() {
      try {
        const response = await useApiPrivate().get(`/api/scooter/rentals/${this.scooter._id}`);
        this.rentals = response.data;
        this.setMinMaxDates();
      } catch (error) {
        this.errorMessage = 'Failed to fetch rentals';
        console.error('Error fetching rentals:', error);
      }
    },
    setMinMaxDates() {
      const today = new Date();
      this.minStartDate = this.formatDate(today);
      this.maxStartDate = this.formatDate(new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)); // Two weeks from today

      this.minEndDate = this.startTime ? this.startTime : this.minStartDate;
      this.maxEndDate = this.maxStartDate; // End date cannot be beyond the two-week limit
    },
    validateStartDate() {
      if (this.startTime) {
        const start = new Date(this.startTime);
        if (this.isDateInRange(start)) {
          this.errorMessage = 'The selected start date is during an already booked period.';
          this.startTime = null;
        }
        this.minEndDate = this.startTime;
      }
    },
    validateEndDate() {
      if (this.endTime) {
        const end = new Date(this.endTime);
        if (this.isDateInRange(end)) {
          this.errorMessage = 'The selected end date is during an already booked period.';
          this.endTime = null;
        }
      }
    },
    isDateInRange(date) {
      return this.rentals.some(rental => {
        const rentalStart = new Date(rental.startTime);
        const rentalEnd = new Date(rental.endTime);
        return date >= rentalStart && date <= rentalEnd;
      });
    },
    confirmRental() {
      if (this.checkTime()) {
        this.errorMessage = '';
        const obj = {
          startTime: this.startTime,
          endTime: this.endTime
        };
        this.$emit('confirm-rental', obj);
        this.resetTimes();
      } else {
        this.errorMessage = 'The dates entered are invalid!';
      }
    },
    close() {
      this.$emit('close');
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    resetTimes() {
      this.startTime = this.formatDate(new Date());
      this.endTime = '';
    },
    checkTime() {
      if (this.startTime && this.endTime && this.endTime > this.startTime && this.startTime >= this.formatDate(new Date())) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
