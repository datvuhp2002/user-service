const app = require("./src/app");
const port = process.env.PORT || 3056;

const server = app.listen(port, () => {
  console.log(`Hello at`, port);
});
