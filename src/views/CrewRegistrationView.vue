<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-y-12 p-x-4 sm:p-x-6 lg:p-x-8">
        <div class="max-w-md w-full space-y-8 card">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome to Frog Crew</h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Complete your profile to join the crew
                </p>
            </div>

            <div v-if="invalidToken" class="bg-red-100 border border-red-400 text-red-700 p-x-4 p-y-3 rounded relative">
                <p class="font-medium">Invalid or expired invitation</p>
                <p class="text-sm">This invitation link is invalid or has expired. Please contact your administrator for
                    a new invitation.</p>
            </div>

            <form v-else class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div v-if="errorMessage"
                    class="bg-red-100 border border-red-400 text-red-700 p-x-4 p-y-3 rounded relative" role="alert">
                    <span class="block sm:inline">{{ errorMessage }}</span>
                </div>

                <div v-if="successMessage"
                    class="bg-purple-100 border border-purple-400 text-purple-700 p-x-4 p-y-3 rounded relative"
                    role="alert">
                    <span class="block sm:inline">{{ successMessage }}</span>
                </div>

                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <input id="email" v-model="userData.email" name="email" type="email" required class="input mt-1"
                            disabled />
                        <p class="mt-1 text-xs text-gray-500">Email from your invitation cannot be changed</p>
                    </div>

                    <div>
                        <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                        <input id="firstName" v-model="userData.firstName" name="firstName" type="text" required
                            class="input mt-1" />
                    </div>

                    <div>
                        <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input id="lastName" v-model="userData.lastName" name="lastName" type="text" required
                            class="input mt-1" />
                    </div>

                    <div>
                        <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input id="phoneNumber" v-model="userData.phoneNumber" name="phoneNumber" type="tel" required
                            class="input mt-1" placeholder="e.g. 123-456-7890" />
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

                <div>
                    <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
                        {{ isLoading ? 'Creating profile...' : 'Complete Registration' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { validateInvitation, registerUser } from '@/utils/api-service'

const router = useRouter()
const route = useRoute()

const userData = reactive({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: '',
    role: 'CREW',
    position: []
})
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const invalidToken = ref(false)

async function validateToken() {
    const token = route.query.token
    console.log('Token from URL:', token)

    if (!token) {
        invalidToken.value = true
        return
    }

    try {
        isLoading.value = true
        console.log('Validating token...')

        const response = await validateInvitation(token)

        if (response.data && response.status === 200) {
            console.log('Token validated successfully')

            // Extract email from response data based on the structure
            let email = null
            if (response.data.data && response.data.data.email) {
                email = response.data.data.email
            } else if (response.data.email) {
                email = response.data.email
            }

            if (email) {
                userData.email = email
                invalidToken.value = false
            } else {
                console.error('Email not found in response data:', response.data)
                invalidToken.value = true
            }
        } else {
            console.error('Token validation failed')
            invalidToken.value = true
        }
    } catch (error) {
        console.error('Error in token validation:', error)
        invalidToken.value = true
    } finally {
        isLoading.value = false
    }
}

onMounted(validateToken)

async function handleRegister() {
    // Reset messages
    errorMessage.value = ''
    successMessage.value = ''

    // Validate form
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.phoneNumber) {
        errorMessage.value = 'Please fill out all fields'
        return
    }

    if (userData.password !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match'
        return
    }

    isLoading.value = true
    const token = route.query.token
    console.log('Registering with token:', token)

    try {
        const response = await registerUser(token, userData)

        if (response.data && response.status === 201) {
            console.log('Registration successful')
            successMessage.value = 'Registration successful! You can now sign in.'

            // Clear form
            userData.firstName = ''
            userData.lastName = ''
            userData.password = ''
            userData.phoneNumber = ''
            confirmPassword.value = ''

            // Redirect to login page after short delay
            setTimeout(() => {
                router.push({ name: 'login' })
            }, 2000)
        } else {
            console.error('Registration failed')
            errorMessage.value = 'Registration failed. Please try again later or contact support.'
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'An unexpected error occurred'
        console.error('Registration error:', error)
    } finally {
        isLoading.value = false
    }
}
</script>