'use strict';

const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const Categories = require('./routes/categories');
const CategoriesAPI = require('./api/categories-api');
const Products = require('./routes/products');
const ProductsAPI = require('./api/products-api');
const UserAPI = require('./api/user-api');

const app = express();
const session = require('express-session');
const flash = require('express-flash');
const CategoryService = require('./services/category-service');
const ProductService = require('./services/product-service');
const UserService = require('./services/user-service');
const pgp = require('pg-promise')();

const DATABASE_URL= process.env.DATABASE_URL || "postgres://postgres:pg123@psql:5432/my_products";

const config = { 
	connectionString : DATABASE_URL
}

if (process.env.NODE_ENV == 'production') {
	config.ssl = { 
		rejectUnauthorized : false
	}
}

const db = pgp(config);

// let useSSL = false;
// let local = process.env.LOCAL || false;
// if (process.env.DATABASE_URL && !local){
//     useSSL = true;
// }
// const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/my_products_list';

// const db = pgp(connectionString);

const categoryService = CategoryService(db);
const productService = ProductService(db);
const userService = UserService(db);

const categoryRoutes = Categories(categoryService);
const productRoutes = Products(productService, categoryService);

const categoryAPI = CategoriesAPI(categoryService);
const productsAPI = ProductsAPI(productService);
const userAPI = UserAPI(userService);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
   
//setup template handlebars as the template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

//setup middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

//setup the handlers
app.get('/categories', categoryRoutes.show);
app.get('/categories/add', categoryRoutes.showAdd);
app.get('/categories/edit/:id', categoryRoutes.get);
app.post('/categories/update/:id', categoryRoutes.update);
app.post('/categories/add', categoryRoutes.add);
//this should be a post but this is only an illustration of CRUD - not on good practices
app.get('/categories/delete/:id', categoryRoutes.delete);

app.get('/', productRoutes.show);
app.get('/products', productRoutes.show);
app.get('/products/edit/:id', productRoutes.get);
app.post('/products/update/:id', productRoutes.update);
app.get('/products/add', productRoutes.showAdd);
app.post('/products/add', productRoutes.add);
//this should be a post but this is only an illustration of CRUD - not on good practices
app.get('/products/delete/:id', productRoutes.delete);

app.get('/api/products', productsAPI.all);
app.post('/api/products', productsAPI.add);

app.get('/api/categories', categoryAPI.all);

app.get('/api/users', userAPI.user);
app.post('/api/signUp', userAPI.signUp);
app.post('/api/login', userAPI.login);

app.use(errorHandler);


//configure the port number using and environment number
var portNumber = process.env.PORT || 3000;
var hostname = '0.0.0.0';

//start everything up
app.listen(portNumber,hostname, function () {
    console.log('Create, Read, Update, and Delete (CRUD) example server listening on:', portNumber);
});
