import axios from "axios";

const url = "http://localhost:5000/";

class Services {
  static getPosts() {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url);
        const data = res.data;
        console.log("data : ", res);
        resolve(
          data.map((post) => ({
            ...post,
            createdAt: new Date(post.createdAt),
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static createPost(data) {
    return axios.post(url, data);
  }

  static deletePost(id) {
    return axios.delete(`${url}${id}`);
  }

  static updatePost(prev, data) {
    return axios.put(`${url}${data.id}`, { prev, data });
  }
}

export default Services;
