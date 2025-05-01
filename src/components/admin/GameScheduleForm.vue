<template>
    <div class="space-y-4">
        <form @submit.prevent="createSchedule" class="space-y-4">
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Schedule Name</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <input type="text" id="name" v-model="formData.name"
                        class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        required placeholder="Fall 2023 Schedule" />
                </div>
            </div>

            <div class="mb-4">
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
                        required placeholder="Basketball" />
                </div>
            </div>

            <div class="mb-4">
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
                        required placeholder="Fall 2023" />
                </div>
            </div>

            <div class="mb-6">
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div class="relative">
                    <select id="status" v-model="formData.status"
                        class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 appearance-none pr-10"
                        required>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="flex justify-end pt-4">
                <button type="submit"
                    class="px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors flex items-center space-x-2"
                    :disabled="loading">
                    <span>{{ loading ? 'Creating...' : 'Create Schedule' }}</span>
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
import { ref, defineEmits } from 'vue';
import { gameService } from '@/services/gameService';

export default {
    name: 'GameScheduleForm',

    setup(props, { emit }) {
        const formData = ref({
            name: '',
            sport: '',
            season: '',
            status: 'DRAFT'
        });

        const loading = ref(false);
        const message = ref('');
        const success = ref(false);

        const createSchedule = async () => {
            loading.value = true;
            message.value = '';

            try {
                const response = await gameService.createGameSchedule(formData.value);
                console.log('Schedule created:', response.data);

                success.value = true;
                message.value = 'Game schedule created successfully!';

                // Reset form
                formData.value = {
                    name: '',
                    sport: '',
                    season: '',
                    status: 'DRAFT'
                };

                // Emit event to notify parent component
                emit('schedule-created', response.data.data);
            } catch (error) {
                console.error('Error creating schedule:', error);
                success.value = false;
                message.value = error.response?.data?.message || 'Failed to create game schedule';
            } finally {
                loading.value = false;
            }
        };

        return {
            formData,
            loading,
            message,
            success,
            createSchedule
        };
    },

    emits: ['schedule-created']
};
</script>