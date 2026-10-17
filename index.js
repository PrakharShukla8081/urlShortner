const express = require("express");
const path = require('path')
const cookieParser = require("cookie-parser")
const { connectToMongoDB } = require("./connect");
const {restrictToLogedinUserOnly,checkAuth} = require("./middlewares/auth")


const staticRoute = require('./routes/staticRouter')
const urlRoutes = require("./routes/url");
const userRoute = require('./routes/user')



const URL = require("./models/url");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());

app.set("view engine", "ejs");
app.set('views',path.resolve('./views'))





app.use("/url",restrictToLogedinUserOnly, urlRoutes);

app.use("/",checkAuth,staticRoute)

app.use('/user',userRoute)




app.get("/:shortId", async (req, res) => {
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId: req.params.shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true },
    );
    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Failed to redirect short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on Port no: ${PORT}`);
});
