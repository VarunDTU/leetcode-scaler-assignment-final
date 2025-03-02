const axios = require("axios");
let data = JSON.stringify({
  messages: "my name is alice",
  user_id: "str",
  problem_slug: "longest-substring-without-repeating-characters",
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "http://127.0.0.1:8000/chat",
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
