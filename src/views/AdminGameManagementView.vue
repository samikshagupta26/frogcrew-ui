<template>
    <div class="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Section -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Game Management</h1>
                <p class="mt-2 text-gray-600">Manage game schedules and crew assignments</p>
            </div>

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Panel - Game Schedules -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h2 class="text-xl font-semibold text-gray-900">Game Schedules</h2>
                                <p class="text-sm text-gray-500 mt-1">Create and manage game schedules</p>
                            </div>
                            <button @click="showScheduleForm = true"
                                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4v16m8-8H4" />
                                </svg>
                                <span>New Schedule</span>
                            </button>
                        </div>

                        <!-- Schedule List -->
                        <div class="space-y-4">
                            <div v-if="loadingSchedules" class="flex justify-center py-8">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                            <div v-else-if="schedules.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
                                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p class="mt-2 text-gray-500">No schedules created yet</p>
                            </div>
                            <div v-else class="space-y-3">
                                <div v-for="schedule in schedules" :key="schedule.id" @click="selectSchedule(schedule)"
                                    class="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all group"
                                    :class="{ 'border-indigo-500 bg-indigo-50': selectedSchedule?.id === schedule.id }">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <h3 class="font-medium text-gray-900 group-hover:text-indigo-600">{{
                                                schedule.sport }}</h3>
                                            <p class="text-sm text-gray-500">{{ schedule.season }}</p>
                                        </div>
                                        <span class="px-3 py-1 text-xs font-medium rounded-full" :class="{
                                            'bg-purple-100 text-purple-800': schedule.status === 'PUBLISHED',
                                            'bg-yellow-100 text-yellow-800': schedule.status === 'DRAFT',
                                            'bg-gray-100 text-gray-800': schedule.status === 'ARCHIVED'
                                        }">
                                            {{ schedule.status }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Panel - Game Management -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h2 class="text-xl font-semibold text-gray-900">Games</h2>
                                <p class="text-sm text-gray-500 mt-1">Manage games and crew assignments</p>
                            </div>
                            <button v-if="selectedSchedule" @click="showGameForm = true"
                                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Add Game</span>
                            </button>
                        </div>

                        <!-- Selected Schedule Info -->
                        <div v-if="selectedSchedule" class="mb-6 p-4 bg-indigo-50 rounded-lg">
                            <h3 class="font-medium text-indigo-900">{{ selectedSchedule.sport }} - {{
                                selectedSchedule.season }}</h3>
                            <p class="text-sm text-indigo-700">Manage games for this schedule</p>
                        </div>

                        <!-- Games List -->
                        <div class="space-y-4">
                            <div v-if="loadingGames" class="flex justify-center py-8">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                            <div v-else-if="!selectedSchedule" class="text-center py-8 bg-gray-50 rounded-lg">
                                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="mt-2 text-gray-500">Select a schedule to view games</p>
                            </div>
                            <div v-else-if="gamesInSchedule.length === 0"
                                class="text-center py-8 bg-gray-50 rounded-lg">
                                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p class="mt-2 text-gray-500">No games added to this schedule yet</p>
                            </div>
                            <div v-else class="space-y-3">
                                <div v-for="game in gamesInSchedule" :key="game.id" @click="selectGame(game)"
                                    class="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all group">
                                    <div class="flex items-center justify-between">
                                        <div class="space-y-1">
                                            <h3 class="font-medium text-gray-900 group-hover:text-indigo-600">TCU vs {{
                                                game.opponent }}</h3>
                                            <div class="flex items-center space-x-4 text-sm text-gray-500">
                                                <div class="flex items-center">
                                                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{{ formatDate(game.gameDate) }}</span>
                                                </div>
                                                <div class="flex items-center">
                                                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{{ formatTime(game.gameStart) }}</span>
                                                </div>
                                                <div class="flex items-center">
                                                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{{ game.venue }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button @click="selectGame(game)"
                                            class="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                                            Manage Crew
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Schedule Form Modal -->
        <div v-if="showScheduleForm"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl w-full max-w-lg relative">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Create New Schedule</h3>
                        <button @click="showScheduleForm = false" class="text-gray-400 hover:text-gray-500">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <GameScheduleForm @schedule-created="onScheduleCreated" @close="showScheduleForm = false" />
                </div>
            </div>
        </div>

        <!-- Game Form Modal -->
        <div v-if="showGameForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl w-full max-w-lg relative">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Add New Game</h3>
                        <button @click="showGameForm = false" class="text-gray-400 hover:text-gray-500">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <GameForm :preSelectedScheduleId="selectedSchedule?.id" @game-added="onGameAdded"
                        @close="showGameForm = false" />
                </div>
            </div>
        </div>

        <!-- Crew Assignment Modal -->
        <div v-if="showCrewAssignmentModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Assign Crew for Game</h3>
                        <button @click="showCrewAssignmentModal = false" class="text-gray-400 hover:text-gray-500">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="mb-6 p-4 bg-indigo-50 rounded-lg">
                        <h4 class="font-medium text-indigo-900">{{ selectedGame?.opponent }}</h4>
                        <div class="mt-2 space-y-1 text-sm text-indigo-700">
                            <p>{{ selectedGame ? formatDate(selectedGame.gameDate) : '' }} at {{ selectedGame ?
                                formatTime(selectedGame.gameStart) : '' }}</p>
                            <p>{{ selectedGame?.venue }}</p>
                        </div>
                    </div>

                    <CrewAssignmentForm v-if="selectedGame && selectedGame.id" :gameId="selectedGame.id"
                        @crew-assigned="onCrewAssigned" />

                    <div class="mt-6">
                        <h4 class="font-medium mb-3">Assigned Crew Members</h4>
                        <div v-if="loadingCrew" class="flex justify-center py-4">
                            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        </div>
                        <div v-else-if="crewAssignments.length === 0" class="text-center py-4 bg-gray-50 rounded-lg">
                            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p class="mt-2 text-gray-500">No crew members assigned yet</p>
                        </div>
                        <div v-else class="space-y-3">
                            <div v-for="assignment in crewAssignments" :key="assignment.id"
                                class="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="font-medium">{{ assignment.firstName }} {{ assignment.lastName }}</p>
                                        <p class="text-sm text-gray-600">{{ assignment.position.name }}</p>
                                    </div>
                                    <p class="text-xs text-gray-500">Report time: {{ formatTime(assignment.reportTime)
                                        }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { gameService } from '@/services/gameService';
import GameScheduleForm from '@/components/admin/GameScheduleForm.vue';
import GameForm from '@/components/admin/GameForm.vue';
import CrewAssignmentForm from '@/components/admin/CrewAssignmentForm.vue';
import AdminNavbar from '@/components/admin/AdminNavbar.vue';
import { adminService } from '@/services/adminService';

export default {
    name: 'AdminGameManagementView',

    components: {
        GameScheduleForm,
        GameForm,
        CrewAssignmentForm,
        AdminNavbar
    },

    setup() {
        const schedules = ref([]);
        const loadingSchedules = ref(false);
        const selectedSchedule = ref(null);
        const showScheduleForm = ref(false);
        const showGameForm = ref(false);

        const gamesInSchedule = ref([]);
        const loadingGames = ref(false);
        const selectedGame = ref(null);

        const showCrewAssignmentModal = ref(false);
        const crewAssignments = ref([]);
        const loadingCrew = ref(false);

        const crewMembers = ref([]);

        const loadSchedules = async () => {
            loadingSchedules.value = true;
            try {
                console.log('Loading schedules...');
                const response = await gameService.getGameSchedules();
                console.log('Schedules response:', response);

                if (response && response.data && response.data.data) {
                    // Handle both array and single object responses
                    const schedulesData = Array.isArray(response.data.data)
                        ? response.data.data
                        : [response.data.data];

                    schedules.value = schedulesData.map(schedule => ({
                        id: schedule.id,
                        sport: schedule.sport,
                        season: schedule.season,
                        status: schedule.status
                    }));

                    console.log('Mapped schedules:', schedules.value);
                } else {
                    console.warn('Unexpected response structure:', response);
                    schedules.value = [];
                }
            } catch (error) {
                console.error('Error loading schedules:', error);
                schedules.value = [];
            } finally {
                loadingSchedules.value = false;
            }
        };

        const loadGamesForSchedule = async (scheduleId) => {
            if (!scheduleId) return;

            loadingGames.value = true;
            try {
                console.log('Loading games for schedule:', scheduleId);
                const response = await gameService.getGamesForSchedule(scheduleId);
                console.log('Games response:', response);

                if (response && response.data && response.data.data) {
                    // Map the games to ensure we have the correct structure
                    gamesInSchedule.value = response.data.data.map(game => ({
                        id: game.gameId || game.id,
                        scheduleId: game.scheduleId,
                        gameDate: game.gameDate || game.eventDateTime?.split('T')[0],
                        venue: game.venue || 'TBD',
                        opponent: game.opponent || 'TBD',
                        gameStart: game.gameStart || game.eventDateTime?.split('T')[1]?.substring(0, 5),
                        finalized: game.finalized || false,
                        gameType: game.gameType || 'Regular'
                    }));

                    console.log('Mapped games:', gamesInSchedule.value);
                } else {
                    console.warn('Unexpected response structure:', response);
                    gamesInSchedule.value = [];
                }
            } catch (error) {
                console.error('Error loading games:', error);
                gamesInSchedule.value = [];
            } finally {
                loadingGames.value = false;
            }
        };

        const loadCrewForGame = async (gameId) => {
            if (!gameId) return;

            loadingCrew.value = true;
            try {
                const response = await gameService.getGameCrewList(gameId);
                console.log('Raw API Response:', response);

                if (response && response.data && response.data.data) {
                    // Map the crew assignments to include all necessary fields
                    crewAssignments.value = response.data.data.map(assignment => {
                        console.log('Raw assignment data:', assignment);

                        // Extract user data
                        const userData = assignment.user || {};
                        const firstName = userData.firstName || assignment.userFirstName || '';
                        const lastName = userData.lastName || assignment.userLastName || '';

                        // Extract position data
                        const positionData = assignment.position || {};
                        const positionName = positionData.name || positionData.displayName || assignment.positionName || '';

                        const mappedAssignment = {
                            id: assignment.id,
                            userId: assignment.userId,
                            firstName: firstName,
                            lastName: lastName,
                            position: {
                                id: positionData.id,
                                name: positionName,
                                displayName: positionName,
                                defaultPayRate: positionData.defaultPayRate || 0,
                                description: positionData.description || ''
                            },
                            reportTime: assignment.reportTime,
                            status: assignment.status || 'ASSIGNED'
                        };

                        console.log('Mapped assignment:', mappedAssignment);
                        return mappedAssignment;
                    });

                    console.log('Final crew assignments:', crewAssignments.value);
                } else {
                    console.warn('Unexpected response structure:', response);
                    crewAssignments.value = [];
                }
            } catch (error) {
                console.error('Error loading crew assignments:', error);
                crewAssignments.value = [];
            } finally {
                loadingCrew.value = false;
            }
        };

        const selectSchedule = (schedule) => {
            selectedSchedule.value = schedule;
            loadGamesForSchedule(schedule.id);
            selectedGame.value = null;
        };

        const selectGame = (game) => {
            selectedGame.value = game;
            showCrewAssignmentModal.value = true;
            loadCrewForGame(game.id);
        };

        const onScheduleCreated = (newSchedule) => {
            schedules.value.push(newSchedule);
            selectSchedule(newSchedule);
            showScheduleForm.value = false;
        };

        const onGameAdded = (newGame) => {
            if (selectedSchedule.value && selectedSchedule.value.id) {
                loadGamesForSchedule(selectedSchedule.value.id);
            } else {
                gamesInSchedule.value.push(newGame);
            }
            showGameForm.value = false;
        };

        const onCrewAssigned = (assignment) => {
            console.log('Received crew assignment:', assignment);

            // Get the selected crew member from the form
            const selectedCrewMember = crewMembers.value.find(member => member.id === assignment.userId);
            console.log('Selected crew member:', selectedCrewMember);

            // Create a new crew member object with the complete data
            const crewMember = {
                id: assignment.id,
                userId: assignment.userId,
                firstName: selectedCrewMember?.firstName || '',
                lastName: selectedCrewMember?.lastName || '',
                position: {
                    id: assignment.position.id,
                    name: assignment.position.name || assignment.position.displayName || '',
                    displayName: assignment.position.displayName || assignment.position.name || '',
                    defaultPayRate: assignment.position.defaultPayRate || 0,
                    description: assignment.position.description || ''
                },
                reportTime: assignment.reportTime,
                status: assignment.status || 'ASSIGNED'
            };

            console.log('Created crew member object:', crewMember);

            // Add the new crew member to the list
            crewAssignments.value.push(crewMember);

            // Reload the crew list to ensure we have the latest data
            loadCrewForGame(selectedGame.value.id);
        };

        const formatDate = (dateString) => {
            if (!dateString) return 'Invalid Date';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return 'Invalid Date';
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return date.toLocaleDateString(undefined, options);
            } catch (error) {
                console.error('Error formatting date:', error);
                return 'Invalid Date';
            }
        };

        const formatTime = (timeString) => {
            if (!timeString) return 'Invalid Time';
            try {
                // Handle both HH:mm and HH:mm:ss formats
                const [hours, minutes] = timeString.split(':');
                const date = new Date();
                date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
                const options = { hour: 'numeric', minute: '2-digit', hour12: true };
                return date.toLocaleTimeString(undefined, options);
            } catch (error) {
                console.error('Error formatting time:', error);
                return 'Invalid Time';
            }
        };

        const loadCrewMembers = async () => {
            try {
                const response = await adminService.getAllCrewMembers();
                if (response && response.data && response.data.data) {
                    crewMembers.value = response.data.data.map(member => ({
                        id: member.id,
                        firstName: member.firstName,
                        lastName: member.lastName,
                        email: member.email
                    }));
                    console.log('Loaded crew members:', crewMembers.value);
                }
            } catch (error) {
                console.error('Error loading crew members:', error);
            }
        };

        onMounted(() => {
            loadSchedules();
            loadCrewMembers();
        });

        return {
            schedules,
            loadingSchedules,
            selectedSchedule,
            showScheduleForm,
            showGameForm,
            gamesInSchedule,
            loadingGames,
            selectedGame,
            showCrewAssignmentModal,
            crewAssignments,
            loadingCrew,
            crewMembers,
            selectSchedule,
            selectGame,
            onScheduleCreated,
            onGameAdded,
            onCrewAssigned,
            formatDate,
            formatTime
        };
    }
};
</script>