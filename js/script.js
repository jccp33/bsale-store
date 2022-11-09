"use strict";

// ajax function 
function AjaxObject(){
	var xmlhttp=false;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

// root server
const SERVER = "http://bsale-store-x.x10.mx/bsale-back/";

// arrays
let categories = [];
let shopping_cart = [];

// object products 
let products = {
	total: 0,
	pages: 0,
	currentPage: 0,
	items: []
};

// show/hide modal loading
function showModalLoading(){
	let modal = document.getElementById("modal-loading");
	let display = modal.style.display;
	if(display == "none"){
		modal.style.display = "block";
	}else{
		modal.style.display = "none";
	}
}

// add product to cart 
function addToCart(id){
	let product = null;
	for(let i=0; i<products.items.length; i++){
		if(products.items[i].id === id){
			product = products.items[i];
		}
	}
	shopping_cart.push(product);
	document.getElementById("shopping-cart-icon").style.border = "1px solid #c43600";
}

// show shopping cart 
function showShoppingCart(){
	let total = 0;
	let cart_items = document.getElementById("cart-items");
	cart_items.innerHTML = "";
	for(let i=0; i<shopping_cart.length; i++){
		let product = `
		<div>
            <div>
				<div style="font-weight: bold;">${shopping_cart[i].name}</div>
            </div>
            <div>
                <div>$ ${shopping_cart[i].price - shopping_cart[i].discount}</div>
            </div>
        </div>
		`;

		cart_items.innerHTML += product;
		total += shopping_cart[i].price - shopping_cart[i].discount;
	}

	document.getElementById("total-pay").innerHTML = "TOTAL TO PAY: $ " + total;
	document.getElementById("modal-shopping-cart").style.display = "block";
}

// clear shopping cart 
function clearShoppingCart(){
	shopping_cart = [];
	document.getElementById("cart-items").innerHTML = "";
	document.getElementById("total-pay").innerHTML = "TOTAL TO PAY: $ 0";
	document.getElementById("shopping-cart-icon").style.border = "none";
}

// show details of product 
function showDetailsOf(id){
	let product = null;
	for(let i=0; i<products.items.length; i++){
		if(products.items[i].id === id){
			product = products.items[i];
		}
	}

	let category = "";
	categories.forEach(e => {
		if(e.id === product.category){
			category = e.name.toUpperCase();
		}
	});

	let details = `
	<div class="detail-image">
        <img src="${product.url_image}" alt="PRODUCT">
    </div>
	<div class="detail-text">
        ${product.name.toUpperCase()}
    </div>
    <div class="detail-text">
        Price: $ ${product.price}
    </div>
    <div class="detail-text">
        Discount: $ ${product.discount}
	</div>
    <div class="detail-text">
        Category: ${category}
    </div>
    <div class="detail-text">
    	<button class="buy-product" onclick="addToCart(${product.id})">BUY</button>
    </div>
	`;

	document.getElementById("product-details").innerHTML = details;
	document.getElementById("modal-details").style.display = "block";
}

// show current page of products 
function showCurrentPage(){
	let from = products.currentPage * 10;
	let to = 0;
	if(products.currentPage < products.pages){
		to = products.currentPage * 10 + 10;
	}else{
		to = products.total;
	}

	let result = document.getElementById("result");
	result.innerHTML = "";
	let displayed = 0;
	for(let i=from; i<to; i++){
		displayed++;
		let element = products.items[i];
		let category = "";
		categories.forEach(e => {
			if(e.id === element.category){
				category = e.name.toUpperCase();
			}
		});

		let item = `
		<div class="item">
			<div class="item-image">
				<a href="javascript:showDetailsOf(${element.id});">
					<img src="${element.url_image}" alt="PICTURE" title="Show Detail">
				</a>
			</div>
			<div class="description">
				<div style="font-weight: bold;">${element.name.toUpperCase()}</div>
				<div style="color: #c43600;">${category}</div>
				<div>$ ${element.price - element.discount}</div>
			</div>
			<div>
				<button class="buy-product" onclick="addToCart(${element.id})">BUY</button>
			</div>
		</div>
		`;
		result.innerHTML += item;
	}
	let currentPage = products.currentPage + 1;
	let page_label = "Page " + currentPage + " - " + displayed + " Products";
	document.getElementById("page_label").innerHTML = page_label;
}

// go to next page of products 
function showNextPage(){
	if(products.currentPage < products.pages){
		products.currentPage++;
		showCurrentPage();
	}
}

// go to previous page of products 
function showPreviousPage(){
	if(products.currentPage > 0){
		products.currentPage--;
		showCurrentPage();
	}
}

// load all categories from server 
function loadCategories(){
    showModalLoading();
	let ajax = AjaxObject();
	ajax.open("GET", SERVER + "all_categories.php");
	ajax.onreadystatechange=function(){
		if (ajax.readyState==4){
			let array = JSON.parse(ajax.responseText);
			let select = document.getElementById("categories");
			array.forEach(element => {
				let option = document.createElement("option");
				option.value = element.id;
				option.innerText = element.name.toUpperCase();
				select.appendChild(option);
			});
			categories = array;
		}
		showModalLoading();
	}
	ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	ajax.send();
}

// load all products from server 
function loadProducts(){
	showModalLoading();
	let ajax = AjaxObject();
	ajax.open("GET", SERVER + "all_products.php");
	ajax.onreadystatechange=function(){
		if (ajax.readyState==4){
			let array = JSON.parse(ajax.responseText);
			products.total = array.length;
			products.pages = parseInt(array.length / 10);
			products.items = array;

			showCurrentPage();
		}
		showModalLoading();
		document.getElementById("loading-page").style.display = "none";
	}
	ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	ajax.send();
}

// get products by category from server 
function selectByCategory(){
	let categories = document.getElementById("categories");
	if(parseInt(categories.value) === -1){
		location.reload();
	}else{
		showModalLoading();
		let ajax = AjaxObject();
		ajax.open("GET", SERVER + "select_by_category.php?category=" + parseInt(categories.value));
		ajax.onreadystatechange=function(){
			if (ajax.readyState==4){
				let array = JSON.parse(ajax.responseText);
				products.total = array.length;
				products.pages = parseInt(array.length / 10);
				products.items = array;

				showCurrentPage();
			}
			showModalLoading();
		}
		ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		ajax.send();
	}
}

// get products by name from server 
function findByName(){
	showModalLoading();
	let name = document.getElementById("product-name-input");
	let ajax = AjaxObject();
	ajax.open("POST", SERVER + "products_by_name.php");
	ajax.onreadystatechange=function(){
		if (ajax.readyState==4){
			let array = JSON.parse(ajax.responseText);
			products.total = array.length;
			products.pages = parseInt(array.length / 10);
			products.items = array;

			showCurrentPage();
		}
		showModalLoading();
	}
	ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	ajax.send("name=" + name.value);
}

// run when page is ready
window.onload = ()=>{
	loadCategories();
	loadProducts();

	document.getElementById("modal-details").onclick = () => {
		document.getElementById("modal-details").style.display = "none";
	};

	document.getElementById("modal-shopping-cart").onclick = () => {
		document.getElementById("modal-shopping-cart").style.display = "none";
	};
}
