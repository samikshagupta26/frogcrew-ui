<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="apiError" class="flex items-center justify-center min-h-screen">
            <div class="bg-red-50 p-6 rounded-xl max-w-md shadow-sm">
                <p class="text-red-600 font-medium">{{ apiError }}</p>
                <button @click="fetchProtectedData" class="mt-4 btn-primary">Retry</button>
            </div>
        </div>

        <!-- Main Content -->
        <template v-else>
            <!-- Modern Header -->
            <header class="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center py-4">
                        <div class="flex items-center space-x-3">
                            <div
                                class="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h1
                                class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Frog Crew</h1>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl shadow-sm">
                                <div
                                    class="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium shadow-sm">
                                    {{ user?.firstName?.charAt(0) || user?.role?.charAt(0) || 'U' }}
                                </div>
                                <span class="text-sm font-medium text-slate-700">{{ user?.firstName || user?.role ||
                                    'User' }}</span>
                            </div>
                            <button @click="logout"
                                class="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Breadcrumb navigation -->
                <div v-if="activeFeature" class="mb-6 flex items-center text-sm text-slate-500">
                    <button @click="resetFeature"
                        class="hover:text-slate-700 flex items-center space-x-1 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Dashboard</span>
                    </button>
                    <svg class="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span class="text-slate-700 font-medium">{{ featureTitles[activeFeature] || activeFeature }}</span>
                </div>

                <!-- Dashboard view (when no feature is selected) -->
                <div v-if="!activeFeature">
                    <!-- Welcome Section -->
                    <div
                        class="card mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl overflow-hidden shadow-lg">
                        <div class="p-8">
                            <h2 class="text-3xl font-bold mb-3">Welcome to Frog Crew</h2>
                            <p class="text-emerald-100 text-lg">Manage your crew, schedule games, and stay organized
                                with
                                our comprehensive platform.</p>
                        </div>
                    </div>

                    <!-- Crew Dashboard -->
                    <div v-if="isCrewRole" class="mb-8">
                        <h2 class="text-2xl font-bold text-slate-800 mb-6">Crew Dashboard</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <!-- Feature cards with improved design -->
                            <div v-for="(feature, index) in crewFeatures" :key="index"
                                class="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden bg-white">
                                <div class="p-6 flex flex-col h-full">
                                    <div class="mb-4 flex justify-center">
                                        <div
                                            :class="`h-14 w-14 rounded-xl ${feature.bgColor} flex items-center justify-center shadow-sm`">
                                            <component :is="feature.icon" class="h-7 w-7" :class="feature.iconColor" />
                                        </div>
                                    </div>
                                    <h3 class="text-lg font-semibold mb-2 text-center text-slate-800">{{ feature.title
                                    }}</h3>
                                    <p class="text-slate-600 mb-4 text-center text-sm">{{ feature.description }}</p>
                                    <button @click="setActiveFeature(feature.id)"
                                        class="btn-primary mt-auto hover:bg-opacity-90 transition-all duration-200 rounded-xl">
                                        {{ feature.buttonText }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Admin Dashboard -->
                    <div v-if="isAdminRole" class="mb-8">
                        <div class="flex items-center justify-between mb-8">
                            <h2 class="text-3xl font-bold text-slate-800">Admin Dashboard</h2>
                            <div class="flex items-center space-x-4">
                                <div class="flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span class="text-sm font-medium text-slate-600">Last updated: {{ new
                                        Date().toLocaleDateString() }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Stats -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-slate-500">Total Crew</p>
                                        <h3 class="text-2xl font-bold text-slate-800 mt-1">24</h3>
                                    </div>
                                    <div class="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <UsersIcon class="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <span class="text-sm text-green-600 font-medium">+2 new this week</span>
                                </div>
                            </div>
                            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-slate-500">Upcoming Games</p>
                                        <h3 class="text-2xl font-bold text-slate-800 mt-1">8</h3>
                                    </div>
                                    <div class="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                                        <CalendarIcon class="h-6 w-6 text-cyan-600" />
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <span class="text-sm text-blue-600 font-medium">3 this week</span>
                                </div>
                            </div>
                            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-slate-500">Pending Invites</p>
                                        <h3 class="text-2xl font-bold text-slate-800 mt-1">5</h3>
                                    </div>
                                    <div class="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center">
                                        <EnvelopeIcon class="h-6 w-6 text-pink-600" />
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <span class="text-sm text-amber-600 font-medium">2 awaiting response</span>
                                </div>
                            </div>
                            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-slate-500">Crew Availability</p>
                                        <h3 class="text-2xl font-bold text-slate-800 mt-1">85%</h3>
                                    </div>
                                    <div class="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                                        <ClipboardDocumentCheckIcon class="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <span class="text-sm text-green-600 font-medium">+5% from last week</span>
                                </div>
                            </div>
                        </div>

                        <!-- Admin Features Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <!-- Feature cards with improved design -->
                            <div v-for="(feature, index) in adminFeatures" :key="index"
                                class="group card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden bg-white border border-slate-100">
                                <div class="p-6 flex flex-col h-full">
                                    <div class="mb-4 flex justify-center">
                                        <div
                                            :class="`h-16 w-16 rounded-xl ${feature.bgColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`">
                                            <component :is="feature.icon" class="h-8 w-8" :class="feature.iconColor" />
                                        </div>
                                    </div>
                                    <h3 class="text-xl font-semibold mb-2 text-center text-slate-800">{{ feature.title
                                    }}</h3>
                                    <p class="text-slate-600 mb-4 text-center text-sm">{{ feature.description }}</p>
                                    <button v-if="feature.id !== 'game-management'"
                                        @click="setActiveFeature(feature.id)"
                                        class="btn-primary mt-auto hover:bg-opacity-90 transition-all duration-200 rounded-xl group-hover:shadow-md">
                                        {{ feature.buttonText }}
                                    </button>
                                    <router-link v-else to="/admin/game-management"
                                        class="btn-primary mt-auto hover:bg-opacity-90 transition-all duration-200 rounded-xl group-hover:shadow-md block text-center">
                                        {{ feature.buttonText }}
                                    </router-link>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="mt-8">
                            <h3 class="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
                            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div class="divide-y divide-slate-100">
                                    <div class="p-4 hover:bg-slate-50 transition-colors duration-200">
                                        <div class="flex items-center space-x-3">
                                            <div
                                                class="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                                                <UsersIcon class="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium text-slate-800">New crew member added</p>
                                                <p class="text-xs text-slate-500">John Doe joined the team</p>
                                            </div>
                                            <span class="text-xs text-slate-400 ml-auto">2 hours ago</span>
                                        </div>
                                    </div>
                                    <div class="p-4 hover:bg-slate-50 transition-colors duration-200">
                                        <div class="flex items-center space-x-3">
                                            <div
                                                class="h-8 w-8 rounded-full bg-cyan-50 flex items-center justify-center">
                                                <CalendarIcon class="h-4 w-4 text-cyan-600" />
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium text-slate-800">Game scheduled</p>
                                                <p class="text-xs text-slate-500">Saturday Night Game added</p>
                                            </div>
                                            <span class="text-xs text-slate-400 ml-auto">5 hours ago</span>
                                        </div>
                                    </div>
                                    <div class="p-4 hover:bg-slate-50 transition-colors duration-200">
                                        <div class="flex items-center space-x-3">
                                            <div
                                                class="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                                                <ClipboardDocumentCheckIcon class="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium text-slate-800">Availability updated</p>
                                                <p class="text-xs text-slate-500">5 crew members updated their
                                                    availability</p>
                                            </div>
                                            <span class="text-xs text-slate-400 ml-auto">1 day ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Feature Content Section -->
                <div v-else class="feature-content">
                    <!-- Crew Profile Viewer -->
                    <CrewProfileView v-if="activeFeature === 'profile-viewer'" :userId="user?.id || null" />

                    <!-- Game Calendar -->
                    <GameCalendar v-if="activeFeature === 'game-calendar'" />

                    <!-- Availability Form -->
                    <AvailabilityForm v-if="activeFeature === 'availability'" />

                    <!-- Invite Form -->
                    <InviteForm v-if="activeFeature === 'invite-workflow'" />

                    <!-- Crew Directory -->
                    <CrewDirectory v-if="activeFeature === 'crew-directory' || activeFeature === 'admin-crew'" />

                    <!-- Crew Assignment Board -->
                    <CrewAssignmentBoard v-if="activeFeature === 'crew-assignment'" />

                    <div v-if="['game-crew-list', 'schedule-builder', 'game-manager'].includes(activeFeature)"
                        class="card rounded-2xl">
                        <h3 class="text-xl font-bold mb-4 text-slate-800">{{ featureTitles[activeFeature] }}</h3>
                        <p class="text-slate-600">This feature is coming soon!</p>
                    </div>
                </div>
            </main>
        </template>
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

// Feature configurations
const crewFeatures = [
    {
        id: 'profile-viewer',
        title: 'Your Profile',
        description: 'Set up your account and manage your profile information',
        icon: UserIcon,
        bgColor: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        buttonText: 'Update Profile'
    },
    {
        id: 'crew-directory',
        title: 'Crew Directory',
        description: 'View contact info and roles for other crew members',
        icon: UsersIcon,
        bgColor: 'bg-teal-100',
        iconColor: 'text-teal-600',
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
        bgColor: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        buttonText: 'Manage Crew'
    },
    {
        id: 'game-management',
        title: 'Game Management',
        description: 'Create schedules, add games, and assign crew',
        icon: CalendarIcon,
        bgColor: 'bg-teal-100',
        iconColor: 'text-teal-600',
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