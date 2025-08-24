<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-gray-100">
    <body class="h-full">
    ```
  -->
  <div class="">
    <Disclosure as="nav" class="bg-green-800" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <div class="hidden md:block">
              <div class="flex items-baseline space-x-4">
                <NuxtLink
                  v-for="item in navigation"
                  :key="item.key"
                  :to="{ path: '/', hash: item.hash }"
                  :class="[
                    'text-gray-300 hover:bg-white/5 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium',
                  ]"
                  >{{ item.name }}</NuxtLink
                >
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <!-- Profile dropdown -->
              <div class="header flex items-center p-4 text-white">
                <!-- If user is logged in -->
                <div v-if="user" class="flex items-center gap-6">
                  <NuxtLink class="py-1 px-2 hover:bg-white/5 hover:rounded" to="/profile">Profile</NuxtLink>
                  <NuxtLink class="py-1 px-2 hover:bg-white/5 hover:rounded" to="myReservations">My reservations</NuxtLink>
                  <button class="py-1 px-2 hover:bg-white/5 hover:rounded" @click="signOut()">
                    Log out
                  </button>
                </div>

                <!-- If user is NOT logged in -->
                <div v-else class="flex gap-2">
                  <button
                    @click="navigateTo('/login')"
                    class="transition duration-300 ml-6 px-2 py-1 hover:bg-white/5 hover:rounded"
                  >
                    Log in
                  </button>
                  <button
                    @click="navigateTo('/register')"
                    class="transition duration-300 ml-6 px-2 py-1 hover:bg-white/5 hover:rounded"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="-mr-2 flex md:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
              <XMarkIcon v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="md:hidden">
        <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <RouterLink
            v-for="item in navigation"
            :key="item.key"
            :to="{ path: '/', hash: item.hash }"
            :class="[
              'text-gray-300 hover:bg-white/5 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',
            ]"
            
            >{{ item.name }}</RouterLink
          >
        </div>
        <div v-if="user" class="px-4 pt-2 pb-3 sm:px-3 border-t border-white/10 pt-4">
          <NuxtLink to="/profile" class="'text-gray-300 hover:bg-white/5 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',">Profil</NuxtLink>
          <NuxtLink to="/myReservations" class="'text-gray-300 hover:bg-white/5 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',">Moje rezervace</NuxtLink>
        </div>
        <div class="border-t border-white/10 pt-4 pb-3">
          <div v-if="user" class="flex items-center px-5">
            <div class="ml-3">
              
              <div class="text-sm font-medium text-gray-400">
                {{ user.email }} 
              </div>
            </div>
            <IconLogout
              type="button"
              @click="signOut()"
              class="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
            </IconLogout>
          </div>

          <div v-else class="px-4 flex justify-end">
            <button
                    @click="navigateTo('/login')"
                    class="transition duration-300 ml-6 px-2 py-1 hover:bg-white/5 hover:rounded"
                  >
                    Log in
                  </button>
                  <button
                    @click="navigateTo('/register')"
                    class="transition duration-300 ml-2 px-2 py-1 hover:bg-white/5 hover:rounded"
                  >
                    Register
                  </button>
          </div>
          
        </div>
      </DisclosurePanel>
    </Disclosure>

  </div>
</template>

<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import IconLogout from "./IconLogout.vue";

const user = useSupabaseUser();

const signOut = async () => {
  const { error } = await useSupabaseClient().auth.signOut();
  if (error) {
    console.error("Sign out error:", error);
  } else {
    navigateTo("/login");
  }
};


const navigation = [
  { name: "About", to: '/', hash: '', key: 'index' },
  { name: "Massages", to: "/", hash: '#menu', key: 'massages' },
  { name: "Reservations", to: "/", hash: '#rezervace', key: 'reservations' },
  { name: "Contacts", to: "/", hash: '#about', key: 'contacts'},
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

</script>