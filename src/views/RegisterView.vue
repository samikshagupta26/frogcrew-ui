<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-y-12 p-x-4 sm:p-x-6 lg:p-x-8">
        <div class="max-w-md w-full space-y-8 card">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Frog Crew</h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Create your account
                </p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div v-if="errorMessage"
                    class="bg-red-100 border border-red-400 text-red-700 p-x-4 p-y-3 rounded relative" role="alert">
                    <span class="block sm:inline">{{ errorMessage }}</span>
                </div>

                <div v-if="successMessage"
                    class="bg-green-100 border border-green-400 text-green-700 p-x-4 p-y-3 rounded relative"
                    role="alert">
                    <span class="block sm:inline">{{ successMessage }}</span>
                </div>

                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                        <input id="name" v-model="userData.name" name="name" type="text" required class="input mt-1" />
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <input id="email" v-model="userData.email" name="email" type="email" required
                            class="input mt-1" />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" v-model="userData.password" name="password" type="password" required
                            class="input mt-1" />
                    </div>

                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm
                            Password</label>
                        <input id="confirmPassword" v-model="confirmPassword" name="confirmPassword" type="password"
                            required class="input mt-1" />
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="text-sm">
                        <router-link to="/login" class="font-medium text-green-600 hover:text-green-500">
                            Already have an account? Sign in
                        </router-link>
                    </div>
                </div>

                <div>
                    <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
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