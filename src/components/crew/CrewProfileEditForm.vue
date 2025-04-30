<template>
    <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-6">
            <div v-if="isLoading" class="flex justify-center">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>

            <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
                {{ error }}
            </div>

            <div v-else class="space-y-4">
                <h3 class="text-xl font-bold mb-4">Edit Profile</h3>

                <form @submit.prevent="updateProfile" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First
                                Name</label>
                            <input id="firstName" v-model="profileData.firstName" type="text" class="input w-full"
                                required />
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input id="lastName" v-model="profileData.lastName" type="text" class="input w-full"
                                required />
                        </div>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input id="email" v-model="profileData.email" type="email" class="input w-full" required />
                    </div>

                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input id="phone" v-model="profileData.phoneNumber" type="tel" class="input w-full" />
                    </div>

                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                        </button>
                    </div>
                </form>

                <div v-if="updateSuccess" class="mt-4 bg-green-100 border border-green-400 text-green-700 p-3 rounded">
                    Profile updated successfully!
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