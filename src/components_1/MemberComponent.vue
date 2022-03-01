<template>
    <div>
      <div v-if="!editing" v-bind:key="post._id">
        <p class='text'>{{post.title}}</p>
      </div>
      <div v-else-if="editing && (index !== newIndex)" v-bind:key="post._id">
        <p class='text' >{{post.title}}</p>
      </div>
      <div v-if="editing && (index == newIndex)" v-bind:key="post._id">
        <input v-model="post.title" class="input"/>
        <button class="cancel" @click="disableEditing"> Cancel </button>
        <button class="update" @click="saveEdit(index)"> Update </button>
      </div>
      <div class="button-container">
        <button :disabled="editing" class="delete btn"
        v-on:click="deletePost(post._id)">Delete</button>
        <button :disabled="editing" class="edit btn" @click="enableEditing(index)">Edit</button>
      </div>
    </div>

</template>

<script>
import Services from "../Services.js";

export default {
  data() {
    return {
      posts: [],
      error: "",
      text: "",
      prevData: "",
      tempValue: null,
      editing: false,
      newIndex: null,
      loading: true,
      rating: ''
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
    },
    async deletePost(id) {
      console.log("deletepo : ", id);
      this.loading = !this.loading
      await Services.deletePost(id);
      this.posts = await Services.getPosts();
      this.loading = !this.loading
    },
    enableEditing: function (index) {
      this.newIndex = index;
      this.prevData = this.posts[index].title;
      this.tempValue = this.posts[index];
      this.editing = true;
    },
    disableEditing: function () {
      this.tempValue = null;
      this.editing = false;
    },
    saveEdit: async function (index) {
      this.loading = !this.loading
      this.posts[index] = this.tempValue;
      console.log("vue update check : ", this.prevData)
      await Services.updatePost(this.prevData, this.posts[index]);
      this.posts = await Services.getPosts();
      this.loading = !this.loading
      this.disableEditing();
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
