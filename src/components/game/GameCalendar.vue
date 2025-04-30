<template>
    <div class="bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-xl overflow-hidden">
        <div class="p-6">
            <div class="flex justify-between items-center mb-6">
                <h3
                    class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    Game Schedules</h3>
                <div class="flex items-center space-x-4">
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="Search schedules..."
                            class="input pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div v-if="isLoading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>

            <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-3" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm text-red-700">{{ error }}</p>
            </div>

            <div v-else-if="schedules && schedules.length">
                <!-- Enhanced Filter controls -->
                <div class="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                            <select v-model="filterSport"
                                class="input w-full bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">All Sports</option>
                                <option v-for="sport in availableSports" :key="sport" :value="sport">{{ sport }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Season</label>
                            <select v-model="filterSeason"
                                class="input w-full bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">All Seasons</option>
                                <option v-for="season in availableSeasons" :key="season" :value="season">{{ season }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select v-model="filterStatus"
                                class="input w-full bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500">
                                <option value="">All Statuses</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Grid View -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="schedule in filteredSchedules" :key="schedule.id"
                        class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-indigo-300">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-semibold text-gray-900">{{ schedule.name || schedule.sport }}</h4>
                            <span :class="[
                                'px-3 py-1 rounded-full text-xs font-medium',
                                schedule.status === 'PUBLISHED' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                            ]">
                                {{ schedule.status }}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-2">{{ schedule.season }}</p>
                        <p class="text-xs text-gray-500 mb-4">Last updated: {{ formatDate(schedule.updatedAt) }}</p>
                        <div class="flex justify-between items-center">
                            <button @click="viewGames(schedule)"
                                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>View Games</span>
                            </button>
                            <button v-if="isAdmin" @click="editSchedule(schedule)"
                                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="filteredSchedules.length === 0"
                    class="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="mt-2 text-gray-500">No schedules match your filters</p>
                </div>
            </div>

            <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="mt-2 text-gray-500">No game schedules found</p>
                <button v-if="isAdmin" @click="createNewSchedule"
                    class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Create New Schedule
                </button>
            </div>
        </div>
    </div>

    <!-- Enhanced Games Modal -->
    <div v-if="showGamesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900">{{ selectedSchedule?.sport }} - {{
                            selectedSchedule?.season }}</h3>
                        <p class="text-sm text-gray-500 mt-1">Schedule ID: {{ selectedSchedule?.id }}</p>
                    </div>
                    <button @click="showGamesModal = false" class="text-gray-400 hover:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div v-if="loadingGames" class="flex justify-center my-8">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>

                <div v-else-if="gamesError" class="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-4">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">{{ gamesError }}</p>
                        </div>
                    </div>
                </div>

                <div v-else-if="games.length === 0" class="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="mt-2 text-gray-500">No games found for this schedule</p>
                </div>

                <div v-else class="space-y-4">
                    <div v-for="game in games" :key="game.id"
                        class="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="flex items-center space-x-2 mb-2">
                                    <h4 class="font-medium text-gray-900">{{ game.opponent }}</h4>
                                    <span class="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                                        {{ game.gameType }}
                                    </span>
                                </div>
                                <div class="space-y-1">
                                    <p class="text-sm text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {{ formatDate(game.gameDate) }}
                                    </p>
                                    <p class="text-sm text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {{ formatTime(game.gameStart) }}
                                    </p>
                                    <p class="text-sm text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {{ game.venue }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                <button v-if="isAdmin" @click="editGame(game)"
                                    class="text-gray-500 hover:text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { gameService } from '@/services/gameService';
import { useAuthStore } from '@/stores/auth';

// Data
const schedules = ref([]);
const isLoading = ref(false);
const error = ref(null);
const filterSport = ref('');
const filterSeason = ref('');
const filterStatus = ref('');
const searchQuery = ref('');

// Games modal data
const showGamesModal = ref(false);
const selectedSchedule = ref(null);
const games = ref([]);
const loadingGames = ref(false);
const gamesError = ref(null);

// Auth store
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.currentUser?.role === 'admin');

// Computed properties
const availableSports = computed(() => {
    const sports = new Set(schedules.value.map(s => s.sport));
    return [...sports];
});

const availableSeasons = computed(() => {
    const seasons = new Set(schedules.value.map(s => s.season));
    return [...seasons];
});

const filteredSchedules = computed(() => {
    return schedules.value.filter(schedule => {
        // Apply sport filter
        if (filterSport.value && schedule.sport !== filterSport.value) {
            return false;
        }

        // Apply season filter
        if (filterSeason.value && schedule.season !== filterSeason.value) {
            return false;
        }

        // Apply status filter
        if (filterStatus.value && schedule.status !== filterStatus.value) {
            return false;
        }

        // Apply search filter
        if (searchQuery.value) {
            const searchLower = searchQuery.value.toLowerCase();
            return (
                (schedule.name?.toLowerCase().includes(searchLower)) ||
                (schedule.sport?.toLowerCase().includes(searchLower)) ||
                (schedule.season?.toLowerCase().includes(searchLower))
            );
        }

        return true;
    });
});

// Methods
async function fetchSchedules() {
    isLoading.value = true;
    error.value = null;

    try {
        const response = await gameService.getGameSchedules();
        if (response.data.flag && response.data.code === 200) {
            schedules.value = response.data.data;
        } else {
            error.value = response.data.message || 'Failed to load schedules';
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while loading the schedules';
        console.error('Schedule fetch error:', err);
    } finally {
        isLoading.value = false;
    }
}

const viewGames = async (schedule) => {
    selectedSchedule.value = schedule;
    showGamesModal.value = true;
    loadingGames.value = true;
    gamesError.value = null;

    try {
        const response = await gameService.getGamesForSchedule(schedule.id);
        if (response.data.flag && response.data.code === 200) {
            games.value = response.data.data || [];
        } else {
            gamesError.value = response.data.message || 'Failed to load games';
        }
    } catch (err) {
        gamesError.value = err.response?.data?.message || 'An error occurred while loading games';
        console.error('Error loading games:', err);
    } finally {
        loadingGames.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${parseInt(hours) % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
};

const createNewSchedule = () => {
    // TODO: Implement create new schedule functionality
    console.log('Create new schedule');
};

const editSchedule = (schedule) => {
    // TODO: Implement edit schedule functionality
    console.log('Edit schedule:', schedule);
};

const editGame = (game) => {
    // TODO: Implement edit game functionality
    console.log('Edit game:', game);
};

// Lifecycle
onMounted(() => {
    fetchSchedules();
});
</script>

<style scoped>
.input {
    @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}

.btn-primary {
    @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}

.btn-secondary {
    @apply inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
</style>