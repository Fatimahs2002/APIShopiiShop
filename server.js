
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const itemRoutes = require('./routes/itemRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const CategoryInStore = require('./routes/CategoryInStoreRoute');
const storeRoutes = require('./routes/storeRoutes');

const { app, server, io } = require('./io');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://shopiishop.web.app');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(cookieParser());


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
