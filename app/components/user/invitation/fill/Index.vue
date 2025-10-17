<script setup>
const route = useRoute();
const { fetchInvitation } = useInvitationStore();

const invitationId = route.params.invitationId;

// Notification state
const notification = reactive({
  show: false,
  type: "info",
  message: "",
});

const invitationData = ref({});
const isLoading = ref(true);

const showNotification = (type, message) => {
  notification.type = type;
  notification.message = message;
  notification.show = true;
};

const closeNotification = () => {
  notification.show = false;
};

// Handle success from form
const handleFormSuccess = (message) => {
  showNotification("success", message);
};

// Handle error from form
const handleFormError = (message) => {
  showNotification("error", message);
};

const loadInvitationData = async () => {
  isLoading.value = true;

  try {
    const response = await fetchInvitation(invitationId);

    invitationData.value = response;
  } catch (error) {
    handleFormError(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadInvitationData();
});
</script>

<template>
  <div class="bg-off-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
    <!-- Popup Alert Notification -->
    <FormAlertNotification
      :type="notification.type"
      :message="notification.message"
      :show="notification.show"
      position="top-center"
      :duration="5000"
      @close="closeNotification"
    />

    <div v-if="isLoading" class="text-center py-8">
      <div
        class="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400"
      >
        <Spinner />
        <p>Memuat data pernikahan...</p>
      </div>
    </div>

    <div v-else>
      <!-- Main Info Form -->
      <UserInvitationFillMainInfo
        :invitation-id="invitationId"
        :package-id="invitationData.order.package_id"
        @success="handleFormSuccess"
        @error="handleFormError"
      />
    </div>
  </div>
</template>
