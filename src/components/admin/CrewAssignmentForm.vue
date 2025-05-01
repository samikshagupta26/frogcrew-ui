<template>
    <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-slate-50 to-slate-100 px-5 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Schedule Crew for Game</h2>
            <p class="text-sm text-gray-500 mt-1">Assign crew members to this game</p>
        </div>

        <div class="p-5">
            <form @submit.prevent="assignCrew" class="space-y-4">
                <div>
                    <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">Crew Member</label>
                    <div class="relative">
                        <select id="userId" v-model="formData.userId"
                            class="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            required>
                            <option value="" disabled>Select a crew member</option>
                            <option v-for="member in crewMembers" :key="member.id" :value="member.id">
                                {{ member.firstName }} {{ member.lastName }}
                            </option>
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label for="positionId" class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <div class="relative">
                        <select id="positionId" v-model="formData.position.id"
                            class="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            required @change="updatePositionDetails">
                            <option value="" disabled>Select a position</option>
                            <option v-for="position in positions" :key="position.id" :value="position.id">
                                {{ position.name }}
                            </option>
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label for="reportTime" class="block text-sm font-medium text-gray-700 mb-1">Report Time</label>
                    <input type="time" id="reportTime" v-model="formData.reportTime"
                        class="block w-full pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required />
                </div>

                <div class="pt-2">
                    <button type="submit"
                        class="w-full flex justify-center items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                        :disabled="loading">
                        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ loading ? 'Assigning...' : 'Assign Crew Member' }}
                    </button>
                </div>
            </form>

            <div v-if="message" class="mt-4 p-3 rounded-md border-l-4"
                :class="success ? 'bg-purple-50 text-purple-700 border-purple-400' : 'bg-red-50 text-red-700 border-red-400'">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gameService } from '@/services/gameService';
import { adminService } from '@/services/adminService';

const props = defineProps({
    gameId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['crew-assigned']);

const formData = ref({
    userId: '',
    position: {
        id: '',
        name: '',
        description: '',
        defaultPayRate: 0
    },
    reportTime: ''
});

const crewMembers = ref([]);
const positions = ref([]);

const loading = ref(false);
const message = ref('');
const success = ref(false);

// Load available crew members and positions
const loadData = async () => {
    try {
        // Load crew members
        const crewResponse = await adminService.getAllCrewMembers();
        console.log('Crew members response:', crewResponse);

        if (crewResponse && crewResponse.data && crewResponse.data.data) {
            crewMembers.value = crewResponse.data.data.map(member => ({
                id: member.id || member.userId,
                firstName: member.firstName,
                lastName: member.lastName,
                email: member.email
            }));
            console.log('Mapped crew members:', crewMembers.value);
        } else {
            console.warn('Unexpected crew members response structure:', crewResponse);
            crewMembers.value = [];
        }

        // Load positions
        const positionsResponse = await adminService.getPositions();
        console.log('Positions response:', positionsResponse);

        if (positionsResponse && positionsResponse.data && positionsResponse.data.data) {
            positions.value = positionsResponse.data.data.map(position => ({
                id: position.id,
                name: position.name,
                displayName: position.displayName || position.name,
                description: position.description || '',
                defaultPayRate: position.defaultPayRate || 0
            }));
            console.log('Mapped positions:', positions.value);
        } else {
            console.warn('Unexpected positions response structure:', positionsResponse);
            positions.value = [];
        }
    } catch (error) {
        console.error('Error loading data:', error);
        message.value = 'Failed to load required data';
        success.value = false;
    }
};

onMounted(() => {
    loadData();
});

const updatePositionDetails = () => {
    const selectedPosition = positions.value.find(p => p.id === formData.value.position.id);
    if (selectedPosition) {
        formData.value.position.name = selectedPosition.displayName || selectedPosition.name;
        formData.value.position.description = selectedPosition.description;
        formData.value.position.defaultPayRate = selectedPosition.defaultPayRate || 0;
    }
};

const assignCrew = async () => {
    loading.value = true;
    message.value = '';

    // Validate that gameId is valid
    if (!props.gameId) {
        success.value = false;
        message.value = 'Invalid game selected. Please try again.';
        loading.value = false;
        return;
    }

    try {
        // Get the selected crew member details
        const selectedCrewMember = crewMembers.value.find(member => member.id === formData.value.userId);
        const selectedPosition = positions.value.find(position => position.id === formData.value.position.id);

        console.log('Selected crew member:', selectedCrewMember);
        console.log('Selected position:', selectedPosition);

        if (!selectedCrewMember || !selectedPosition) {
            throw new Error('Please select both a crew member and a position');
        }

        const requestData = {
            userId: formData.value.userId,
            position: {
                id: formData.value.position.id,
                code: formData.value.position.name,
                displayName: formData.value.position.name,
                defaultPayRate: formData.value.position.defaultPayRate,
                description: formData.value.position.description,
                requiredQualifications: [],
                active: true
            },
            reportTime: formData.value.reportTime // Send as LocalTime string (HH:mm)
        };

        console.log('Sending request data:', requestData);

        const response = await gameService.scheduleCrewForGame(props.gameId, requestData);
        console.log('API Response:', response.data);

        success.value = true;
        message.value = 'Crew member assigned successfully!';

        // Prepare the assignment data with crew member details
        const assignmentData = {
            id: response.data.data.id,
            userId: selectedCrewMember.id,
            firstName: selectedCrewMember.firstName,
            lastName: selectedCrewMember.lastName,
            position: {
                id: selectedPosition.id,
                name: selectedPosition.name,
                displayName: selectedPosition.displayName,
                defaultPayRate: selectedPosition.defaultPayRate,
                description: selectedPosition.description
            },
            reportTime: formData.value.reportTime,
            status: 'ASSIGNED'
        };

        console.log('Emitting assignment data:', assignmentData);

        // Reset form
        formData.value = {
            userId: '',
            position: {
                id: '',
                name: '',
                description: '',
                defaultPayRate: 0
            },
            reportTime: ''
        };

        // Emit event to notify parent component with complete assignment data
        emit('crew-assigned', assignmentData);
    } catch (error) {
        console.error('Error assigning crew:', error);
        success.value = false;
        message.value = error.response?.data?.message || error.message || 'Failed to assign crew member';
    } finally {
        loading.value = false;
    }
};
</script>