const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', userRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});