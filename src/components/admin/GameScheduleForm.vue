<template>
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Create Game Schedule</h2>

        <form @submit.prevent="createSchedule">
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" id="name" v-model="formData.name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required />
            </div>

            <div class="mb-4">
                <label for="sport" class="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                <input type="text" id="sport" v-model="formData.sport"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required />
            </div>

            <div class="mb-4">
                <label for="season" class="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <input type="text" id="season" v-model="formData.season"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required />
            </div>

            <div class="mb-6">
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select id="status" v-model="formData.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
            </div>

            <div class="flex justify-end">
                <button type="submit"
                    class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    :disabled="loading">
                    {{ loading ? 'Creating...' : 'Create Schedule' }}
                </button>
            </div>
        </form>

        <div v-if="message" class="mt-4 p-3 rounded-md"
            :class="success ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'">
            {{ message }}
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