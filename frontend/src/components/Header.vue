<template>
    <header class="app-header">
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/analytics">Analytics</router-link>
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
    background-color: #2f2f2f;
}

.nav a {
    margin-right: 15px;
    color:rgb(0, 51, 255);
}

.nav a.router-link-exact-active {
    font-weight: bold;
    color: rgb(251, 0, 255);
}
</style>