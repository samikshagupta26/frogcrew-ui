<template>
    <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center space-x-8">
                    <!-- Logo/Brand -->
                    <div class="flex items-center">
                        <div
                            class="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <span class="text-white font-bold text-lg">FC</span>
                        </div>
                        <span class="ml-2 text-lg font-semibold text-gray-900">Frog Crew</span>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="flex space-x-6">
                        <router-link to="/admin/game-management"
                            class="relative px-3 py-2 text-sm font-medium transition-colors duration-200" :class="[
                                $route.path === '/admin/game-management'
                                    ? 'text-emerald-600'
                                    : 'text-gray-500 hover:text-gray-900'
                            ]">
                            Game Management
                            <span v-if="$route.path === '/admin/game-management'"
                                class="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-full"></span>
                        </router-link>

                    </nav>
                </div>

                <!-- Dashboard Button -->
                <div class="flex items-center">
                    <router-link to="/"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminNavbar'
};
</script>