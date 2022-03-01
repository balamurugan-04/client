<template>

  <div>
    <h1>Justice League</h1>
    <div class="create-post">
      <input type="text" id="create-post" v-model="text" />
      <button :disabled="loading" v-on:click="createPost">Add Member</button>
    </div>
    <hr />
    <p class="error" v-if="error">{{ error }}</p>
    <cube-spin class="spinner" v-if="loading"></cube-spin>
    <div v-else class="posts-container">
        <div class="post" v-for="(post) in posts" :key="post._id" >
            <member-list></member-list>
        </div>
      
    </div>
  </div>
</template>

<script>
import Services from "./Services";
import CubeSpin from 'vue-loading-spinner/src/components/RotateSquare';

export default {
  components: {
      CubeSpin
  },
  data() {
    return {
      posts: [],
      error: "",
      text: "",
      prevData: "",
      tempValue: null,
      editing: false,
      newIndex: null,
      loading: true
    };
  },

  async created() {
    try {
      console.log("got in");
      this.posts = await Services.getPosts();
      this.loading = !this.loading
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    async createPost() {
      this.loading = !this.loading
      await Services.createPost(this.text);
      this.posts = await Services.getPosts();
      this.loading = !this.loading
      this.text = "";
    }
  }
};


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.container {
  max-width: 800px;
  margin: 0 auto;
}

p.error {
  border: 1px solid #ff5b5f;
  background-color: #ffc5c1;
  padding: 10px;
  margin-bottom: 15px;
}

div.post {
  position: relative;
  border: 1px solid #5bd658;
  background-color: #bcffb8;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

div.created-at {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px 15px 5px 15px;
  background-color: darkgreen;
  color: white;
  font-size: 13px;
}

p.text {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 0;
}

input {
   width: 12rem;
  height: 2rem;
}

button {
  font: inherit;
  border: 1px solid #5bd658;
  background-color: #00a876;
  color: white;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin: 1rem;
  width: 12rem;
  cursor: pointer;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26);
}

button:disabled,
button[disabled]{
  cursor: not-allowed;
  pointer-events: none;
  color: #e4e4e4;
  background-color: #4d4b4b;
  border-color: #4d4b4b;
}

input:focus, button:focus {
  outline: none;
}

button:hover,
button:active {
  background-color: #00a876;
  border-color: #5bd658;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
} 

.delete, .delete:hover {
  background-color: #ee2b2d;
  border-color: #ec1316;
}

.edit, .edit:hover, .update, .update:hover {
  background-color: #ffc107;
  border-color: #ecc213;
}

.button-container {
    /* position: relative; */
    /* right: 0px; */
    /* float: right;
    position: relative;
    bottom: 50px; */
}

.btn {
  opacity: 0.2;
}
.btn:hover {
  opacity: 1;
  transition: opacity 1s;
} 

.posts-container {
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  justify-content: space-evenly;
}

.post {
  width: 25%;
  margin: 20px;
}

.spinner {
    width: 60px!important;
    height: 60px!important;
    position: relative;
    top: 100px;
}

</style>
