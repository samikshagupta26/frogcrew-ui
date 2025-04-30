<template>
    <div class="bg-white shadow-lg rounded-xl overflow-hidden">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-emerald-600 to-emerald-800 p-8 text-white">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-6">
                    <div
                        class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-emerald-100">
                        <span class="text-4xl font-bold text-emerald-600">
                            {{ profile.firstName?.[0] }}{{ profile.lastName?.[0] }}
                        </span>
                    </div>
                    <div>
                        <h3 class="text-3xl font-bold">{{ profile.firstName }} {{ profile.lastName }}</h3>
                        <p class="text-emerald-100 text-lg mt-1">{{ profile.role }}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="bg-white bg-opacity-20 px-6 py-2 rounded-full text-lg font-medium">
                        ID: {{ profile.id }}
                    </div>
                    <button v-if="isCurrentUser" @click="editMode = true"
                        class="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="editMode">
            <CrewProfileEditForm :userId="userId" @cancel="editMode = false" @updated="handleProfileUpdated" />
        </div>

        <div v-else class="p-8">
            <div v-if="isLoading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>

            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
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

            <!-- Contact Information -->
            <div class="bg-emerald-50 rounded-xl p-8 mb-8">
                <h4 class="text-xl font-semibold text-emerald-900 mb-6">Contact Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="flex items-center space-x-4">
                        <div class="bg-emerald-100 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-emerald-600">Email</p>
                            <p class="text-lg font-medium text-emerald-900">{{ profile.email }}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="bg-emerald-100 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm text-emerald-600">Phone</p>
                            <p class="text-lg font-medium text-emerald-900">{{ profile.phoneNumber }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Positions -->
            <div class="bg-emerald-50 rounded-xl p-8">
                <h4 class="text-xl font-semibold text-emerald-900 mb-6">Assigned Positions</h4>
                <div v-if="profile.positionIds && profile.positionIds.length > 0" class="flex flex-wrap gap-4">
                    <div v-for="positionId in profile.positionIds" :key="positionId"
                        class="bg-white px-6 py-3 rounded-full border border-emerald-200 text-emerald-700 font-medium text-lg shadow-sm hover:shadow-md transition-all hover:scale-105">
                        {{ positionId }}
                    </div>
                </div>
                <div v-else class="text-emerald-600 italic text-lg">
                    No positions assigned
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { crewService } from '@/services/crewService';
import { useAuthStore } from '@/stores/auth';
import CrewProfileEditForm from './CrewProfileEditForm.vue';

const props = defineProps({
    userId: {
        type: String,
        default: null
    }
});

// Mock data for demonstration
const mockProfile = {
    id: 'CRW-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    role: 'Camera Operator',
    positionIds: ['Camera Operator', 'Technical Director']
};

const profile = ref(mockProfile); // Initialize with mock data
const isLoading = ref(false);
const error = ref(null);
const editMode = ref(false);
const authStore = useAuthStore();

const isCurrentUser = computed(() => {
    return props.userId === authStore.currentUser?.userId;
});

// Fetch the profile when userId changes
watch(() => props.userId, fetchProfile, { immediate: true });

async function fetchProfile() {
    if (!props.userId) {
        // Always show mock data when no userId is provided
        profile.value = mockProfile;
        return;
    }

    isLoading.value = true;
    error.value = null;

    try {
        const response = await crewService.getCrewMemberProfile(props.userId);
        if (response.data.flag && response.data.code === 200) {
            profile.value = response.data.data;
        } else {
            error.value = response.data.message || 'Failed to load profile';
            profile.value = mockProfile;
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while loading the profile';
        console.error('Profile fetch error:', err);
        profile.value = mockProfile;
    } finally {
        isLoading.value = false;
    }
}

function handleProfileUpdated() {
    editMode.value = false;
    fetchProfile();
}
</script>