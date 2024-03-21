<!-- <template>
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
      <label for="image-size">Number of squares?</label>
      <input
        type="number"
        name="image-size"
        required
        v-model="formData.imageSizeWidth"
      />
      <small>
        The image will be a sqaure, so if you set to 10 here your image will
        take up 10 sqaures, you will be charged £1 per square.
      </small>
    </div>
    <div class="upload-modal__buttons">
      <button class="button secondary-button" @click="$emit('closeModal')">
        Cancel
      </button>
      <button class="button primary-button" @click.prevent="handleFormSubmit">
        Submit
      </button>
    </div>
  </form>
</template> -->
