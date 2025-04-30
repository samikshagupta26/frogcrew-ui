<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-teal-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
        <div class="max-w-md w-full space-y-8 card transform transition-all duration-300 hover:scale-[1.02]">
            <div class="flex flex-col items-center">
                <div
                    class="w-20 h-20 bg-gradient-to-br from-purple-300 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2
                    class="text-center text-4xl font-extrabold bg-gradient-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent">
                    Frog Crew</h2>
                <p class="mt-3 text-center text-sm text-gray-600">
                    Welcome back! Please sign in to your account
                </p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div v-if="errorMessage"
                    class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg relative animate-fade-in" role="alert">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">{{ errorMessage }}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-5">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                        <div class="mt-1 relative rounded-md shadow-sm group">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <input id="email" v-model="email" name="email" type="email" required
                                class="input pl-10 group-hover:border-purple-300 group-focus-within:border-purple-500 group-focus-within:ring-2 group-focus-within:ring-purple-200"
                                placeholder="you@example.com" />
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <div class="mt-1 relative rounded-md shadow-sm group">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input id="password" v-model="password" name="password" type="password" required
                                class="input pl-10 group-hover:border-purple-300 group-focus-within:border-purple-500 group-focus-within:ring-2 group-focus-within:ring-purple-200"
                                placeholder="••••••••" />
                        </div>
                    </div>
                </div>


                <div>
                    <button type="submit" class="btn btn-primary w-full group" :disabled="isLoading">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg class="h-5 w-5 text-white group-hover:text-purple-100 transition-colors duration-200"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </span>
                        {{ isLoading ? 'Signing in...' : 'Sign in' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
    // Reset messages
    errorMessage.value = ''
    isLoading.value = true

    try {
        const result = await authStore.login(email.value, password.value)

        if (result.success) {
            router.push({ name: 'home' })
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

<style scoped>
.card {
    background-color: white;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-radius: 1.5rem;
    overflow: hidden;
    padding: 2.5rem;
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.9);
}

.btn-primary {
    position: relative;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(to right, #660596, #8418ac);
    color: white;
    border-radius: 0.75rem;
    transition: all 0.2s ease-in-out;
    font-weight: 500;
    letter-spacing: 0.025em;
    box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.1), 0 2px 4px -1px rgba(5, 150, 105, 0.06);
}

.btn-primary:hover {
    background: linear-gradient(to right, #630478, #6e0d94);
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.1), 0 4px 6px -2px rgba(5, 150, 105, 0.05);
}

.btn-primary:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(134, 16, 185, 0.3);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.input {
    display: block;
    width: 100%;
    border-radius: 0.75rem;
    border: 2px solid #e5e7eb;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    padding: 0.875rem 1rem 0.875rem 2.5rem;
    font-size: 0.9375rem;
    line-height: 1.25rem;
    transition: all 0.2s ease-in-out;
    background-color: #f9fafb;
}

.input:hover {
    background-color: #ffffff;
    border-color: #e5e7eb;
}

.input:focus {
    outline: none;
    background-color: #ffffff;
    border-color: #6f0596;
    box-shadow: 0 0 0 3px rgba(143, 16, 185, 0.1);
}

.input::placeholder {
    color: #9ca3af;
    opacity: 0.8;
}

.input:focus::placeholder {
    opacity: 0.5;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}
</style>