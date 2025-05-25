<template>
<div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
        <input v-model="firstName" type="text" placeholder="First name" required />
        <input v-model="lastName" type="text" placeholder="Last name" required />
        <input v-model="email" type="text" placeholder="Email" required />
        <input v-model="password" type="text" placeholder="Password" required />
        <button type="submit">Register</button>
        <p>{{ message }}</p>
    </form>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()

const handleRegister = async () => {
    try {
        const res = await fetch('http://localhost:3000/Register-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_f_name: firstName.value,
                user_l_name: lastName.value,
                user_email: email.value,
                user_password: email.value,
                role: 'user'
            })
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || 'Registration failed')
        }

        message.value = 'Registration Successful'
        router.push('/login')
    } catch (error) {
        message.value = err.message
    }
}
</script>

<style scoped>

.register-container {
    max-width: 400px;
    margin: 40px auto;
    padding: 30px;
    background-color: rgb(81, 81, 81);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    color: rgb(227, 227, 227);
}

.register-container h2 {
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
    border: 1px solid rgb(7, 181, 91);
    border-radius: 6px;
    background-color: rgb(137, 137, 137);
    color: rgb(228, 228, 228);
    font-size: 14px;
}

input:focus {
    outline: none;
    border-color: rgb(37, 243, 109);
    box-shadow: 0 0 5px aquamarine;
}

button {
    padding: 10px;
    border: none;
    border-radius: 6px;
    background-color: rgb(1, 197, 8);
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

button:hover {
    background-color: rgb(0, 255, 157);
}

p {
    text-align: center;
    margin-top: 10px;
    color: rgb(0, 255, 106);
}
</style>