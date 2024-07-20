const app = require("./app");

const PORT = process.env.PORT;

//listen server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});