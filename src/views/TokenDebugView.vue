<template>
    <div class="min-h-screen p-8 bg-gray-100">
        <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 class="text-2xl font-bold mb-6">Invitation Token Debug Tool</h1>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Test Token:</label>
                <div class="flex">
                    <input v-model="token" class="flex-1 border border-gray-300 rounded-l-md px-3 py-2"
                        placeholder="Enter invitation token" />
                    <button @click="testToken" class="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                        :disabled="isLoading">
                        {{ isLoading ? 'Testing...' : 'Test Token' }}
                    </button>
                </div>
            </div>

            <div v-if="results" class="border border-gray-200 rounded-md p-4 mb-6">
                <h2 class="font-bold text-lg mb-3">Test Results</h2>

                <div v-if="results.success" class="mb-4 p-3 bg-purple-100 border border-purple-300 rounded">
                    <p class="font-medium">✅ Success! Token is valid</p>
                    <p class="text-sm">Working endpoint: {{ results.workingEndpoint }}</p>
                    <div class="mt-2">
                        <p class="font-medium">Response data:</p>
                        <pre
                            class="bg-gray-50 p-2 rounded text-sm mt-1 overflow-auto">{{ JSON.stringify(results.data, null, 2) }}</pre>
                    </div>
                </div>

                <div v-else class="mb-4 p-3 bg-red-100 border border-red-300 rounded">
                    <p class="font-medium">❌ Failed! No working endpoints found</p>
                    <div class="mt-2">
                        <p class="font-medium">Errors:</p>
                        <div v-for="(error, endpoint) in results.allErrors" :key="endpoint" class="mt-2">
                            <p class="font-medium text-sm">{{ endpoint }}:</p>
                            <p class="text-sm text-red-700">{{ error }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 p-4 rounded">
                <h3 class="font-medium mb-2">Backend Configuration Check</h3>
                <ul class="list-disc pl-5 text-sm space-y-2">
                    <li>Make sure your Spring Boot backend is running</li>
                    <li>Check CORS configuration allows requests from your frontend</li>
                    <li>Verify the InvitationController is implemented and mapped correctly</li>
                    <li>Validate that your database has the invitation record with the correct token</li>
                    <li>Check that the token is not expired or already used</li>
                    <li>Confirm that server logs show the incoming request</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'


const token = ref('')
const results = ref(null)
const isLoading = ref(false)

async function testToken() {
    if (!token.value) return

    isLoading.value = true
    results.value = null

    try {
        results.value = await testInvitationEndpoints(token.value)
        console.log('Test results:', results.value)
    } catch (error) {
        console.error('Testing error:', error)
    } finally {
        isLoading.value = false
    }
}
</script>