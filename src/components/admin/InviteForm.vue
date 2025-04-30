<template>
    <div class="bg-white shadow-lg rounded-xl overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <h3 class="text-2xl font-bold text-white">Invite Crew Members</h3>
            <p class="text-blue-100 mt-1">Send invitations to new crew members to join your team</p>
        </div>

        <div class="p-6">
            <form @submit.prevent="sendInvites" class="space-y-6">
                <!-- Email Input Section -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">
                        Email Addresses
                    </label>
                    <div class="text-xs text-gray-500">
                        Enter multiple email addresses separated by commas or new lines
                    </div>
                    <div class="relative">
                        <textarea v-model="emailInput"
                            class="input w-full h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            :class="{ 'border-red-500': emailError }"
                            placeholder="email1@example.com, email2@example.com" required
                            @input="validateEmails"></textarea>
                        <div v-if="emailError" class="absolute bottom-2 right-2 text-red-500 text-xs">
                            {{ emailError }}
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end">
                    <button type="submit" class="btn btn-primary flex items-center space-x-2"
                        :disabled="isSubmitting || !isValid">
                        <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span>{{ isSubmitting ? 'Sending Invites...' : 'Send Invites' }}</span>
                    </button>
                </div>
            </form>

            <!-- Success message -->
            <div v-if="successMessage" class="mt-4 bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                <div class="flex items-center">
                    <svg class="h-5 w-5 text-purple-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                    <p class="text-purple-700">{{ successMessage }}</p>
                </div>
            </div>

            <!-- Error message -->
            <div v-if="errorMessage" class="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div class="flex items-center">
                    <svg class="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                    <p class="text-red-700">{{ errorMessage }}</p>
                </div>
            </div>

            <!-- Results -->
            <div v-if="inviteResults.length > 0" class="mt-8">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">Invite Results</h4>

                <div class="border rounded-lg overflow-hidden shadow-sm">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Invite Link
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expires
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="invite in inviteResults" :key="invite.email" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ invite.email }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div class="flex items-center">
                                        <span class="truncate max-w-xs">{{ invite.inviteLink }}</span>
                                        <button @click="copyToClipboard(invite.inviteLink)"
                                            class="ml-2 p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                                            title="Copy to clipboard">
                                            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(invite.expiresAt) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex items-center space-x-3">
                                        <button @click="resendInvite(invite.email)"
                                            class="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                            title="Resend invite">
                                            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span>Resend</span>
                                        </button>
                                        <button @click="revokeInvite(invite.token)"
                                            class="text-red-600 hover:text-red-900 flex items-center space-x-1"
                                            title="Revoke invite">
                                            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Revoke</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { adminService } from '@/services/adminService';

// Data
const emailInput = ref('');
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const inviteResults = ref([]);
const emailError = ref('');

// Computed
const isValid = computed(() => {
    return emailInput.value.trim() !== '';
});

// Methods
function validateEmails() {
    const emails = parseEmails(emailInput.value);
    if (emails.length === 0 && emailInput.value.trim() !== '') {
        emailError.value = 'Please enter valid email addresses';
    } else {
        emailError.value = '';
    }
}

async function sendInvites() {
    const emails = parseEmails(emailInput.value);

    if (emails.length === 0) {
        errorMessage.value = 'Please enter at least one valid email address';
        return;
    }

    isSubmitting.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    try {
        const response = await adminService.inviteCrewMembers({ emails });

        if (response.data.flag && response.data.code === 200) {
            successMessage.value = `Successfully sent ${emails.length} invitation${emails.length > 1 ? 's' : ''}`;
            inviteResults.value = response.data.data;
            emailInput.value = '';
        } else {
            errorMessage.value = response.data.message || 'Failed to send invites';
        }
    } catch (err) {
        errorMessage.value = err.response?.data?.message || 'An error occurred while sending invites';
        console.error('Invite error:', err);
    } finally {
        isSubmitting.value = false;
    }
}

function parseEmails(input) {
    const rawEmails = input.split(/,|\n/).map(email => email.trim());
    return rawEmails.filter(email => {
        return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show a small toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm';
        toast.textContent = 'Copied to clipboard!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function resendInvite(email) {
    // In a real app, this would call an API to resend the invite
    alert(`Resending invite to ${email}`);
}

function revokeInvite(token) {
    // In a real app, this would call an API to revoke the invite
    alert(`Revoking invite with token ${token}`);
}
</script>