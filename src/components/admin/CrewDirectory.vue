<template>
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Header with tabs and controls -->
        <div class="bg-white border-b border-gray-200">
            <div class="px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Crew Directory</h1>
                    <p class="text-sm text-gray-500">Manage your team members and their roles</p>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input v-model="searchQuery" type="text" placeholder="Search crew members..."
                            class="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                    </div>
                    <button v-if="isAdmin" @click="showAddCrewModal = true"
                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Member
                    </button>
                </div>
            </div>
            
            <!-- Tabs and filters -->
            <div class="flex justify-between items-center px-6 pb-4">
                <div class="flex space-x-4 border-b border-transparent">
                    <button @click="viewMode = 'card'" 
                        class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
                        :class="viewMode === 'card' ? 'text-purple-600 bg-purple-50' : 'text-gray-500 hover:text-gray-700'">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Card View
                        </div>
                    </button>
                    <button @click="viewMode = 'table'"
                        class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
                        :class="viewMode === 'table' ? 'text-purple-600 bg-purple-50' : 'text-gray-500 hover:text-gray-700'">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clip-rule="evenodd" />
                            </svg>
                            Table View
                        </div>
                    </button>
                </div>
                
                <div class="flex items-center space-x-3">
                    <select v-model="roleFilter"
                        class="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm">
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="CREW">Crew</option>
                    </select>
                    <button @click="resetFilters"
                        class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 text-sm">
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 p-4 m-6 rounded-lg">
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
        
        <!-- Table View -->
        <div v-else-if="viewMode === 'table' && filteredCrewMembers.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="crewMember in filteredCrewMembers" :key="crewMember.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                    <span class="text-white font-medium">{{ crewMember.firstName.charAt(0) }}{{ crewMember.lastName.charAt(0) }}</span>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">{{ crewMember.firstName }} {{ crewMember.lastName }}</div>
                                    <div class="text-sm text-gray-500">ID: {{ crewMember.id }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                {{ crewMember.role }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                            {{ crewMember.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ crewMember.phoneNumber }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex justify-end space-x-2">
                                <button @click="viewCrewMember(crewMember)" class="text-purple-600 hover:text-purple-900">View</button>
                                <button v-if="isAdmin" @click="confirmDelete(crewMember)" class="text-red-600 hover:text-red-900">Remove</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Card View -->
        <div v-else-if="viewMode === 'card' && filteredCrewMembers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            <div v-for="crewMember in filteredCrewMembers" :key="crewMember.id"
                class="bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow">
                <div class="p-5">
                    <!-- Avatar and Name Section -->
                    <div class="flex items-center space-x-4 mb-4">
                        <div class="flex-shrink-0">
                            <div
                                class="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                                <span class="text-white text-xl font-semibold">{{ crewMember.firstName.charAt(0) }}{{ crewMember.lastName.charAt(0) }}</span>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-base font-semibold text-gray-900">{{ crewMember.firstName }} {{ crewMember.lastName }}</h4>
                            <p class="text-xs text-gray-500">ID: {{ crewMember.id }}</p>
                        </div>
                    </div>

                    <!-- Role Badge -->
                    <div class="mb-4">
                        <span class="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {{ crewMember.role }}
                        </span>
                    </div>

                    <!-- Contact Information -->
                    <div class="space-y-3 mb-4">
                        <div class="flex items-center text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span class="truncate">{{ crewMember.email }}</span>
                        </div>
                        <div class="flex items-center text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span class="truncate">{{ crewMember.phoneNumber }}</span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex space-x-2">
                        <button @click="viewCrewMember(crewMember)"
                            class="flex-1 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                            View Details
                        </button>
                        <button v-if="isAdmin" @click="confirmDelete(crewMember)"
                            class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredCrewMembers.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No crew members found</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by adding a new crew member.</p>
            <div class="mt-6">
                <button v-if="isAdmin" @click="showAddCrewModal = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Member
                </button>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl w-full max-w-md p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                    <button @click="showDeleteModal = false" class="text-gray-400 hover:text-gray-500">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p class="text-gray-600 mb-6">Are you sure you want to remove this crew member? This action cannot be
                    undone.</p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Cancel
                    </button>
                    <button @click="deleteCrewMember"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <!-- View Details Modal -->
        <div v-if="showViewModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Crew Member Details</h3>
                        <button @click="showViewModal = false" class="text-gray-400 hover:text-gray-500">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <h5 class="text-sm font-medium text-gray-500">Full Name</h5>
                                    <p class="mt-1 text-lg text-gray-900">{{ selectedCrewMember.firstName }} {{
                                        selectedCrewMember.lastName }}</p>
                                </div>
                                <div>
                                    <h5 class="text-sm font-medium text-gray-500">ID</h5>
                                    <p class="mt-1 text-lg text-gray-900">{{ selectedCrewMember.id }}</p>
                                </div>
                                <div>
                                    <h5 class="text-sm font-medium text-gray-500">Email</h5>
                                    <p class="mt-1 text-lg text-gray-900">{{ selectedCrewMember.email }}</p>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <div>
                                    <h5 class="text-sm font-medium text-gray-500">Phone Number</h5>
                                    <p class="mt-1 text-lg text-gray-900">{{ selectedCrewMember.phoneNumber }}</p>
                                </div>
                                <div>
                                    <h5 class="text-sm font-medium text-gray-500">Role</h5>
                                    <span class="mt-1 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                        {{ selectedCrewMember.role }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Crew Member Modal -->
        <div v-if="showAddCrewModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl w-full max-w-md p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Add New Crew Member</h3>
                    <button @click="showAddCrewModal = false" class="text-gray-400 hover:text-gray-500">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form @submit.prevent="addCrewMember" class="space-y-4">
                    <div>
                        <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" id="firstName" v-model="newCrewMember.firstName"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required />
                    </div>
                    <div>
                        <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" id="lastName" v-model="newCrewMember.lastName"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required />
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" v-model="newCrewMember.email"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required />
                    </div>
                    <div>
                        <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" id="phoneNumber" v-model="newCrewMember.phoneNumber"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required />
                    </div>
                    <div>
                        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                        <select id="role" v-model="newCrewMember.role"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required>
                            <option value="CREW">Crew</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" @click="showAddCrewModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                            Add Crew Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminService } from '@/services/adminService';
import { useAuthStore } from '@/stores/auth';

// Data
const crewMembers = ref([]);
const isLoading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const roleFilter = ref('');
const viewMode = ref('table'); // 'table' or 'card'

const showDeleteModal = ref(false);
const selectedCrewMember = ref(null);
const isDeleting = ref(false);
const deleteSuccess = ref(false);
const deleteError = ref(null);

const showViewModal = ref(false);
const showAddCrewModal = ref(false);

const newCrewMember = ref({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'CREW'
});

const authStore = useAuthStore();

// Computed properties
const isAdmin = computed(() => {
    return authStore.currentUser?.role === 'ADMIN';
});

const filteredCrewMembers = computed(() => {
    return crewMembers.value.filter(member => {
        const matchesSearch = searchQuery.value === '' ||
            `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesRole = roleFilter.value === '' || member.role === roleFilter.value;

        return matchesSearch && matchesRole;
    });
});

// Methods
function resetFilters() {
    searchQuery.value = '';
    roleFilter.value = '';
}

async function fetchCrewMembers() {
    isLoading.value = true;
    error.value = null;

    try {
        const response = await adminService.getAllCrewMembers();
        if (response.data.flag && response.data.code === 200) {
            crewMembers.value = response.data.data;
        } else {
            error.value = response.data.message || 'Failed to load crew members';
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'An error occurred while loading crew members';
        console.error('Crew fetch error:', err);
    } finally {
        isLoading.value = false;
    }
}

function confirmDelete(crewMember) {
    selectedCrewMember.value = crewMember;
    showDeleteModal.value = true;
}

async function deleteCrewMember() {
    if (!selectedCrewMember.value) return;

    isDeleting.value = true;
    deleteError.value = null;

    try {
        const response = await adminService.deleteCrewMember(selectedCrewMember.value.id);

        if (response.data.flag && response.data.code === 200) {
            crewMembers.value = crewMembers.value.filter(
                member => member.id !== selectedCrewMember.value.id
            );
            deleteSuccess.value = true;
            showDeleteModal.value = false;
        } else {
            deleteError.value = response.data.message || 'Failed to delete crew member';
        }
    } catch (err) {
        deleteError.value = err.response?.data?.message || 'An error occurred while deleting';
        console.error('Delete error:', err);
    } finally {
        isDeleting.value = false;
    }
}

function viewCrewMember(crewMember) {
    selectedCrewMember.value = crewMember;
    showViewModal.value = true;
}

async function addCrewMember() {
    try {
        const response = await adminService.addCrewMember(newCrewMember.value);
        if (response.data.flag && response.data.code === 200) {
            crewMembers.value.push(response.data.data);
            showAddCrewModal.value = false;
            newCrewMember.value = {
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                role: 'CREW'
            };
        }
    } catch (err) {
        console.error('Add crew member error:', err);
    }
}

// Lifecycle
onMounted(() => {
    fetchCrewMembers();
});
</script>