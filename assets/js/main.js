async function getProducts() {
    try {
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );
        const res = await data.json();
        window.localStorage.setItem("products", JSON.stringify(res));
        return res;

    } catch (error) {
        console.log(error);
    }

}

function printProducts(db) {
    const productsHTML = document.querySelector(".products");
    
    let html = "";
    for (const product of db.products) {
        
        const buttonAdd = product.quantity? `<i class="bx bx-plus" id="${product.id}"></i>`:"<span class='soldOut'>SOLD</span> ";

        html +=
            ` <div class="product">
                <div className=product_img>
                    <img src="${product.image}" alt= "imagen"/>
                </div>
            <div class = "product_info">
                <h4>${product.name}|<span><b>Stock</b>:${product.quantity}</span></h4>
                <h5>
                    $${product.price}
                    ${buttonAdd}

                    
                
                </h5>
            </div>    
        
         </div>`;

    }
    productsHTML.innerHTML = html;


}

function handleShowCart() {
    const iconCarHTML = document.querySelector(".bx-shopping-bag");
    const cartHTML = document.querySelector(".cart");

    iconCarHTML.addEventListener("click", function () {
        cartHTML.classList.toggle("cart_show");
    });
}

function addToCartProducts(db) {
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function (e) {

        if (e.target.classList.contains("bx-plus")) {

            const id = Number(e.target.id);
            const productfind = db.products.find((product) => product.id === id

            );

            if (db.cart[productfind.id]) {
                if (productfind.quantity === db.cart[productfind.id].amount)
                    return alert("no tenemos mas en bodega");
                db.cart[productfind.id].amount++;

            } else {
                db.cart[productfind.id] = { ...productfind, amount: 1 };
            }

            // PERSISTENCIA DE DATOS
            window.localStorage.setItem("cart", JSON.stringify(db.cart));
            printProductsInCart(db);
            printTotal(db);
            handlePrintAmountProducts(db); 

           // console.log(db.cart);
        }
    });

}

function printProductsInCart(db) {
    const cartProducts = document.querySelector(".cart_products");

    let html = "";
    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product];

        console.log({ quantity, price, name, image, id, amount });

        html += `
        <div  class="cart_product"> 
            <div class="cart_product--img">
                <img src="${image}"  alt="imagen"/>
            </div>
            <div class="cart_product--body">
                <h4>${name} | $ ${price}</h4>
                <p>Stock:${quantity}</p>

                <div class="cart_product--body-op" id="${id}">
                <i class='bx bx-minus'></i>
                <span>${amount} unit</span>
                <i class='bx bx-plus'></i>
                <i class='bx bx-trash'></i>
                </div>
            </div>
        </div>
        `;
    }
    cartProducts.innerHTML = html;


}

function handleProductsInCart(db) {
    const cartProducts = document.querySelector(".cart_products");

    cartProducts.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {

            const id = Number(e.target.parentElement.id);
            const productfind = db.products.find((product) => product.id === id

            );

            if (productfind.quantity === db.cart[productfind.id].amount)
                return alert("no tenemos mas en bodega");

            db.cart[id].amount++;

        }
        if (e.target.classList.contains("bx-minus")) {
            console.log("Quieres restar");
            const id = Number(e.target.parentElement.id);
            if (db.cart[id].amount === 1) {
                const response = confirm(
                    "estas seguro de eliminar el producto"
                );
                if (!response) return
                delete db.cart[id];
            } else {
                db.cart[id].amount--;
            }
        }

        if (e.target.classList.contains("bx-trash")) {
            console.log("Quieres eliminar");
            const id = Number(e.target.parentElement.id);
            const response = confirm(
                "estas seguro de eliminar el producto"
            );
            if (!response) return
            delete db.cart[id];
        }

        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        printProductsInCart(db);
        printTotal(db);

    });
}


function printTotal(db){

    const infoTotal = document.querySelector(".info_total");
    const infoAmount = document.querySelector(".info_amount");
    
    
    let totalProducts = 0;
    let amountProducts = 0;

    for (const product in db.cart) {
        const {amount, price} = db.cart[product];
        totalProducts += price * amount;
        amountProducts += amount;
    }

    infoAmount.textContent = amountProducts +" Units";
    infoTotal.textContent = "$" + totalProducts + ".00";

}

function handleTotal (db){
    const btnBuy = document.querySelector(".btn_buy");

    btnBuy.addEventListener("click",function(){
        if(!Object.values(db.cart).length)
        return alert("Vas a comprar aire? JAJAJA COMPRA!!!");

        const currentProducts =[];

        for (const product of db.products) {
            const productCart = db.cart[product.id];
            if(product.id === productCart?.id){
                currentProducts.push({
                    ...product,quantity: product.quantity - productCart.amount
                });
            }else{
                currentProducts.push(product);
            }
            
        }
        db.products = currentProducts;
        db.cart = {};

        window.localStorage.setItem("products",JSON.stringify(db.products));
        window.localStorage.setItem("carts",JSON.stringify(db.cart));

        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        handlePrintAmountProducts(db);

    });


}

function handlePrintAmountProducts(db){
    const amountProducts = document.querySelector(".amountProducts");

    let amount = 0;
    for (const product in db.cart) {
        amount += db.cart[product].amount;          
    }

    amountProducts.textContent = amount;
}

async function main() {
    const db = {
        products:
            JSON.parse(window.localStorage.getItem("products")) ||
            (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {}
    };

    printProducts(db);
    handleShowCart();
    addToCartProducts(db);
    printProductsInCart(db);
    handleProductsInCart(db);
    printTotal(db);
    handleTotal(db);
    handlePrintAmountProducts(db);   

}
main();


/* ANIMACION MENU*/


const iconClose = document.querySelector(".bx-x");
const iconOpen = document.querySelector(".bxs-grid-alt");
const menu = document.querySelector(".menu");
[iconClose, iconOpen].forEach((icon)=>{
    icon.addEventListener("click",()=>menu.classList.toggle("menu_show"));
});

/**/