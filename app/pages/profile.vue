<template>
  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm px-6">
    <form v-if="user" @submit.prevent="signUp()" class="space-y-6 mb-24">
      <div class="border-b pb-6 text-black border-gray-500">Údaje</div>
      <div>
        <label for="name" class="block text-sm/6 font-medium text-gray-900"
          >Name</label
        >
        <div class="mt-2">
          <input
            id="name"
            type="name"
            name="name"
            v-model="name"
            required
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>

      <div>
        <label for="phone" class="block text-sm/6 font-medium text-gray-900"
          >Phone</label
        >
        <div class="mt-2">
          <input
            id="phone"
            type="phone"
            name="phone"
            v-model="phone"
            required
            autocomplete="phone"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
      <div>
        <label for="address" class="block text-sm/6 font-medium text-gray-900"
          >Address</label
        >
        <div class="mt-2">
          <input
            id="address"
            type="address"
            name="address"
            v-model="address"
            required
            autocomplete="address"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
        <p v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </p>
      </div>

      <div>
        <button
          type="submit"
          class="mt-10 flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs bg-green-700 duration-200 hover:bg-green-600 tra focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Update user
        </button>
      </div>
    </form>
    <div v-else>User loading...</div>
  </div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const name = ref(user.value.user_metadata.name);
const phone = ref(user.value.user_metadata.phone || "");
const address = ref(user.value.user_metadata.address || "");
const errorMessage = ref("");

const updating = ref(false);

const signUp = async () => {
  errorMessage.value = "";
  updating.value = true;
  try {
    await $fetch("/api/user", {
      method: "PUT",
      body: {
        name: name.value,
        phone: phone.value,
        address: address.value,
      },
    });

    // Refresh lokálního uživatele, ať se hned projeví změny v UI:
    const { data, error } = await supabase.auth.getUser();

    if (!error && data?.user) {
      // přepíšeme reaktivní user ref
      // @ts-ignore - useSupabaseUser() vrací Ref<User|null>
      user.value = data.user;
    }
  } catch (e: any) {
    errorMessage.value =
      e?.data?.statusMessage || e?.message || "Update failed";
  } finally {
    alert('User details have been updated.')
    updating.value = false;
  }
};
</script>

<style>
</style>