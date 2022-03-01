<template>

  <div>
    <h1 class="mainHeader">Justice League</h1>
    <form @submit.prevent="createPost" class="create-post">
      <label class="text" for="title">Name: </label>
      <input type="text" id="title" v-model="obj.title" required />
      <label class="text" for="alias"> Alias: </label>
      <input type="text" id="alias" v-model="obj.alias" required />
      <label class="text" for="city"> City: </label>
      <input type="text" id="city" v-model="obj.city" required />
      <label class="text" for="dob"> DOB: </label>
      <input type="date" id="dob" v-model="obj.dob" required />
      <label class="text" for="rating"> Rating: </label>
      <input type="number" id="rating" min="0" max="5" onkeyup="if((this.value > 5) || (this.value < 0)) this.value = null;" v-model="obj.rating" required />
      <button type="submit" class="addMemberBtn" :disabled="loading">Add Member</button>
    </form>
    <hr />
    <p class="error" v-if="error">{{ error }}</p>
    <cube-spin class="spinner" v-if="loading"></cube-spin>
    <div v-else class="posts-container">
      <div
        class="post"
        v-for="(post, index) in posts"
        :key="post._id"
      >
        <div v-if="!editing" v-bind:key="post._id">
          <p class='text'><span class='text'>Name: </span>{{post.title}}</p>
          <p class='text' ><span class='text'>Alias: </span>{{post.alias}}</p>
          <p class='text' ><span class='text'>City: </span>{{post.city}}</p>
          <p class='text' ><span class='text'>Dob: </span>{{post.dob}}</p>
          <vue3-star-ratings v-model="post.rating" :starSize='20' :disableClick='true' :showControl='false'></vue3-star-ratings>
        </div>
        <div v-else-if="editing && (index !== newIndex)" v-bind:key="post._id">
          <p class='text' ><span class='text'>Name: </span>{{post.title}}</p>
          <p class='text' ><span class='text'>Alias: </span>{{post.alias}}</p>
          <p class='text' ><span class='text'>City: </span>{{post.city}}</p>
          <p class='text' ><span class='text'>Dob: </span>{{post.dob}}</p>
          <vue3-star-ratings v-model="post.rating" :starSize='20' :disableClick='true' :showControl='false'></vue3-star-ratings>
        </div>
        <div v-if="editing && (index == newIndex)" v-bind:key="post._id">
          <input v-model="post.title" class="input editInput"/>
          <input v-model="post.alias" class="input editInput"/>
          <input v-model="post.city" class="input editInput"/>
          <input v-model="post.dob" class="input editInput" type="date"/>
          <vue3-star-ratings v-model="post.rating" :starSize='20' :disableClick='false' :showControl='true'></vue3-star-ratings>
          <button class="cancel" @click="disableEditing"> Cancel </button>
          <button class="update" @click="saveEdit(index)"> Update </button>
        </div>
        <div class="button-container">
          <button :disabled="editing" class="delete btn"
          v-on:click="deletePost(post._id)">Delete</button>
          <button :disabled="editing" class="edit btn" @click="enableEditing(index)">Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Services from "../Services.js";
import CubeSpin from 'vue-loading-spinner/src/components/RotateSquare';

export default {
  components: {
      CubeSpin
  },
  name: "Component",
  data() {
    return {
      posts: [],
      error: "",
      obj: {},
      text: "",
      prevData: "",
      tempValue: null,
      editing: false,
      newIndex: null,
      loading: true,
    };
  },

  async created() {
    try {
      this.posts = await Services.getPosts();
      this.loading = !this.loading
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {
    async createPost() {
      let payload = JSON.parse(JSON.stringify(this.obj))
      // if(Object.keys(payload).length !== 0 && payload.constructor === Object) {
      //   console.log("payload  : ", payload)
      // }
      this.loading = !this.loading
      await Services.createPost(payload);
      this.posts = await Services.getPosts();
      this.loading = !this.loading
      this.obj = {};
    },
    async deletePost(id) {
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
    disableEditing: async function () {
      this.loading = !this.loading
      this.tempValue = null;
      this.editing = false;
      this.posts = await Services.getPosts();
      this.loading = !this.loading
    },
    saveEdit: async function (index) {
      this.loading = !this.loading
      this.posts[index] = this.tempValue;
      console.log("vue before update : ", this.prevData)
      console.log("vue update check : ", this.posts[index])
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
.mainHeader {
  margin-bottom: 2.5rem;
  margin-top: -2rem;
}

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

label.text ,p.text {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 0;
}

input {
   width: 12rem;
  height: 2rem;
}

.addMemberBtn {
  margin: 2rem;
}

button {
  font: inherit;
  border: 1px solid #5bd658;
  background-color: #00a876;
  color: white;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin: 0.5rem;
  width: 12rem;
  height: 3rem;
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

.vue3-star-ratings__wrapper {
  padding: 0!important;
}

.editInput {
  margin-bottom: 5px;
}

</style>
