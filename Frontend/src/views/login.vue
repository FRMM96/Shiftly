<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
        <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
        </form>

        <div class="mt-3 text-center">
            <p>Don't have an account? <a href="/registerAccount">Register account</a></p>
        </div>
    </div>
</template>

<script>
    //import axios from 'axios';

    export default {
        name: 'LoginView',
        data() {
            return {
                username: '',
                password: ''
            };
        },
        methods: {
            handleLogin() {
                console.log(`Logging in with username: ${this.username} and password: ${this.password}`);
            }
        }
    };
</script>

<style>
.login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>