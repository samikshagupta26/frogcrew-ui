<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 shadow-lg rounded-xl border border-gray-100">
            <div>
                <div class="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Frog Crew</h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Create your account
                </p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">{{ errorMessage }}</p>
                        </div>
                    </div>
                </div>

                <div v-if="successMessage" class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-md">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-purple-700">{{ successMessage }}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                        <div class="mt-1 relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input id="name" v-model="userData.name" name="name" type="text" 
                                class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" 
                                required placeholder="John Doe" />
                        </div>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <div class="mt-1 relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input id="email" v-model="userData.email" name="email" type="email" 
                                class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" 
                                required placeholder="you@example.com" />
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <div class="mt-1 relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input id="password" v-model="userData.password" name="password" type="password" 
                                class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" 
                                required />
                        </div>
                    </div>

                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div class="mt-1 relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input id="confirmPassword" v-model="confirmPassword" name="confirmPassword" type="password" 
                                class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" 
                                required />
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="text-sm">
                        <router-link to="/login" class="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-150">
                            Already have an account? Sign in
                        </router-link>
                    </div>
                </div>

                <div>
                    <button type="submit" 
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-150 shadow-sm"
                        :disabled="isLoading">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <svg v-else class="h-5 w-5 text-purple-300 group-hover:text-purple-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </span>
                        {{ isLoading ? 'Creating account...' : 'Register' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userData = reactive({
    name: '',
    email: '',
    password: ''
})
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

async function handleRegister() {
    // Reset messages
    errorMessage.value = ''
    successMessage.value = ''

    // Validate form
    if (!userData.name || !userData.email || !userData.password) {
        errorMessage.value = 'Please fill out all fields'
        return
    }

    if (userData.password !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match'
        return
    }

    isLoading.value = true

    try {
        const result = await authStore.register(userData)

        if (result.success) {
            successMessage.value = 'Registration successful! You can now sign in.'
            userData.name = ''
            userData.email = ''
            userData.password = ''
            confirmPassword.value = ''

            // Redirect to login page after short delay
            setTimeout(() => {
                router.push({ name: 'login' })
            }, 2000)
        } else {
            errorMessage.value = result.message
        }
    } catch (error) {
        errorMessage.value = 'An unexpected error occurred'
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>