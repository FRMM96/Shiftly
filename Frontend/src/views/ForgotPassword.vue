<script setup>
import { ref } from 'vue'

const email = ref('john@example.com')

const openEmailApp = () => {
}

const resendEmail = () => {
}
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="icon-container">
        <svg
          class="check-mail-icon"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" fill="#2563EB" />
          
          <path
            fill="#FFFFFF"
            d="M20,30 v40 h60 v-40 h-60 z M25,35 h50 v30 h-50 v-30 z M48,50 L58,40 L56,38 L48,46 L44,42 L42,44 L48,50 z"
          />
          
          <path
            fill="none"
            stroke="#FFFFFF"
            stroke-width="3"
            stroke-linecap="round"
            d="M25,35 L50,55 L75,35"
          />
        </svg>
      </div>

      <h1 class="page-title">Check your email</h1>

      <p class="page-text">
        We've sent a password reset link to
        <strong class="email-address">{{ email }}</strong>. Please check your inbox and follow the instructions.
      </p>

      <button
        class="open-app-btn"
        @click="openEmailApp"
      >
        Open email app
      </button>

      <p class="resend-text">
        Didn't receive the email?
        <strong
          class="resend-link"
          @click="resendEmail"
        >Click to resend</strong>
      </p>
    </div>

    <footer class="page-footer">
      <p class="copyright">
        © 2024 Radix Technologies Inc. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb; /* Light background */
  font-family: sans-serif;
  color: #1f2937; /* Dark text color */
}

.content-wrapper {
  text-align: center;
  max-width: 480px; /* Center content like a card */
  padding: 3rem; /* Increase padding for card effect */
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Add subtle shadow for card effect */
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem; /* Increase margin */
}

.check-mail-icon {
  width: 90px; /* Slightly increase size */
  height: 90px;
}

.page-title {
  font-size: 2.75rem; /* Large font size, bold */
  font-weight: bold;
  margin-bottom: 1rem;
  color: #111827; /* Darker black */
}

.page-text {
  font-size: 1.125rem; /* Smaller font size */
  line-height: 1.75;
  margin-bottom: 3rem; /* Increase margin */
  color: #4b5563; /* Slightly lighter text */
}

.email-address {
  font-weight: bold;
  color: #111827; /* Darker black */
}

.open-app-btn {
  background-color: #dbeafe; /* Light blue/grey background */
  color: #2563eb; /* Use the blue from icon for text contrast */
  font-weight: 600;
  padding: 1.25rem 2.5rem; /* Rounded corners for the button */
  border-radius: 0.75rem;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  width: 100%; /* Make button full width of card */
  max-width: 320px; /* Keep it centered like in the picture */
}

.open-app-btn:hover {
  background-color: #bfdbfe;
}

.resend-text {
  font-size: 1rem;
  color: #6b7280; /* Muted gray */
}

.resend-link {
  font-weight: bold;
  color: #2563eb;
  cursor: pointer;
}

.resend-link:hover {
  text-decoration: underline;
}

.page-footer {
  margin-top: 5rem; /* Centered at the very bottom */
  padding: 1rem;
  width: 100%;
  text-align: center;
}

.copyright {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>