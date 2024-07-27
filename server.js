// const express = require("express");
const mongoose = require('mongoose');
// const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require('./routes/itemRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const CategoryInStore = require('./routes/CategoryInStoreRoute');
const storeRoutes = require('./routes/storeRoutes');
// const app = express();
const { app, server, io } = require('./io');


// app.use(cors());
// app.use(express.json());

// Assuming you have defined your controller function in a separate file
// const { updateUser } = require('./controllers/userController');

// Route to handle updating user
// app.put("/users/update", updateUser);
app.use("/users", userRoutes);
app.use("/items",itemRoutes)
app.use("/sections",sectionRoutes)
app.use("/categories",categoryRoutes)
app.use("/CategoryInStore",CategoryInStore);
app.use("/stores",storeRoutes)
const PORT = process.env.PORT || 5000;
const MONGOOSE_URL = "mongodb+srv://adelftouni:GxVURilGvo47QzAG@cluster0.h4a0cqm.mongodb.net/starter";

mongoose.connect(MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
