<!-- LoadingOverlay.vue -->
<template>
    <Transition name="fade">
        <div v-if="loading" class="loading-overlay">
            <div class="loading-content">
                <div class="flex justify-center">
                    <div class="spinner"></div>
                </div>
                <p v-if="message" class="loading-message">{{ message }}</p>
            </div>
        </div>
    </Transition>
</template>

<script>
export default {
    name: 'LoadingOverlay',
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            default: 'Loading...'
        }
    }
}
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.loading-message {
    margin-top: 1rem;
    color: #666;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>