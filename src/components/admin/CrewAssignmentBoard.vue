<template>
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <div class="bg-white shadow-2xl rounded-xl overflow-hidden">
                <!-- Header Section -->
                <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
                    <div class="flex items-center justify-between">
                        <h3 class="text-2xl font-bold text-white">Crew Assignment Board</h3>
                        <div class="flex items-center space-x-2">
                            <span class="text-purple-100 text-sm">Admin Dashboard</span>
                        </div>
                    </div>
                </div>

                <div class="p-8">
                    <!-- Game selection -->
                    <div class="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            Select Game
                        </label>
                        <div class="relative">
                            <select v-model="selectedGameId"
                                class="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg transition duration-150 ease-in-out"
                                @change="loadGameDetails">
                                <option value="" class="text-gray-500">-- Select a game --</option>
                                <option v-for="game in games" :key="game.id" :value="game.id" class="py-2">
                                    {{ game.opponent }} - {{ formatDate(game.gameDate) }} at {{
                                        formatTime(game.gameStart) }}
                                </option>
                            </select>
                            <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Loading indicators -->
                    <div v-if="isLoadingGames" class="flex justify-center py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>

                    <div v-if="error" class="mb-8 bg-red-50 border-l-4 border-red-400 p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-red-700">{{ error }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Game Details -->
                    <div v-if="selectedGame"
                        class="mb-8 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div
                                class="bg-white p-6 rounded-lg shadow-sm transform hover:scale-105 transition duration-200">
                                <span class="text-gray-500 text-sm block mb-2">Opponent</span>
                                <span class="text-2xl font-bold text-purple-900">{{ selectedGame.opponent }}</span>
                            </div>
                            <div
                                class="bg-white p-6 rounded-lg shadow-sm transform hover:scale-105 transition duration-200">
                                <span class="text-gray-500 text-sm block mb-2">Date & Time</span>
                                <span class="text-2xl font-bold text-purple-900">{{ formatDate(selectedGame.gameDate) }}
                                    at {{ formatTime(selectedGame.gameStart) }}</span>
                            </div>
                            <div
                                class="bg-white p-6 rounded-lg shadow-sm transform hover:scale-105 transition duration-200">
                                <span class="text-gray-500 text-sm block mb-2">Venue</span>
                                <span class="text-2xl font-bold text-purple-900">{{ selectedGame.venue }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Assignment form -->
                    <div v-if="selectedGame && !isLoadingDetails" class="space-y-8">
                        <!-- Current Assignments -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                <h4 class="text-lg font-semibold text-gray-900">Current Crew Assignments</h4>
                            </div>

                            <div class="p-6">
                                <div v-if="crewAssignments.length === 0"
                                    class="text-center py-12 bg-gray-50 rounded-lg">
                                    <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p class="mt-4 text-gray-500">No crew members assigned yet</p>
                                </div>

                                <div v-else class="space-y-4">
                                    <div v-for="assignment in crewAssignments" :key="assignment.id"
                                        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-[1.02]">
                                        <div class="flex items-center space-x-4">
                                            <div class="flex-shrink-0">
                                                <div
                                                    class="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center shadow-sm">
                                                    <span class="text-purple-600 font-semibold text-lg">{{
                                                        assignment.userFirstName?.charAt(0) || '' }}{{
                                                            assignment.userLastName?.charAt(0) || '' }}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="font-medium text-gray-900 text-lg">{{
                                                    assignment.userFirstName || '' }} {{ assignment.userLastName || ''
                                                    }}</div>
                                                <div class="text-sm text-purple-600 font-medium">{{
                                                    assignment.positionName || '' }}</div>
                                                <div class="text-xs text-gray-500 flex items-center mt-1">
                                                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Report at: {{ formatTime(assignment.reportTime) || '' }}
                                                </div>
                                            </div>
                                        </div>
                                        <button @click="removeAssignment(assignment.id)"
                                            class="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-full hover:bg-red-50">
                                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Add New Assignment -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                <h4 class="text-lg font-semibold text-gray-900">Add New Assignment</h4>
                            </div>

                            <div class="p-6">
                                <form @submit.prevent="addAssignment" class="space-y-6">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                                Crew Member
                                            </label>
                                            <select v-model="newAssignment.userId"
                                                class="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg transition duration-150 ease-in-out"
                                                required>
                                                <option value="">-- Select crew member --</option>
                                                <option v-for="member in availableCrewMembers" :key="member.id"
                                                    :value="member.id">
                                                    {{ member.firstName }} {{ member.lastName }}
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                                Position
                                            </label>
                                            <select v-model="newAssignment.position.id"
                                                class="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg transition duration-150 ease-in-out"
                                                @change="updatePositionDetails" required>
                                                <option value="">-- Select position --</option>
                                                <option v-for="position in positions" :key="position.id"
                                                    :value="position.id">
                                                    {{ position.name }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Report Time
                                        </label>
                                        <input v-model="newAssignment.reportTime" type="time"
                                            class="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg transition duration-150 ease-in-out"
                                            required />
                                    </div>

                                    <div class="flex justify-end">
                                        <button type="submit"
                                            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                                            :disabled="isSubmitting">
                                            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                                fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                            {{ isSubmitting ? 'Adding...' : 'Add Assignment' }}
                                        </button>
                                    </div>
                                </form>

                                <!-- Success Message -->
                                <div v-if="successMessage" 
                                    class="mt-4 bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg">
                                    <div class="flex">
                                        <div class="flex-shrink-0">
                                            <svg class="h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="ml-3">
                                            <p class="text-sm text-purple-700">Assignment added successfully!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { gameService } from '@/services/gameService';
import { adminService } from '@/services/adminService';

// Data
const games = ref([]);
const selectedGameId = ref('');
const selectedGame = ref(null);
const crewAssignments = ref([]);
const availableCrewMembers = ref([]);
const crewMemberAvailabilities = ref({});
const positions = ref([
    { id: '1cd457da-159d-4d2c-8b13-508a11e82851', name: 'Director', displayName: 'Director', defaultPayRate: 100 },
    { id: 'f5a673d5-d23f-451f-8153-2fa58b2c6957', name: 'Camera Operator', displayName: 'Camera Operator', defaultPayRate: 75 },
    { id: '1b3ba2a8-dbab-4bab-b63e-e74f80c31240', name: 'Producer', displayName: 'Producer', defaultPayRate: 90 },
    { id: 'ec280bdb-ed8f-440d-a19a-88aad55b94f9', name: 'Asst Prod', displayName: 'Asst Prod', defaultPayRate: 70 },
    { id: '9c0fa01e-2c6c-4017-9819-a835675e2f55', name: 'Asst Director', displayName: 'Asst Director', defaultPayRate: 85 },
    { id: 'd2bced60-caee-4b4e-8afe-1f9b26e9e12a', name: 'Technical Dir', displayName: 'Technical Dir', defaultPayRate: 95 },
    { id: 'b512d95a-3b9f-477f-b528-cd06c53198e2', name: 'Graphics', displayName: 'Graphics', defaultPayRate: 80 },
    { id: '621c95a0-07f8-4633-9bb3-82c97685891a', name: 'Bug Op', displayName: 'Bug Op', defaultPayRate: 65 },
    { id: 'ad112fff-816b-4c1b-a20d-f660cacee6e8', name: 'Replay EVS', displayName: 'Replay EVS', defaultPayRate: 85 },
    { id: '09dae1ca-9894-4adf-b3fa-2c55114dcf6c', name: 'EIC', displayName: 'EIC', defaultPayRate: 90 },
    { id: '249b5b7f-2931-490f-885e-d149d7b10c31', name: 'Video', displayName: 'Video', defaultPayRate: 75 },
    { id: '92595b4d-f64f-46e7-8183-1d0ba48aa3bf', name: 'Audio', displayName: 'Audio', defaultPayRate: 75 },
    { id: 'bdd0ee77-0112-49de-b09d-26c8694eef8c', name: 'Utility', displayName: 'Utility', defaultPayRate: 60 },
    { id: '64906dc2-8646-4f3b-ba12-5a3bd8bc6394', name: 'Tech manager', displayName: 'Tech manager', defaultPayRate: 85 },
    { id: '95b08ad5-db5e-4e13-9566-95a3263dcc04', name: 'TOC', displayName: 'TOC', defaultPayRate: 70 },
    { id: '3f20cb70-0a54-422a-81da-33d1d6450a1c', name: 'Observer', displayName: 'Observer', defaultPayRate: 50 }
]);

const newAssignment = reactive({
    userId: '',
    position: {
        id: '',
        name: '',
        description: ''
    },
    reportTime: ''
});

const isLoadingGames = ref(false);
const isLoadingDetails = ref(false);
const isSubmitting = ref(false);
const error = ref(null);
const submitSuccess = ref(false);
const submitError = ref(null);

// Methods
async function fetchGames() {
    isLoadingGames.value = true;
    error.value = null;

    try {
        // First get all schedules
        const schedulesResponse = await gameService.getGameSchedules();
        if (!schedulesResponse.data.flag || schedulesResponse.data.code !== 200) {
            error.value = schedulesResponse.data.message || 'Failed to load schedules';
            return;
        }

        const schedules = schedulesResponse.data.data || [];
        games.value = [];

        // For each schedule, get its games
        for (const schedule of schedules) {
            const gamesResponse = await gameService.getGamesForSchedule(schedule.id);
            if (gamesResponse.data.flag && gamesResponse.data.code === 200) {
                const scheduleGames = gamesResponse.data.data || [];
                // Map the games to ensure we have the correct ID field
                const mappedGames = scheduleGames.map(game => ({
                    ...game,
                    id: game.gameId || game.id // Use gameId if available, fallback to id
                }));
                games.value = [...games.value, ...mappedGames];
            }
        }

        // Sort games by date
        games.value.sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));
    } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while loading games';
        console.error('Games fetch error:', err);
    } finally {
        isLoadingGames.value = false;
    }
}

async function fetchCrewMembers() {
    try {
        const response = await adminService.getAllCrewMembers();
        if (response.data.flag && response.data.code === 200) {
            availableCrewMembers.value = response.data.data;
            // Initialize availabilities for each crew member
            availableCrewMembers.value.forEach(member => {
                crewMemberAvailabilities.value[member.id] = null;
            });
        }
    } catch (err) {
        console.error('Crew members fetch error:', err);
    }
}

async function loadGameDetails() {
    if (!selectedGameId.value) {
        selectedGame.value = null;
        crewAssignments.value = [];
        return;
    }

    isLoadingDetails.value = true;
    error.value = null;

    try {
        selectedGame.value = games.value.find(game => game.id === selectedGameId.value);

        try {
            const response = await gameService.getGameCrewList(selectedGameId.value);
            if (response.data.flag && response.data.code === 200) {
                crewAssignments.value = response.data.data || [];
            }
        } catch (err) {
            console.error('Crew list fetch error:', err);
            crewAssignments.value = [];
        }

        // Load availability for each crew member
        for (const member of availableCrewMembers.value) {
            try {
                const availabilityResponse = await gameService.getUserAvailability(member.id);
                if (availabilityResponse.data.flag && availabilityResponse.data.code === 200) {
                    const availabilities = availabilityResponse.data.data || [];
                    // Find availability for the selected game date
                    const gameDate = selectedGame.value.gameDate.split('T')[0];
                    const gameAvailability = availabilities.find(avail => avail.date === gameDate);
                    crewMemberAvailabilities.value[member.id] = gameAvailability || null;
                }
            } catch (err) {
                console.error(`Error loading availability for member ${member.id}:`, err);
                crewMemberAvailabilities.value[member.id] = null;
            }
        }
    } catch (err) {
        error.value = 'Failed to load game details';
        console.error('Game details error:', err);
    } finally {
        isLoadingDetails.value = false;
    }
}

function updatePositionDetails() {
    const selectedPosition = positions.value.find(p => p.id === newAssignment.position.id);
    if (selectedPosition) {
        newAssignment.position.name = selectedPosition.name;
        newAssignment.position.description = selectedPosition.description || '';
        console.log('Updated position details:', newAssignment.position);
    } else {
        console.warn('Position not found for ID:', newAssignment.position.id);
    }
}

async function addAssignment() {
    if (!selectedGameId.value || !newAssignment.userId || !newAssignment.position.id || !newAssignment.reportTime) {
        submitError.value = 'Please fill out all fields';
        return;
    }

    isSubmitting.value = true;
    submitSuccess.value = false;
    submitError.value = null;

    try {
        const selectedPosition = positions.value.find(p => p.id === newAssignment.position.id);
        if (!selectedPosition) {
            submitError.value = 'Invalid position selected';
            return;
        }

        // Log the data being sent
        console.log('Sending assignment data:', {
            gameId: selectedGameId.value,
            userId: newAssignment.userId,
            position: {
                id: newAssignment.position.id,
                name: newAssignment.position.name,
                description: newAssignment.position.description,
                defaultPayRate: selectedPosition.defaultPayRate || 0
            },
            reportTime: newAssignment.reportTime,
            payRate: selectedPosition.defaultPayRate || 0
        });

        const response = await gameService.scheduleCrewForGame(selectedGameId.value, {
            userId: newAssignment.userId,
            position: {
                id: newAssignment.position.id,
                name: newAssignment.position.name,
                description: newAssignment.position.description,
                defaultPayRate: selectedPosition.defaultPayRate || 0
            },
            reportTime: newAssignment.reportTime,
            payRate: selectedPosition.defaultPayRate || 0
        });

        console.log('Assignment response:', response.data);

        if (response.data.flag && response.data.code === 200) {
            // Get the crew member details from availableCrewMembers
            const crewMember = availableCrewMembers.value.find(member => member.id === newAssignment.userId);
            console.log('Found crew member:', crewMember);

            // Add the new assignment to the list
            const newCrewAssignment = {
                id: response.data.data.id,
                userId: response.data.data.userId,
                userFirstName: crewMember?.firstName || '',
                userLastName: crewMember?.lastName || '',
                positionName: response.data.data.position?.name || response.data.data.positionName,
                reportTime: response.data.data.reportTime
            };

            console.log('New crew assignment:', newCrewAssignment);
            crewAssignments.value = [...crewAssignments.value, newCrewAssignment];

            // Reset form
            newAssignment.userId = '';
            newAssignment.position.id = '';
            newAssignment.position.name = '';
            newAssignment.position.description = '';
            newAssignment.reportTime = '';

            submitSuccess.value = true;
            setTimeout(() => {
                submitSuccess.value = false;
            }, 3000);
        } else {
            submitError.value = response.data.message || 'Failed to add assignment';
            console.error('Assignment failed:', response.data);
        }
    } catch (err) {
        submitError.value = err.response?.data?.message || 'An error occurred while adding the assignment';
        console.error('Assignment error:', err);
        if (err.response) {
            console.error('Error response:', err.response.data);
        }
    } finally {
        isSubmitting.value = false;
    }
}

async function removeAssignment(assignmentId) {
    try {
        await gameService.removeCrewAssignment(selectedGameId.value, assignmentId);
        crewAssignments.value = crewAssignments.value.filter(a => a.id !== assignmentId);
    } catch (err) {
        console.error('Failed to remove assignment:', err);
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
    fetchCrewMembers();
});

// Watch for changes
watch(selectedGameId, loadGameDetails);
</script>