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
  alert: {
    show: false,
    type: "success",
    message: "",
  },
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

const showAlert = (type, message) => {
  ui.alert.type = type;
  ui.alert.message = message;
  ui.alert.show = true;
};

const closeAlert = () => {
  ui.alert.show = false;
};

const handleFormSuccess = async (message) => {
  emit("success", message);
  showAlert("success", message);
  ui.editingGuest = null;
  await reloadData();
};

const handleFormError = (message) => {
  emit("error", message);
  showAlert("error", message);
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
  await reloadData();
};

const toggleForm = () => {
  if (!ui.showForm && !ui.editingGuest && isGuestLimitReached.value) {
    showAlert(
      "warning",
      `Batas maksimal tamu untuk paket Anda adalah ${maxGuests.value} tamu.`
    );
    return;
  }

  if (ui.showForm) {
    ui.editingGuest = null;
    ui.showForm = !ui.showForm;
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
  <div class="px-4 md:px-6">
    <!-- Alert Notification -->
    <FormAlertNotification
      :show="ui.alert.show"
      :type="ui.alert.type"
      :message="ui.alert.message"
      position="top-center"
      @close="closeAlert"
    />

    <UserInvitationDetailGuestSkeletonLoading v-if="ui.pending" />

    <div v-else class="space-y-4 md:space-y-6">
      <!-- Stats & Add Button Card -->
      <div class="space-y-4 md:space-y-6">
        <!-- Stats -->
        <UserInvitationDetailGuestStatsCard :guests="guests" />

        <!-- Add/Edit Form Toggle Button -->
        <button
          @click="toggleForm"
          :disabled="!ui.showForm && !ui.editingGuest && isGuestLimitReached"
          class="w-full h-12 rounded-2xl font-semibold shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          :class="[
            !ui.showForm && !ui.editingGuest && isGuestLimitReached
              ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25',
          ]"
        >
          <i
            :class="ui.showForm ? 'bi-x-lg' : 'bi-plus-lg'"
            class="text-lg"
          ></i>
          <span>{{ ui.showForm ? "Batal" : "Tambah Tamu" }}</span>
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
        @success="(msg) => showAlert('success', msg)"
        @error="(msg) => showAlert('error', msg)"
      />
    </div>
  </div>
</template>
