<template>
    <div class="max-w-4xl mx-auto">
        <div class="bg-white shadow-lg rounded-xl overflow-hidden">
            <!-- Header Section -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                <h3 class="text-2xl font-bold text-white">Submit Your Availability</h3>
                <p class="text-blue-100 mt-2">Let us know when you're available for upcoming games</p>
            </div>

            <!-- Loading State -->
            <div v-if="isLoadingGames" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="loadError" class="p-6">
                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">{{ loadError }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Games List -->
            <div v-else-if="games && games.length" class="p-6 space-y-6">
                <div v-for="game in games" :key="game.id"
                    class="border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
                    <!-- Game Header -->
                    <div class="bg-gray-50 px-6 py-4 border-b">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="text-lg font-semibold text-gray-900">{{ game.opponent }}</h4>
                                <div class="mt-1 flex items-center text-sm text-gray-500">
                                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{{ formatDate(game.gameDate) }}</span>
                                    <span class="mx-2">•</span>
                                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{{ formatTime(game.gameStart) }}</span>
                                </div>
                                <p class="mt-1 text-sm text-gray-600">{{ game.venue }}</p>
                            </div>
                            <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {{ game.gameType }}
                            </span>
                        </div>
                    </div>

                    <!-- Availability Form -->
                    <div class="p-6">
                        <div class="space-y-4">
                            <!-- Availability Selection -->
                            <div class="flex space-x-6">
                                <label class="flex items-center space-x-3 cursor-pointer group">
                                    <div class="relative">
                                        <input type="radio" :name="`availability-${game.id}`" value="true"
                                            v-model="availabilities[game.id].available" class="sr-only peer">
                                        <div
                                            class="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-600 
                                            peer-checked:bg-blue-600 group-hover:border-blue-500 transition-colors duration-200">
                                            <div class="w-2 h-2 rounded-full bg-white m-1.5 transform scale-0 peer-checked:scale-100 
                                                transition-transform duration-200"></div>
                                        </div>
                                    </div>
                                    <span class="text-gray-700 group-hover:text-gray-900">Available</span>
                                </label>

                                <label class="flex items-center space-x-3 cursor-pointer group">
                                    <div class="relative">
                                        <input type="radio" :name="`availability-${game.id}`" value="false"
                                            v-model="availabilities[game.id].available" class="sr-only peer">
                                        <div
                                            class="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-red-600 
                                            peer-checked:bg-red-600 group-hover:border-red-500 transition-colors duration-200">
                                            <div class="w-2 h-2 rounded-full bg-white m-1.5 transform scale-0 peer-checked:scale-100 
                                                transition-transform duration-200"></div>
                                        </div>
                                    </div>
                                    <span class="text-gray-700 group-hover:text-gray-900">Unavailable</span>
                                </label>
                            </div>

                            <!-- Comments -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                                <textarea v-model="availabilities[game.id].comments"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows="2" placeholder="Add any notes or comments here..."></textarea>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex justify-end">
                                <button @click="submitAvailability(game.id)" :disabled="isSubmitting[game.id]"
                                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                                    <svg v-if="isSubmitting[game.id]" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    {{ isSubmitting[game.id] ? 'Submitting...' : 'Submit Availability' }}
                                </button>
                            </div>

                            <!-- Success Message -->
                            <div v-if="submitSuccess[game.id]" class="mt-4">
                                <div class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0">
                                            <svg class="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm text-purple-700">Availability submitted successfully!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Error Message -->
                            <div v-if="submitErrors[game.id]" class="mt-4">
                                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0">
                                            <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm text-red-700">{{ submitErrors[game.id] }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Games Message -->
            <div v-else class="p-12 text-center">
                <div class="text-gray-500">
                    <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium">No upcoming games</h3>
                    <p class="mt-1 text-sm text-gray-500">There are no games scheduled at this time.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { gameService } from '@/services/gameService';
import { crewService } from '@/services/crewService';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = authStore.currentUser;

// Data
const games = ref([]);
const isLoadingGames = ref(false);
const loadError = ref(null);
const availabilities = reactive({});
const isSubmitting = reactive({});
const submitSuccess = reactive({});
const submitErrors = reactive({});

// Methods
async function fetchGames() {
    isLoadingGames.value = true;
    loadError.value = null;

    try {
        // First get all schedules
        console.log('Fetching game schedules...');
        const schedulesResponse = await gameService.getGameSchedules();
        console.log('Schedules response:', schedulesResponse);

        if (!schedulesResponse.data.flag || schedulesResponse.data.code !== 200) {
            loadError.value = schedulesResponse.data.message || 'Failed to load schedules';
            console.error('Failed to load schedules:', schedulesResponse.data);
            return;
        }

        const schedules = schedulesResponse.data.data || [];
        console.log('Found schedules:', schedules);
        games.value = [];

        // For each schedule, get its games
        for (const schedule of schedules) {
            console.log('Fetching games for schedule:', schedule.id);
            const gamesResponse = await gameService.getGamesForSchedule(schedule.id);
            console.log('Games response for schedule', schedule.id, ':', gamesResponse);

            if (gamesResponse.data.flag && gamesResponse.data.code === 200) {
                const scheduleGames = gamesResponse.data.data || [];
                console.log('Games for schedule:', schedule.id, scheduleGames);
                // Map the games to ensure we have the correct ID field
                const mappedGames = scheduleGames.map(game => ({
                    ...game,
                    id: game.gameId || game.id // Use gameId if available, fallback to id
                }));
                games.value = [...games.value, ...mappedGames];
            }
        }

        console.log('All games loaded:', games.value);

        // Initialize availabilities for each game
        games.value.forEach(game => {
            if (!game.id) {
                console.warn('Game missing ID:', game);
                return;
            }
            availabilities[game.id] = {
                available: null,
                comments: ''
            };
            isSubmitting[game.id] = false;
            submitSuccess[game.id] = false;
            submitErrors[game.id] = null;
        });
    } catch (err) {
        loadError.value = err.response?.data?.message || 'An error occurred while loading games';
        console.error('Games fetch error:', err);
    } finally {
        isLoadingGames.value = false;
    }
}

async function submitAvailability(gameId) {
    if (!gameId) {
        submitErrors[gameId] = 'Invalid game ID';
        return;
    }

    if (availabilities[gameId].available === null) {
        submitErrors[gameId] = 'Please select if you are available or not';
        return;
    }

    isSubmitting[gameId] = true;
    submitSuccess[gameId] = false;
    submitErrors[gameId] = null;

    try {
        // First fetch the full game details
        const gameResponse = await gameService.getGameDetails(gameId);
        if (!gameResponse.data.flag || gameResponse.data.code !== 200) {
            submitErrors[gameId] = 'Failed to fetch game details';
            return;
        }

        const gameDetails = gameResponse.data.data;
        console.log('Game details:', gameDetails);

        if (!gameDetails || !gameDetails.gameId) {
            submitErrors[gameId] = 'Invalid game details received';
            return;
        }

        const userId = authStore.currentUser?.userId;
        if (!userId) {
            submitErrors[gameId] = 'User ID not found. Please log in again.';
            return;
        }

        // Format the date as YYYY-MM-DD
        const gameDate = gameDetails.gameDate ? new Date(gameDetails.gameDate).toISOString().split('T')[0] : null;
        const currentTimestamp = new Date().toISOString();

        // Create availability object matching the expected backend format
        const availabilityData = {
            id: null, // Backend will generate this
            userId: userId,
            gameId: gameId,
            status: availabilities[gameId].available === 'true' ? 'AVAILABLE' : 'UNAVAILABLE',
            availability: availabilities[gameId].available === 'true',
            comment: availabilities[gameId].comments || '',
            submittedAt: currentTimestamp,
            lastModifiedAt: currentTimestamp,
            date: gameDate,
            notes: availabilities[gameId].comments || '',
            active: true,
            isActive: true
        };

        console.log('Submitting availability data:', availabilityData);

        const response = await crewService.submitAvailability(availabilityData);

        if (response.data.flag && response.data.code === 200) {
            submitSuccess[gameId] = true;
        } else {
            submitErrors[gameId] = response.data.message || 'Failed to submit availability';
        }
    } catch (err) {
        submitErrors[gameId] = err.response?.data?.message || 'An error occurred while submitting';
        console.error('Availability submission error:', err);
    } finally {
        isSubmitting[gameId] = false;
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${parseInt(hours) % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
}

// Lifecycle
onMounted(() => {
    fetchGames();
});
</script>