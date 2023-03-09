async function getProducts() {
    try {
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );
        const res = await data.json();
        window.localStorage.setItem("products",JSON.stringify(res));
        return res;

    } catch (error) {
        console.log(error);
    }
    
}  

function printProducts(db) {
    const productsHTML = document.querySelector(".products");
    let html = "";
    for (const product of db.products) {
         html += 
         ` <div class="product">
                <div className=product_img>
                    <img src="${product.image}" alt= "imagen"/>
                </div>
            <div class = product_info>
                <h4>${product.name}|<span><b>Stock</b>:${product.quantity}</span></h4>
                <h5>
                    $${product.price}
                    <i class="bx bx-plus" id="${product.id}"></i>
                
                </h5>
            </div>    
        
         </div>`;
        
    }
    productsHTML.innerHTML = html;


}

function handleShowCart() {
    const iconCarHTML =document.querySelector(".bx-cart");
    const cartHTML = document.querySelector(".cart");

    iconCarHTML.addEventListener("click", function(){
        cartHTML.classList.toggle("cart_show");
    });
}

function addToCartProducts(db) {
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click",function (e) {

        if (e.target.classList.contains("bx-plus")) {

            const id = Number(e.target.id);
            const productfind = db.products.find((product) => product.id === id
            
            );

          if (db.cart[productfind.id]) {
            if (productfind.quantity === db.cart[productfind.id].amount) 
            return alert("no tenemos mas en bodega");
            db.cart[productfind.id].amount++;
            
          } else {
            db.cart[productfind.id]= {...productfind,amount:1};
          }

            // PERSISTENCIA DE DATOS
            window.localStorage.setItem("cart",JSON.stringify(db.cart));

          console.log(db.cart);
        }
        });

}

async function main() {
    const db = {
        products:
        JSON.parse( window.localStorage.getItem("products"))||
        (await getProducts()),
        cart:JSON.parse(window.localStorage.getItem("cart"))|| {}
    }; 
    
    printProducts(db);
    handleShowCart();
    addToCartProducts(db);

    const cardProducts = document.querySelector(".card_products");

    let html = "";
    for(const product in db.cart){
        const{quantity,price,name,image,id,amount}= db.cart[product];

        console.log({quantity,price,name, image, id,amount});

        html += `
        <div  class="card_product"> 
            <div class="card_product--img">
                <img src="${image}"  alt="imagen"/>
            </div>
            <div class="card_product--body">
                <h4>${name} | $ ${price}</h4>
                <p>Stock:${quantity}</p>

                <div class="card_product--body-op">
                <i class='bx bx-minus'></i>
                <span>${amount} unit</span>
                <i class='bx bx-plus'></i>
                <i class='bx bx-trash'></i>
                </div>
            </div>
        </div>
        `;
    }

    cardProducts.innerHTML = html;

}
main ();


