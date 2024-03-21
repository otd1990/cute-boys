<template>
  <section class="header">
    <article class="header__logo">
      <img src="/header__logo.png" alt="cute boys logo" />
    </article>
    <article class="header__buttons">
      <button
        v-if="!isLoggedIn"
        @click="$emit('showSignin')"
        class="button secondary-button-alt"
      >
        Sign In
      </button>

      <button
        v-if="!isLoggedIn"
        class="button primary-button-alt"
        @click="$emit('signUp', 'signup')"
      >
        Sign Up
      </button>

      <button
        v-if="isLoggedIn"
        @click="signOut"
        class="button secondary-button"
      >
        Sign Out
      </button>
    </article>
  </section>
</template>

<script setup lang="ts">
import { supabase } from "../../supabase";

const emit = defineEmits(["showSignin", "signUp", "signOut"]);
defineProps(["isLoggedIn"]);

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error("Error");

    sessionStorage.removeItem("user");

    emit("signOut");
  } catch (error: any) {
    console.log(error);
  }
}
</script>

<style>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.5rem 1rem;

  background-color: #2c3333;
  min-height: 2.5rem;
}

button + button {
  margin-left: 1rem;
}

.header__buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.header .button {
  padding: 0.5rem 0.75rem;
  min-width: 5.5rem;
  font-size: 0.9rem;
}

.header__logo img {
  height: 50px;
  width: 44px;
  display: block;
}
</style>
