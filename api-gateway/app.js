const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { verifyToken, verifyAdmin } = require('./middlewares/auth');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Proxy configuration
const userServiceProxy = createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/',
  },
});

const productServiceProxy = createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/',
  },
});

const categoryServiceProxy = createProxyMiddleware({
  target: process.env.CATEGORY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/categories': '/',
  },
});

// Routes
app.use('/api/users/register', userServiceProxy);
app.use('/api/users/login', userServiceProxy);
app.use('/api/users/profile', verifyToken, userServiceProxy);
app.use('/api/users/addresses', verifyToken, userServiceProxy);

app.use('/api/products', (req, res, next) => {
  if (req.method === 'GET') {
    return productServiceProxy(req, res, next);
  }
  return verifyAdmin(req, res, () => productServiceProxy(req, res, next));
});

app.use('/api/categories', (req, res, next) => {
  if (req.method === 'GET') {
    return categoryServiceProxy(req, res, next);
  }
  return verifyAdmin(req, res, () => categoryServiceProxy(req, res, next));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});