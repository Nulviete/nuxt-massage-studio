<script setup lang="ts">

const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const name = ref('');
const phone = ref('');
const address = ref('');
const errorMessage = ref("");

const signUp = async () => {
  const meta = {
    name: name.value,
    phone: phone.value,
    address: address.value,
  }
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: meta,
    }
  });
  if (error) {
    errorMessage.value = error.message;
  }
  if (data) navigateTo("/");
};
</script>
<template>
  <div>
    <!--
  This example requires updating your template:

  ```
  <html class="h-full bg-white">
  <body class="h-full">
  ```
-->
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
          class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
        >
          Register a new account
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="signUp()" class="space-y-6">
          <div>
            <label for="name" class="block text-sm/6 font-medium text-gray-900"
              >Name <span class="text-red-600">*</span></label
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
            <label for="email" class="block text-sm/6 font-medium text-gray-900"
              >Email address <span class="text-red-600">*</span></label
            >
            <div class="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                v-model="email"
                required
                autocomplete="email"
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
                autocomplete="address"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm/6 font-medium text-gray-900"
                >Password <span class="text-red-600">*</span></label
              >
              
            </div>
            <div class="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                v-model="password"
                required
                autocomplete="current-password"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
            <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-green-700 duration-200 hover:bg-green-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register account
            </button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?
          <NuxtLink
            to="/login"
            class="font-semibold text-indigo-600 hover:text-indigo-500"
            >Log in here</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
