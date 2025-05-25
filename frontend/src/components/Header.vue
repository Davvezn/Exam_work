<template>
    <header class="app-header">
        <nav class="nav">
            <router-link to="/">Home</router-link>
            <router-link to="/analytics">Analytics</router-link>
            <router-link to="/Register-User">Register</router-link>
            <router-link to="/Log-in">Log in</router-link>
        </nav>
    </header>
</template>

<script>

</script>

<style>
.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #414141;
}

.nav a {
    margin-right: 15px;
    color:rgb(0, 150, 50);
}

.nav a.router-link-exact-active {
    font-weight: bold;
    color: aquamarine;
}
</style>