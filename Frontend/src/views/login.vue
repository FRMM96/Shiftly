<template>
    <div class="login-page">
        <div class="login-container">
            <h1>Login</h1>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="username" placeholder="Enter your username" required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" placeholder="Enter your password"
                        required />
                </div>
                <button type="submit">Login</button>
            </form>
            <div class="register-link">
                <p>Don't have an account? <router-link to="/registerAccount">Register here</router-link></p>
            </div>
        </div>
    </div>
</template>

<script>
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

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f2f5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.login-container {
    background: #ffffff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

h1 {
    margin-bottom: 24px;
    color: #1c1e21;
    font-size: 28px;
    font-weight: 600;
}

.form-group {
    margin-bottom: 20px;
    text-align: left;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #606770;
    font-size: 14px;
    font-weight: 500;
}

input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #dddfe2;
    border-radius: 6px;
    font-size: 16px;
    box-sizing: border-box;
    /* Important for padding to be inside the width */
    transition: border-color 0.2s;
}

input[type="text"]:focus,
input[type="password"]:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #0056b3;
}

.register-link {
    margin-top: 24px;
    font-size: 14px;
}

.register-link p {
    color: #606770;
}

.register-link a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
}

.register-link a:hover {
    text-decoration: underline;
}
</style>