<template>
    <div class="space-y-4">
        <!-- Add New Game Form -->
        <form @submit.prevent="addGame" class="space-y-4">
            <!-- Schedule Selection (if not pre-selected) -->
            <div v-if="!preSelectedScheduleId" class="mb-4">
                <label for="scheduleId" class="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <select id="scheduleId" v-model="formData.scheduleId"
                    @change="updateScheduleFields(formData.scheduleId)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required>
                    <option value="" disabled>Select a schedule</option>
                    <option v-for="schedule in schedules" :key="schedule.id" :value="schedule.id">
                        {{ schedule.sport }} - {{ schedule.season }}
                    </option>
                </select>
            </div>

            <!-- Game Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Sport and Season (if not pre-selected) -->
                <template v-if="!preSelectedScheduleId">
                    <div>
                        <label for="sport" class="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                        <input type="text" id="sport" v-model="formData.sport"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required />
                    </div>
                    <div>
                        <label for="season" class="block text-sm font-medium text-gray-700 mb-1">Season</label>
                        <input type="text" id="season" v-model="formData.season"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required />
                    </div>
                </template>

                <!-- Date and Time -->
                <div>
                    <label for="gameDate" class="block text-sm font-medium text-gray-700 mb-1">Game Date</label>
                    <input type="date" id="gameDate" v-model="formData.gameDate"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required />
                </div>
                <div>
                    <label for="gameStart" class="block text-sm font-medium text-gray-700 mb-1">Game Start Time</label>
                    <input type="time" id="gameStart" v-model="formData.gameStart"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required />
                </div>

                <!-- Opponent and Venue -->
                <div>
                    <label for="opponent" class="block text-sm font-medium text-gray-700 mb-1">Opponent</label>
                    <input type="text" id="opponent" v-model="formData.opponent"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required />
                </div>
                <div>
                    <label for="venue" class="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <input type="text" id="venue" v-model="formData.venue"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required />
                </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4">
                <button type="submit"
                    class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    :disabled="loading">
                    {{ loading ? 'Adding...' : 'Add Game' }}
                </button>
            </div>
        </form>

        <!-- Success/Error Message -->
        <div v-if="message" class="mt-4 p-3 rounded-md"
            :class="success ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'">
            {{ message }}
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