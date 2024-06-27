<template>
  <article class="upload-modal">
    <section class="upload-modal__inner">
      <div class="upload-modal__header">
        <h2>
          {{ modalType === "upload" ? "Upload an image" : "Sign in / Sign up" }}
        </h2>
      </div>
      <div class="upload-modal__body">
        <div v-if="modalType === 'upload'">
          <form class="upload-modal__form">
            <div class="form-group">
              <label for="image-upload">Image:</label>
              <input
                type="file"
                accept="image/*"
                image="imageUpload"
                required
                name="image-upload"
                @change="handleFileChange"
              />
            </div>
            <div class="form-group">
              <label for="image-size"
                >Number of squares? selected number
                {{ formData.squareImagesUses }}</label
              >
              <input
                type="number"
                name="image-size"
                required
                v-model="formData.squareImagesUses"
              />
              <!-- <input
                type="number"
                name="image-size"
                required
                v-model="formData.imageSizeWidth"
              /> -->

              <small>
                The image will be a sqaure, so if you set to 10 here your image
                will take up 10 sqaures, you will be charged £1 per square.
              </small>
            </div>
            <div class="upload-modal__buttons">
              <button
                class="button secondary-button"
                @click="$emit('closeModal')"
              >
                Cancel
              </button>
              <button
                class="button primary-button"
                @click.prevent="handleFormSubmit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div v-else>
          <form @submit.prevent="handleUserAction">
            <div>
              <label for="email">Email</label>
              <input id="email" type="email" v-model="email" />
            </div>
            <div>
              <label for="password">Password</label>
              <input id="password" type="password" v-model="password" />
            </div>
            <div class="upload-modal__buttons">
              <button
                class="button secondary-button"
                @click="$emit('closeModal')"
              >
                Cancel
              </button>
              <button type="submit" class="button primary-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "../../supabase";

interface IUploadModalProps {
  squareNo?: number;
  modalType?: "login" | "upload";
}

const props = withDefaults(defineProps<IUploadModalProps>(), {
  squareNo: 1,
  modalType: "login",
});

const emit = defineEmits(["closeModal"]);

const email = ref("");
const password = ref("");

const formData = ref({
  squareNo: props.squareNo,
  imageName: "",
  imageSizeWidth: props.squareNo * 48,
  squareImagesUses: 1,
});

// @ts-ignore
const config = import.meta.env;

const handleFormSubmit = async () => {
  console.log("Submittin");

  console.log(formData.value);

  if (formData.value.imageName === "") {
    alert("Please upload an image");
    return;
  }

  try {
    const { error } = await supabase.from("Images").insert(formData.value);

    if (error) throw error;

    emit("closeModal");
  } catch (error) {
    console.error(error);
  }
};

const handleFileChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];

  console.log("File input ", fileInput);
  console.log("File ", file);

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      console.log("img src ", img.src);

      img.onload = () => {
        console.log("onload");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const newWidth = formData.value.imageSizeWidth;
        const newHeight = formData.value.imageSizeWidth;

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob((blob: any) => {
          const resizedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          createImageURL(resizedFile);
        }, "image/jpeg");
      };
    };

    reader.readAsDataURL(file);
  }
};

const createImageURL = async (resizeFile: any) => {
  const file = resizeFile;
  const uploadURL = `${config.VITE_SUPABASE_URL}/storage/v1/object/public/images/public/cute-boys`;

  console.log("Creating image from file ", file);

  try {
    if (!resizeFile || resizeFile.length === 0) {
      throw new Error("You must select an image to upload.");
    }
    const fileName = `${file.name}`;
    const filePath = `${fileName}`;

    console.log("FILES ", file);

    let resp = await supabase.storage
      .from("images/public/cute-boys")
      .upload(filePath, file);

    console.log(resp);

    if (resp.error) throw resp.error;

    formData.value.imageName = `${uploadURL}/${fileName}?width=${formData.value.imageSizeWidth}&height=${formData.value.imageSizeWidth}`;
  } catch (error: any) {
    alert(error.message);
  }
};

const handleSignin = async () => {
  try {
    // Use the Supabase provided method to handle the signin
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;

    sessionStorage.setItem("user", "true");

    emit("closeModal", true);
  } catch (error) {
    console.log("Error sigining in");
  }
};

const handleSignup = async () => {
  try {
    // Use the Supabase provided method to handle the signup
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    emit("closeModal");
  } catch (error) {
    console.error("Error signing UP");
  }
};

const handleUserAction = () => {
  if (props.modalType === "login") {
    handleSignin();
  } else {
    handleSignup();
  }
};
</script>

<style src="./upload-modal.css" scoped></style>
