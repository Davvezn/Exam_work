<template>
<div class="Login container">
    <h2>Log in</h2>
    <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required>
        <input v-model="password" type="password" placeholder="Password" required>
        <button type="submit">Log in</button>
        <p>{{ message }}</p>

    </form>
</div>
</template>

<script setup>
import { error } from 'elysia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()

const handleLogin = async() => {
    try {
        const res = await fetch('http://localhost:3000/log-in', {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_emil: email.value,
                user_password: password.value
            })
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || 'Login failed')
        }

        localStorage.setItem('token', data.token)
        message.value = 'login Successful!'
        router.push('/') //or a dashboar route
    } catch (error) {
        message.value = error.message
    }
}
</script>

<style>
.Login.container {
    max-width: 400px;
    margin: 40px auto;
    padding: 30px;
    background-color: rgb(81, 81, 81);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0, 0.4);
    color: rgb(216, 216, 216);
}

.Login.container h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

input {
    padding: 10px;
    border: 1px solid #555;
    border-radius: 6px;
    background-color: #1e1e1e;
    color: whitesmoke;
    font-size: 14px;
}

input:focus {
    outline: none;
    border-color: rgb(112, 255, 207);
    box-shadow: 0 0 5px rgb(115, 234, 125);
}

button {
    padding: 10px;
    border: none;
    border-radius: 6px;
    background-color: green;
    color: whitesmoke;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

button:hover {
    background-color: greenyellow;
}

p {
    text-align: center;
    margin-top: 10px;
    color: aqua;
}
</style>