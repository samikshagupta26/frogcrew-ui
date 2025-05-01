<template>
    <div class="min-h-screen bg-slate-50 flex">
        <!-- Sidebar -->
        <aside v-if="!isLoading && !apiError" class="w-64 bg-white shadow-md h-screen sticky top-0 border-r border-slate-200">
            <div class="p-4 border-b border-slate-200">
                <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 class="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                        Frog Crew
                    </h1>
                </div>
            </div>
            
            <div class="p-4">
                <div class="flex flex-col space-y-1 mb-6">
                    <button @click="resetFeature" class="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Dashboard</span>
                    </button>
                </div>
                
                <div v-if="isCrewRole">
                    <p class="text-xs font-semibold uppercase text-slate-500 mb-2 px-3">Crew Options</p>
                    <div class="flex flex-col space-y-1">
                        <button v-for="feature in crewFeatures" :key="feature.id" 
                            @click="setActiveFeature(feature.id)"
                            class="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                            :class="{'bg-purple-50 text-purple-700': activeFeature === feature.id}">
                            <component :is="feature.icon" class="h-5 w-5 text-slate-500" :class="{'text-purple-500': activeFeature === feature.id}" />
                            <span>{{ feature.title }}</span>
                        </button>
                    </div>
                </div>
                
                <div v-if="isAdminRole" class="mt-6">
                    <p class="text-xs font-semibold uppercase text-slate-500 mb-2 px-3">Admin Options</p>
                    <div class="flex flex-col space-y-1">
                        <button v-for="feature in adminFeatures.filter(f => f.id !== 'game-management')" :key="feature.id" 
                            @click="setActiveFeature(feature.id)"
                            class="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                            :class="{'bg-purple-50 text-purple-700': activeFeature === feature.id}">
                            <component :is="feature.icon" class="h-5 w-5 text-slate-500" :class="{'text-purple-500': activeFeature === feature.id}" />
                            <span>{{ feature.title }}</span>
                        </button>
                        <router-link to="/admin/game-management"
                            class="text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2">
                            <CalendarIcon class="h-5 w-5 text-slate-500" />
                            <span>Game Management</span>
                        </router-link>
                    </div>
                </div>
            </div>
            
            <div class="absolute bottom-0 w-full p-4 border-t border-slate-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                            {{ user?.firstName?.charAt(0) || user?.role?.charAt(0) || 'U' }}
                        </div>
                        <span class="text-sm font-medium">{{ user?.firstName || user?.role || 'User' }}</span>
                    </div>
                </div>
                <button @click="logout" class="w-full flex items-center justify-center space-x-2 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span class="text-sm">Logout</span>
                </button>
            </div>
        </aside>

        <div class="flex-1">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="apiError" class="flex items-center justify-center min-h-screen">
                <div class="bg-red-50 p-6 rounded-xl max-w-md shadow-sm">
                    <p class="text-red-600 font-medium">{{ apiError }}</p>
                    <button @click="fetchProtectedData" class="mt-4 btn-primary">Retry</button>
                </div>
            </div>

            <!-- Main Content Area -->
            <div v-else class="min-h-screen">
                <!-- Breadcrumb and header for active feature -->
                <header v-if="activeFeature" class="bg-white border-b border-slate-200 px-8 py-4">
                    <div class="flex items-center text-sm text-slate-500">
                        <button @click="resetFeature" class="hover:text-slate-700 flex items-center space-x-1 transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Dashboard</span>
                        </button>
                        <svg class="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                        <span class="text-slate-700 font-medium">{{ featureTitles[activeFeature] || activeFeature }}</span>
                    </div>
                    <h1 class="text-2xl font-bold text-slate-800 mt-2">{{ featureTitles[activeFeature] || activeFeature }}</h1>
                </header>

                <!-- Dashboard Content when no feature is selected -->
                <div v-if="!activeFeature" class="p-8">
                    <!-- Welcome Banner -->
                    <div class="mb-8 bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200">
                        <div class="p-6 relative overflow-hidden">
                            <div class="relative z-10">
                                <h2 class="text-2xl font-bold text-slate-800 mb-2">Welcome to Frog Crew</h2>
                                <p class="text-slate-600">Manage your crew, schedule games, and stay organized with our comprehensive platform.</p>
                            </div>
                            <div class="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-purple-100 to-transparent"></div>
                        </div>
                    </div>

                    <!-- Admin Dashboard -->
                    <div v-if="isAdminRole" class="space-y-8">
                        <!-- Quick Stats in horizontal layout -->
                        <div class="bg-white shadow-sm rounded-2xl p-6 border border-slate-200">
                            <h3 class="text-lg font-bold text-slate-800 mb-4">Quick Stats</h3>
                            <div class="grid grid-cols-4 gap-8">
                                <div class="flex items-center space-x-4">
                                    <div class="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <UsersIcon class="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-slate-500">Total Crew</p>
                                        <div class="flex items-baseline">
                                            <h3 class="text-2xl font-bold text-slate-800">24</h3>
                                            <span class="ml-2 text-xs text-purple-600">+2 new</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                                        <CalendarIcon class="h-6 w-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-slate-500">Upcoming Games</p>
                                        <div class="flex items-baseline">
                                            <h3 class="text-2xl font-bold text-slate-800">8</h3>
                                            <span class="ml-2 text-xs text-blue-600">3 this week</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center">
                                        <EnvelopeIcon class="h-6 w-6 text-pink-600" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-slate-500">Pending Invites</p>
                                        <div class="flex items-baseline">
                                            <h3 class="text-2xl font-bold text-slate-800">5</h3>
                                            <span class="ml-2 text-xs text-amber-600">2 awaiting</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                                        <ClipboardDocumentCheckIcon class="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p class="text-sm font-medium text-slate-500">Crew Availability</p>
                                        <div class="flex items-baseline">
                                            <h3 class="text-2xl font-bold text-slate-800">85%</h3>
                                            <span class="ml-2 text-xs text-purple-600">+5%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Features and Recent Activity in 2-column layout -->
                        <div class="grid grid-cols-3 gap-8">
                            <!-- Admin Features -->
                            <div class="col-span-2 bg-white shadow-sm rounded-2xl p-6 border border-slate-200">
                                <h3 class="text-lg font-bold text-slate-800 mb-4">Admin Tools</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div v-for="(feature, index) in adminFeatures" :key="index"
                                        class="group p-4 border border-slate-200 rounded-xl hover:border-purple-200 transition-colors">
                                        <div class="flex items-center space-x-4">
                                            <div :class="`h-12 w-12 rounded-xl ${feature.bgColor} flex items-center justify-center`">
                                                <component :is="feature.icon" class="h-6 w-6" :class="feature.iconColor" />
                                            </div>
                                            <div>
                                                <h4 class="font-medium text-slate-800">{{ feature.title }}</h4>
                                                <p class="text-xs text-slate-500 mt-1">{{ feature.description }}</p>
                                            </div>
                                        </div>
                                        <div class="mt-4">
                                            <button v-if="feature.id !== 'game-management'"
                                                @click="setActiveFeature(feature.id)"
                                                class="w-full btn-primary text-sm py-1.5">
                                                {{ feature.buttonText }}
                                            </button>
                                            <router-link v-else to="/admin/game-management"
                                                class="w-full btn-primary text-sm py-1.5 block text-center">
                                                {{ feature.buttonText }}
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Recent Activity -->
                            <div class="bg-white shadow-sm rounded-2xl p-6 border border-slate-200">
                                <h3 class="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
                                <div class="space-y-4">
                                    <div class="border-b border-slate-100 pb-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center mt-1">
                                                <UsersIcon class="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium text-slate-800">New crew member added</p>
                                                <p class="text-xs text-slate-500">John Doe joined the team</p>
                                                <p class="text-xs text-slate-400 mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="border-b border-slate-100 pb-4">
                                        <div class="flex items-start space-x-3">
                                            <div class="h-8 w-8 rounded-full bg-cyan-50 flex items-center justify-center mt-1">
                                                <CalendarIcon class="h-4 w-4 text-cyan-600" />
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium text-slate-800">Game scheduled</p>
                                                <p class="text-xs text-slate-500">Saturday Night Game added</p>
                                                <p class="text-xs text-slate-400 mt-1">5 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex items-start space-x-3">
                                            <div class="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center mt-1">
                                                <ClipboardDocumentCheckIcon class="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium text-slate-800">Availability updated</p>
                                                <p class="text-xs text-slate-500">5 crew members updated their availability</p>
                                                <p class="text-xs text-slate-400 mt-1">1 day ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Crew Dashboard -->
                    <div v-if="isCrewRole" class="space-y-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div v-for="(feature, index) in crewFeatures" :key="index"
                                class="bg-white shadow-sm rounded-2xl p-6 border border-slate-200 hover:border-purple-200 transition-all duration-300">
                                <div class="flex items-center justify-between">
                                    <div :class="`h-12 w-12 rounded-xl ${feature.bgColor} flex items-center justify-center`">
                                        <component :is="feature.icon" class="h-6 w-6" :class="feature.iconColor" />
                                    </div>
                                    <button @click="setActiveFeature(feature.id)"
                                        class="btn-primary text-sm py-1.5 px-4">
                                        {{ feature.buttonText }}
                                    </button>
                                </div>
                                <h3 class="text-lg font-medium text-slate-800 mt-4">{{ feature.title }}</h3>
                                <p class="text-sm text-slate-600 mt-1">{{ feature.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Feature Content Here -->
                <div v-if="activeFeature" class="p-8">
                    <component 
                        :is="activeFeatureComponent" 
                        v-if="activeFeatureComponent"
                        :userId="activeFeature === 'profile-viewer' ? user?.id : null"
                    ></component>
                    <div v-else class="bg-white shadow-sm rounded-2xl p-6 border border-slate-200">
                        <p>Loading feature {{ activeFeature }}...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

// Import components
import CrewProfileView from '@/components/crew/CrewProfileView.vue'
import GameCalendar from '@/components/game/GameCalendar.vue'
import AvailabilityForm from '@/components/crew/AvailabilityForm.vue'
import InviteForm from '@/components/admin/InviteForm.vue'
import CrewDirectory from '@/components/admin/CrewDirectory.vue'
import CrewAssignmentBoard from '@/components/admin/CrewAssignmentBoard.vue'

// Import icons
import {
    UserIcon,
    UsersIcon,
    CalendarIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentListIcon,
    EnvelopeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.currentUser)
const isLoading = ref(true)
const apiResult = ref(null)
const apiError = ref(null)

// Feature navigation - single state variable now
const activeFeature = ref(null)

// Feature titles for breadcrumb and headings
const featureTitles = {
    'profile-viewer': 'Your Profile',
    'crew-directory': 'Crew Directory',
    'game-calendar': 'Game Calendar',
    'game-crew-list': 'Game Crew Lists',
    'availability': 'Submit Availability',
    'invite-workflow': 'Invite Management',
    'admin-crew': 'Crew Administration',
    'schedule-builder': 'Schedule Builder',
    'game-manager': 'Game Manager',
    'crew-assignment': 'Crew Assignment Board'
}

// Computed property to map active feature to component
const activeFeatureComponent = computed(() => {
    switch (activeFeature.value) {
        case 'profile-viewer':
            return CrewProfileView;
        case 'game-calendar':
            return GameCalendar;
        case 'availability':
            return AvailabilityForm;
        case 'invite-workflow':
            return InviteForm;
        case 'crew-directory':
        case 'admin-crew':
            return CrewDirectory;
        case 'crew-assignment':
            return CrewAssignmentBoard;
        default:
            return null;
    }
});

// Feature configurations
const crewFeatures = [
    {
        id: 'profile-viewer',
        title: 'Your Profile',
        description: 'Set up your account and manage your profile information',
        icon: UserIcon,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        buttonText: 'Update Profile'
    },
    {
        id: 'crew-directory',
        title: 'Crew Directory',
        description: 'View contact info and roles for other crew members',
        icon: UsersIcon,
        bgColor: 'bg-violet-100',
        iconColor: 'text-violet-600',
        buttonText: 'View Directory'
    },
    {
        id: 'game-calendar',
        title: 'Game Calendar',
        description: 'View upcoming games and schedules',
        icon: CalendarIcon,
        bgColor: 'bg-cyan-100',
        iconColor: 'text-cyan-600',
        buttonText: 'View Calendar'
    },
    {
        id: 'availability',
        title: 'Submit Availability',
        description: 'Mark your availability for upcoming games',
        icon: ClipboardDocumentCheckIcon,
        bgColor: 'bg-sky-100',
        iconColor: 'text-sky-600',
        buttonText: 'Update Availability'
    }
]

const adminFeatures = [
    {
        id: 'admin-crew',
        title: 'Crew Administration',
        description: 'Manage and edit crew members',
        icon: UsersIcon,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600',
        buttonText: 'Manage Crew'
    },
    {
        id: 'game-management',
        title: 'Game Management',
        description: 'Create schedules, add games, and assign crew',
        icon: CalendarIcon,
        bgColor: 'bg-violet-100',
        iconColor: 'text-violet-600',
        buttonText: 'Manage Games'
    },
    {
        id: 'crew-assignment',
        title: 'Crew Assignment Board',
        description: 'Assign crew members to games',
        icon: ClipboardDocumentListIcon,
        bgColor: 'bg-cyan-100',
        iconColor: 'text-cyan-600',
        buttonText: 'Assign Crew'
    },
    {
        id: 'invite-workflow',
        title: 'Invite Management',
        description: 'Send invites to new crew members',
        icon: EnvelopeIcon,
        bgColor: 'bg-sky-100',
        iconColor: 'text-sky-600',
        buttonText: 'Send Invites'
    }
]

// Set active feature and clear other features
function setActiveFeature(feature) {
    activeFeature.value = feature
}

// Reset to dashboard view
function resetFeature() {
    activeFeature.value = null
}

// Check user roles for conditional rendering - make case insensitive
const isCrewRole = computed(() => {
    if (!user.value || !user.value.role) return false
    const role = user.value.role.toLowerCase()
    return role === 'crew'
})

const isAdminRole = computed(() => {
    if (!user.value || !user.value.role) return false
    const role = user.value.role.toLowerCase()
    return role === 'admin'
})

function logout() {
    authStore.logout()
    router.push({ name: 'login' })
}

async function fetchProtectedData() {
    isLoading.value = true
    apiResult.value = null
    apiError.value = null

    try {
        // Example API call with JWT auth
        const response = await axios.get('/api/protected-data', {
            headers: {
                'Authorization': `Bearer ${authStore.token}`
            }
        })

        apiResult.value = response.data
    } catch (error) {
        apiError.value = error.response?.data?.message || 'Failed to fetch data'
        console.error('API error:', error)
    } finally {
        isLoading.value = false
    }
}

// Add onMounted hook to fetch initial data
onMounted(async () => {
    try {
        await fetchProtectedData()
    } catch (error) {
        console.error('Error fetching initial data:', error)
        apiError.value = 'Failed to load initial data'
    } finally {
        isLoading.value = false
    }
})
</script>

<style scoped>
.card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
}

.btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-md font-medium;
}

.btn-secondary {
    @apply bg-white text-gray-700 px-4 py-2 rounded-md font-medium border border-gray-300;
}

.feature-content {
    @apply transition-all duration-300;
}

/* Add loading animation styles */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>