const express = require('express');
const mongoose = require('mongoose');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', categoryRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Category service running on port ${PORT}`);
});