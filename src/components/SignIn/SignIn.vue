<template>
  <section class="header">
    <article class="header__logo">
      <img src="/logo.png" alt="cute butts" class="header__logo" />
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
  margin-bottom: 1rem;
}

button + button {
  margin-left: 0.5rem;
}

.header__buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.header .button {
  padding: 0.35rem;
  min-width: 3.5rem;
  font-size: 0.8rem;
}

.header__logo {
  height: 75px;
  width: 200px;
}
</style>
