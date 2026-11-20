require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT is missing. Please define PORT in your .env file.");
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});