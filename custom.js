let viewData = document.getElementById("data-view");
let selectView = document.getElementById("select-view");
let dataCount = document.getElementById("count");

const getStorage = (storagedata) => JSON.parse(localStorage.getItem(storagedata)) || [];
let cart = getStorage("allData");

fetch("https://fakestoreapi.com/products").then((response) => response.json()).then((data) => {
    data.forEach(data => {
        viewData.innerHTML += `<tr>
                                    <td><img src="${data.image}" width="200px"/></td>
                                    <td>${data.category}</td>
                                    <td>${data.description}</td>
                                    <td>${data.price}</td>
                                    <td>${data.rating.rate}</td>
                                    <td width="150px"><a href="#" class="btn btn-primary" onclick = "return addCart(${data.id})">Add to cart</a></td>
                                </tr>`
    });
    getStorage();
}).catch((error) => {
    console.log("error",error);
})

const addCart = (id) => {

    if(cart.some((data) => data.id === id )){
        alert("This product is already in your cart.");
        return false;
    }

    fetch(`https://fakestoreapi.com/products/${id}`).then((response) => response.json()).then((data) => {
        cart.push(data);
        localStorage.setItem("allData",JSON.stringify(cart));
        dataShow();
        count();
        
    }).catch((error) => {
        console.log("error",error);
    })
    
}

const changeQuntity = (id,change) => {
    cart = cart.map((data) => {
        if(data.id == id){
            return {...data, Quintity : Math.max((data.Quintity || 1) + change,0)};
        }else{
            return data;
        }
    })
    localStorage.setItem("allData",JSON.stringify(cart));
    dataShow();
}

const tPrice = () => (cart.reduce((total,item) => total + (item.price || 0) * (item.Quintity || 1),0));

const count = () => dataCount.innerHTML = cart.length;

const dataShow = () => {
    selectView.innerHTML = '';
    cart.forEach((data) => {
        selectView.innerHTML += `<tr>
                                    <td><img src="${data.image}" width="200px"/></td>
                                    <td>${data.category}</td>
                                    <td>${data.description}</td>
                                    <td>${data.price}</td>
                                    <td width="150px"><a href="#" class="btn btn-warning me-2" onclick = "return changeQuntity(${data.id},1)">+</a>${data.Quintity || 1}<a href="#" class="btn btn-success ms-2" onclick = "return changeQuntity(${data.id},-1)">-</a></td>
                                    <td>${data.rating.rate}</td>
                                    <td width="200px"><a href="#" class="btn btn-danger" onclick = "return selectDelete(${data.id})">Delete</a><a href="view.html?id=${data.id}" class="btn btn-primary ms-2" target = "_blank">View All</a></td>
                                </tr>`
    })
    const totalPrice = tPrice();
    document.getElementById("total-price").innerHTML = `Total Price :- ₹ ${totalPrice.toFixed(2)}`;
}

const selectDelete = (id) => {
    localStorage.setItem("allData",JSON.stringify(cart = cart.filter((data) => data.id != id))),dataShow(),count();
}

dataShow();
count();