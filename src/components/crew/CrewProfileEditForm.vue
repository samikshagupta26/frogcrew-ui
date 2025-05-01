<template>
    <div class="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div class="p-6">
            <div v-if="isLoading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>

            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded">
                <div class="flex items-start">
                    <div class="flex-shrink-0 mt-0.5">
                        <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium">{{ error }}</p>
                    </div>
                </div>
            </div>

            <div v-else class="space-y-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg class="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                </h3>

                <form @submit.prevent="updateProfile" class="space-y-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input id="firstName" v-model="profileData.firstName" type="text" 
                                    class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    required />
                            </div>
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input id="lastName" v-model="profileData.lastName" type="text" 
                                    class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    required />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input id="email" v-model="profileData.email" type="email" 
                                class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required />
                        </div>
                    </div>

                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <input id="phone" v-model="profileData.phoneNumber" type="tel" 
                                class="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-3">
                        <button type="button" @click="$emit('cancel')" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            Cancel
                        </button>
                        <button type="submit" 
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            :disabled="isSubmitting">
                            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                        </button>
                    </div>
                </form>

                <div v-if="updateSuccess" class="mt-4 bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-purple-700">Profile updated successfully!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { crewService } from '@/services/crewService';

const props = defineProps({
    userId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['cancel', 'updated']);
const authStore = useAuthStore();

const profileData = reactive({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: ''
});

const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref(null);
const updateSuccess = ref(false);

onMounted(async () => {
    await fetchProfile();
});

async function fetchProfile() {
    isLoading.value = true;
    error.value = null;

    try {
        const response = await crewService.getCrewMemberProfile(props.userId);
        if (response.data.flag && response.data.code === 200) {
            const profile = response.data.data;
            profileData.firstName = profile.firstName;
            profileData.lastName = profile.lastName;
            profileData.email = profile.email;
            profileData.phoneNumber = profile.phoneNumber;
            profileData.role = profile.role;
        } else {
            error.value = response.data.message || 'Failed to load profile';
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while loading the profile';
        console.error('Profile fetch error:', err);
    } finally {
        isLoading.value = false;
    }
}

async function updateProfile() {
    isSubmitting.value = true;
    updateSuccess.value = false;
    error.value = null;

    try {
        // Create update DTO object
        const updateData = {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            phoneNumber: profileData.phoneNumber,
            role: profileData.role
        };

        const response = await crewService.updateCrewMember(props.userId, updateData);

        if (response.data.flag && response.data.code === 200) {
            updateSuccess.value = true;
            emit('updated');

            // If this is the current user, update auth store
            if (props.userId === authStore.currentUser?.userId) {
                const userData = {
                    ...authStore.user,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName
                };
                authStore.updateUserData(userData);
            }
        } else {
            error.value = response.data.message || 'Failed to update profile';
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while updating profile';
        console.error('Profile update error:', err);
    } finally {
        isSubmitting.value = false;
    }
}
</script>