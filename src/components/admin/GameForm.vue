<template>
    <div class="space-y-4">
        <!-- Add New Game Form -->
        <form @submit.prevent="addGame" class="space-y-4">
            <!-- Schedule Selection (if not pre-selected) -->
            <div v-if="!preSelectedScheduleId" class="mb-4">
                <label for="scheduleId" class="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <div class="relative">
                    <select id="scheduleId" v-model="formData.scheduleId"
                        @change="updateScheduleFields(formData.scheduleId)"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 appearance-none pr-10"
                        required>
                        <option value="" disabled>Select a schedule</option>
                        <option v-for="schedule in schedules" :key="schedule.id" :value="schedule.id">
                            {{ schedule.sport }} - {{ schedule.season }}
                        </option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Game Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Sport and Season (if not pre-selected) -->
                <template v-if="!preSelectedScheduleId">
                    <div>
                        <label for="sport" class="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input type="text" id="sport" v-model="formData.sport"
                                class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                required />
                        </div>
                    </div>
                    <div>
                        <label for="season" class="block text-sm font-medium text-gray-700 mb-1">Season</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input type="text" id="season" v-model="formData.season"
                                class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                required />
                        </div>
                    </div>
                </template>

                <!-- Date and Time -->
                <div>
                    <label for="gameDate" class="block text-sm font-medium text-gray-700 mb-1">Game Date</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input type="date" id="gameDate" v-model="formData.gameDate"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            required />
                    </div>
                </div>
                <div>
                    <label for="gameStart" class="block text-sm font-medium text-gray-700 mb-1">Game Start Time</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <input type="time" id="gameStart" v-model="formData.gameStart"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            required />
                    </div>
                </div>

                <!-- Opponent and Venue -->
                <div>
                    <label for="opponent" class="block text-sm font-medium text-gray-700 mb-1">Opponent</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <input type="text" id="opponent" v-model="formData.opponent"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            required />
                    </div>
                </div>
                <div>
                    <label for="venue" class="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <input type="text" id="venue" v-model="formData.venue"
                            class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            required />
                    </div>
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4">
                <button type="submit"
                    class="px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors flex items-center space-x-2"
                    :disabled="loading">
                    <span>{{ loading ? 'Adding...' : 'Add Game' }}</span>
                    <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>
        </form>

        <!-- Success/Error Message -->
        <div v-if="message" class="mt-4 p-4 rounded-md flex items-start space-x-3"
            :class="success ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'">
            <svg v-if="success" class="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ message }}</span>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { gameService } from '@/services/gameService';

export default {
    name: 'GameForm',

    props: {
        preSelectedScheduleId: {
            type: String,
            default: ''
        }
    },

    setup(props, { emit }) {
        const formData = ref({
            scheduleId: props.preSelectedScheduleId,
            sport: '',
            season: '',
            gameDate: '',
            gameStart: '',
            opponent: '',
            venue: '',
            gameType: 'Regular'
        });

        const schedules = ref([]);
        const loading = ref(false);
        const message = ref('');
        const success = ref(false);

        // Load available schedules
        const loadSchedules = async () => {
            try {
                const response = await gameService.getGameSchedules();
                schedules.value = response.data.data || [];

                // If a schedule is selected, auto-fill sport and season
                if (formData.value.scheduleId) {
                    const selectedSchedule = schedules.value.find(s => s.id === formData.value.scheduleId);
                    if (selectedSchedule) {
                        formData.value.sport = selectedSchedule.sport;
                        formData.value.season = selectedSchedule.season;
                    }
                }
            } catch (error) {
                console.error('Error loading schedules:', error);
            }
        };

        // Auto-fill sport and season when schedule changes
        const updateScheduleFields = (scheduleId) => {
            if (scheduleId && schedules.value.length > 0) {
                const selectedSchedule = schedules.value.find(s => s.id === scheduleId);
                if (selectedSchedule) {
                    formData.value.sport = selectedSchedule.sport;
                    formData.value.season = selectedSchedule.season;
                }
            }
        };

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        onMounted(() => {
            loadSchedules();
        });

        const addGame = async () => {
            loading.value = true;
            message.value = '';

            try {
                const gameData = { ...formData.value };

                // Format eventDateTime properly
                if (gameData.gameDate && gameData.gameStart) {
                    const dateObj = new Date(`${gameData.gameDate}T${gameData.gameStart}:00`);
                    gameData.eventDateTime = dateObj.toISOString();
                }

                // Build full correct request for backend
                const gameRequest = {
                    sport: gameData.sport,
                    opponent: gameData.opponent,
                    season: gameData.season,
                    eventDateTime: gameData.eventDateTime,
                    venue: gameData.venue,
                    gameType: gameData.gameType,
                    scheduleId: gameData.scheduleId
                };

                const response = await gameService.addGame(gameRequest);

                console.log('Game added:', response.data);
                success.value = true;
                message.value = 'Game added successfully!';

                // Reset form but keep the selected schedule, sport and season
                const currentScheduleId = formData.value.scheduleId;
                const currentSport = formData.value.sport;
                const currentSeason = formData.value.season;

                formData.value = {
                    scheduleId: currentScheduleId,
                    sport: currentSport,
                    season: currentSeason,
                    gameDate: '',
                    gameStart: '',
                    opponent: '',
                    venue: '',
                    gameType: 'Regular'
                };

                let gameToEmit = response.data.data || response.data;
                if (!gameToEmit.gameDate && gameToEmit.eventDateTime) {
                    const eventDate = new Date(gameToEmit.eventDateTime);
                    gameToEmit.gameDate = eventDate.toISOString().split('T')[0];
                    gameToEmit.gameStart = eventDate.toTimeString().substring(0, 5);
                }

                emit('game-added', gameToEmit);

            } catch (error) {
                console.error('Error adding game:', error);
                success.value = false;
                message.value = error.response?.data?.message || 'Failed to add game';
            } finally {
                loading.value = false;
            }
        };

        return {
            formData,
            schedules,
            loading,
            message,
            success,
            addGame,
            updateScheduleFields,
            formatDate
        };
    },

    emits: ['game-added']
};
</script>