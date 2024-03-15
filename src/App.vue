<template>
  <main>
    <SignIn
      @signUp="handleSignup"
      @showSignin="handleGridSquareClicked"
      @signOut="handleSignOut"
      :isLoggedIn="userLoggedIn"
    />
    <article class="container">
      <section class="intro">
        <h1 class="hero__heading">Cute Butts</h1>
        <p>The cutest butts on the internet</p>
      </section>
      <section class="grid-container">
        <GridSquare
          v-for="n in visibleSquares"
          :key="n"
          :square-no="n"
          :images="imagesFromDB"
          @gridSquareClicked="handleGridSquareClicked"
        />
      </section>
    </article>
    <UploadModal
      v-if="showModal"
      :square-no="clickedSquare"
      :modal-type="modalType"
      @closeModal="handleModalClose"
    />
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { supabase } from "./supabase";
import GridSquare from "./components/GridSquare/GridSquare.vue";
import UploadModal from "./components/UploadModal/UploadModal.vue";
import SignIn from "./components/Signin/SignIn.vue";

const visibleSquares: any = ref([]);
const currentPage: any = ref(1);
const showModal = ref(false);
const imagesFromDB: any = ref([]);
const clickedSquare = ref();
const usedSquares = ref(0);
const userLoggedIn = ref(false);
let modalType = "";

const squareSize = 10;
const squaresPerRow = Math.floor(window.innerWidth / squareSize);
// const totalSquares = 1000000;
const totalSquares = 1000000 - usedSquares.value;

const calculateVisibleSquares = () => {
  const viewportHeight = window.innerHeight;
  const rowsNeeded = Math.ceil(viewportHeight / squareSize);
  const totalVisibleSquares = rowsNeeded * squaresPerRow;

  const newVisibleSquares = Array.from(
    { length: Math.min(totalVisibleSquares, totalSquares) },
    (_, index) => index + (currentPage.value - 1) * totalVisibleSquares
  );

  visibleSquares.value = [...visibleSquares.value, ...newVisibleSquares];
  currentPage.value++;
};

const handleScroll = () => {
  if (window.innerHeight + window.scrollY == document.body.offsetHeight) {
    calculateVisibleSquares();
  }
};

const isLoggedIn = () => {
  if (sessionStorage.getItem("user")) {
    return true;
  } else {
    return false;
  }
};

const handleGridSquareClicked = (squareNo: number) => {
  if (!isLoggedIn()) {
    modalType = "login";
  } else {
    modalType = "upload";
  }

  clickedSquare.value = squareNo;
  showModal.value = true;
};

const handleModalClose = (logInSuccess) => {
  fetchImages();
  //update squares used
  showModal.value = false;
  modalType = "";

  if (logInSuccess) {
    userLoggedIn.value = true;
  }
};

const handleSignOut = () => {
  userLoggedIn.value = false;
};

const handleSignup = (type: string) => {
  modalType = type;
  showModal.value = true;
};

const fetchImages = async () => {
  try {
    const { error, data } = await supabase.from("Images").select("*");

    if (error) throw error;

    usedSquares.value = data.length;

    imagesFromDB.value = data.reduce((acc, image) => {
      acc[image.squareNo] = image;
      return acc;
    }, {});
  } catch (error) {
    console.log("Error fetching");
  }
};

onMounted(() => {
  calculateVisibleSquares();
  fetchImages();

  userLoggedIn.value = sessionStorage.getItem("user") ? true : false;
  console.log("User logged in ", userLoggedIn.value);

  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style>
.container {
  margin: 0 2rem;
  padding: 0 1rem;
}
.intro {
  text-align: center;
}

.hero__heading {
  font-family: "Dancing Script", cursive;
  margin: 0;
  font-size: 4rem;
  background: linear-gradient(
    55deg,
    rgba(120, 21, 245, 1) 0%,
    rgba(200, 42, 246, 1) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.6rem;
  transform: rotate(-10deg);

  margin: 0.5rem auto 1.5rem auto;
  max-width: fit-content;
}

.intro p {
  margin: 0;
  margin-bottom: 1rem;
}
</style>
