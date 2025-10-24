<script setup>
const { fetchInvitation } = useInvitationStore();
const route = useRoute();

const invitationId = route.params.id;

const emit = defineEmits(["success", "error", "next"]);

const ui = reactive({
  pending: true,
  isLoading: false,
  showForm: false,
  editingGuest: null,
});

const invitationData = ref([]);
const guests = ref([]);
const packageId = ref(null);

// Get maximum guests based on package
const maxGuests = computed(() => {
  if (packageId.value === 1) return 50;
  if (packageId.value === 2) return 500;
  return null; // unlimited for package > 2
});

// Check if guest limit reached
const isGuestLimitReached = computed(() => {
  if (maxGuests.value === null) return false;
  return guests.value.length >= maxGuests.value;
});

const fetchData = async () => {
  ui.pending = true;

  try {
    const response = await fetchInvitation(invitationId);

    invitationData.value = response;
    guests.value = response.guests;
    packageId.value = response.order.package_id;
  } catch (error) {
    console.error("Failed to fetch invitation data:", error);
    console.error("Failed to fetch invitation data:", error.validationErrors);
  } finally {
    ui.pending = false;
  }
};

const reloadData = async () => {
  try {
    const response = await fetchInvitation(invitationId);

    invitationData.value = response;
    guests.value = response.guests;
    packageId.value = response.order.package_id;
  } catch (error) {
    console.error("Failed to fetch invitation data:", error);
    console.error("Failed to fetch invitation data:", error.validationErrors);
  }
};

const handleFormSuccess = async (message) => {
  emit("success", message);
  await reloadData();
  ui.editingGuest = null;
};

const handleFormError = (message) => {
  emit("error", message);
};

const handleFormCancel = () => {
  ui.showForm = false;
  ui.editingGuest = null;
};

// Ref for guest form component
const guestFormRef = ref(null);

const scrollToForm = () => {
  nextTick(() => {
    if (guestFormRef.value) {
      guestFormRef.value.$el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });
};

const handleEdit = (guest) => {
  ui.editingGuest = guest;
  ui.showForm = true;
  scrollToForm();
};

const handleDelete = async () => {
  await fetchData();
};

const toggleForm = () => {
  if (!ui.showForm && !ui.editingGuest && isGuestLimitReached.value) {
    emit(
      "error",
      `Batas maksimal tamu untuk paket Anda adalah ${maxGuests.value} tamu.`
    );
    return;
  }

  if (ui.showForm) {
    ui.editingGuest = null;
  } else {
    ui.showForm = !ui.showForm;
    scrollToForm();
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <UserInvitationDetailGuestSkeletonLoading v-if="ui.pending" />

    <div v-else class="space-y-6">
      <div
        class="p-6 md:p-8 bg-off-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
      >
        <!-- Stats -->
        <UserInvitationDetailGuestStatsCard :guests="guests" />

        <!-- Add/Edit Form Toggle Button -->
        <button
          @click="toggleForm"
          :disabled="!ui.showForm && !ui.editingGuest && isGuestLimitReached"
          :class="[
            'w-full px-6 py-3 font-semibold rounded-2xl shadow-lg transition-all duration-300',
            !ui.showForm && !ui.editingGuest && isGuestLimitReached
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transform hover:scale-105',
          ]"
        >
          <i :class="ui.showForm ? 'bi bi-x-lg' : 'bi bi-plus-lg'"></i>
          {{ ui.showForm ? "Batal" : "Tambah Tamu" }}
        </button>
      </div>

      <!-- Guest Form Component -->
      <UserInvitationDetailGuestForm
        ref="guestFormRef"
        v-model:show-form="ui.showForm"
        :invitation-id="invitationId"
        :editing-guest="ui.editingGuest"
        :max-guests="maxGuests"
        :current-guest-count="guests.length"
        @success="handleFormSuccess"
        @error="handleFormError"
        @cancel="handleFormCancel"
      />

      <!-- Guest List Component -->
      <UserInvitationDetailGuestList
        :guests="guests"
        :invitation-slug="invitationData.slug"
        :max-guests="maxGuests"
        @edit="handleEdit"
        @delete="handleDelete"
        @success="(msg) => emit('success', msg)"
        @error="(msg) => emit('error', msg)"
      />
    </div>
  </div>
</template>
