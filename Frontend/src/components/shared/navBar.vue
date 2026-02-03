<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <!-- Brand -->
        <a class="navbar-brand fw-bold" href="#">Radix</a>

        <!-- Toggle button -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar"
            aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- COLLAPSE -->
        <div class="collapse navbar-collapse" id="mainNavbar">
            <!-- Left nav -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
            </ul>

            <!-- Right side: search -->
            <form class="d-flex align-items-center">
                <input class="form-control form-control-sm me-2" type="search" placeholder="Search"
                    aria-label="Search" />
                <button class="btn btn-outline-light btn-sm" type="submit">
                    <i class="bi bi-search"></i>
                </button>
            </form>
        </div>
    </nav>
</template>

<script>
export default {
    name: "MainNavbar",
};
</script>

<style scoped>
.navbar-brand {
    letter-spacing: 0.5px;
}

.nav-link {
    font-size: 15px;
}

.form-control {
    border-radius: 20px;
}

.btn {
    border-radius: 50%;
}
</style>
