let totalPrice = 0;
let totalQuantity = 0;
let totalPriceElement = document.getElementById('totalPrice');
let totalQuantityElement = document.getElementById('totalQuantity');
let cartItems = document.getElementById('cart__items');
let exemple = document.getElementsByClassName('cart__order__form__question');

let data = [].map.call(exemple, item => item);

console.log(data);

getCart().forEach(product => {
        fetch("http://localhost:3000/api/products/" + product.id)
  .then((res) => {
    return res.json();
  })
  .then(function (value) {
    cartItems.innerHTML += printProduct(value, product.quantity, product.color);
    totalQuantity += parseInt(product.quantity);
    totalPrice += parseInt(product.quantity) * parseInt(value.price);
    totalQuantityElement.innerHTML = totalQuantity;
    totalPriceElement.innerHTML = totalPrice;
    const itemQuantities = document.querySelectorAll('.itemQuantity');
    itemQuantities.forEach(item => {
        item.addEventListener('input', updateCartWhenQuantityChange, false);
    });
    const deleteItems = document.querySelectorAll('.deleteItem');
    deleteItems.forEach(item => {
        item.addEventListener('click', remove, false);
    });
  });
});




//fonctions

//calcul du prix total du panier 
function calculate() {
    totalQuantity = 0;
    totalPrice = 0;
    totalPriceElement.innerHTML = 0;
    totalQuantityElement.innerHTML = 0;
    getCart().forEach(product => {
        fetch("http://localhost:3000/api/products/" + product.id)
  .then((res) => {
    return res.json();
  })
  .then(function (value) {
    totalQuantity += parseInt(product.quantity);
    totalPrice += parseInt(product.quantity) * parseInt(value.price);
    totalPriceElement.innerHTML = totalPrice;
    totalQuantityElement.innerHTML = totalQuantity;
  });  
});  
}
//
function updateCartWhenQuantityChange(e) {
    let element = this.closest("article");
    let idValue = element.getAttribute('data-id');
    let colorValue = element.getAttribute('data-color');
    let cart = getCart();
    for(let i = 0; i<cart.length; i++) {
        if(parseInt(cart[i].id) === parseInt(idValue) && cart[i].color === colorValue) {
            cart[i].quantity = parseInt(e.target.value);
        }
    }
    setCart(cart);
    calculate();
}
//fonction supprimer pour supprimer un produit du panier//
function deleteItemCart(id, color) {
    let cart = getCart();
    for(let i = 0; i<cart.length; i++) {
        if(cart[i].id === id && cart[i].color === color) {
            cart.splice(i, 1);
        }
    }
    setCart(cart);
    calculate();
}

function remove() {
    let element = this.closest("article");
    let idValue = element.getAttribute('data-id');
    let colorValue = element.getAttribute('data-color');
    element.parentNode.removeChild(element);
    deleteItemCart(idValue, colorValue);
    alert('Article supprimé!');
};


function printProduct(product, quantity, color) {
    let html = '<article class="cart__item" data-id="' + product._id + '" data-color="' + color + '">';
    html += '<div class="cart__item__img">';
    html += '<img src="' + product.imageUrl + '" alt="' + product.altTxt + '">';
    html += '</div>';
    html += '<div class="cart__item__content">';
    html += '<div class="cart__item__content__description">';
    html += '<h2>' + product.name + '</h2>';
    html += '<p>' + color + '</p>';
    html += '<p>' + product.price + '€</p>';
    html += '</div>';
    html += '<div class="cart__item__content__settings">';
    html += '<div class="cart__item__content__settings__quantity">';
    html += '<p>Qté : </p>';
    html += '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + quantity + '">';
    html += '</div>';
    html += '<div class="cart__item__content__settings__delete">';
    html += '<p class="deleteItem">Supprimer</p>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</article>';
    return html;
}

function getCart() {
    let cart = localStorage.getItem('cart');
    if(!cart) {
      return [];
    }
    return JSON.parse(cart);
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function post(e) {
    e.preventDefault();
    console.log('post');
    let firstNameValue = document.getElementById('firstName').value;
    let lastNameValue = document.getElementById('lastName').value;
    let addressValue = document.getElementById('address').value;
    let cityValue = document.getElementById('city').value;
    let emailValue = document.getElementById('email').value;
    console.log(firstNameValue,lastNameValue, addressValue, cityValue, emailValue);

}
//-------------------Gestion du formulaire------------------//
//Ecoute du bouton "Commander" pour passer la commande*/

document.getElementById('order').addEventListener('click', (event) => {
    event.preventDefault();////Envoi des informations client au localstorage et ecoute du panier 
orderCommand();
post(event);
    });

function orderCommand() {
//on recupere des id coordonnées du formaulaire client 
let firstNameValue = document.getElementById('firstName').value;
    let lastNameValue = document.getElementById('lastName').value;
    let addressValue = document.getElementById('address').value;
    let cityValue = document.getElementById('city').value;
    let emailValue = document.getElementById('email').value;

//declaration Regex :*Création condition pour véririfer que toutes les entrées du formulaire sont remplies*

let regex = new RegExp('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/');//REGEX pour l'adresse et validation des conditions des entrées
//let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');


if (regex.test(emailValue) === false)//si le mail n'est valide
  {
    document.getElementById("emailErrorMsg").textContent =
    "veuillez saisir une adresse mail correcte";///Bouton du formulaire et message d'erreur à afficher
    return; 
  }
if (firstNameValue ==='')//si le mail n'est valide
{
    document.getElementById("firstNameErrorMsg").textContent =
    "veuillez saisir un nom correct";  
    return; 
}
if (lastNameValue ==='')//si le mail n'est valide
{
    document.getElementById("lastNameErrorMsg").textContent =
    "veuillez saisir un prénom correct";
    return;
}
if (addressValue ==='')//si le mail n'est valide
{
    document.getElementById("addressErrorMsg").textContent =
    "veuillez saisir une adresse correcte";
    return;
}
if (cityValue ==='')//si le mail n'est valide
{
    document.getElementById("cityErrorMsg").textContent =
    "veuillez saisir un nom de ville correcte";
    return;
}
}

//Recup ID des produits du panier 
    
let idProduct = [];//def la variable du panier qui ne comportera que les id des produits choisi du localstorage
    
function recupIdProduct() {
    // récupération des ids produit dans MON PANIER 
    for (let i = 0; i < getCart.length; i++) {
        idProduct.push(getCart[i].productID);// pour chaque canap dans mon cart je recup les info et je push l'id dans l'array productID
    }
    console.log(idProduct);
    

//*création de l'objet commande (contenant les infos du client + id des produits commandé)*/
    let commande = {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
        },
        products: idProduct,
    };
}
/* à présent, on va envoyer notre objet contact et produits vers l'API*/

// on prépare les infos pour l'envoie en POST
/*ensuite on défini les paramètres de notre requête*/

function order() {
 // on envoie en POST
 let options = {
    method: "POST",
    body: JSON.stringify(order),
    headers: { "Content-Type": "application/json" },
}
//*ici c'est la requête envoyant l'objet contact et la liste des id produits. L'API renvoi en échange l'id de commande*/

fetch(`http://localhost:3000/api/products/order`)
.then(res => res.json())//Récupération de la réponse du serveur/
.then(data => { 
console.log(data);
/*Une fois qu'on a notre id de commande, on redirige vers la page confirmation avec celui ci dans le lien*/
//localStorage.clear();//vider le localStorage
//localStorage.setItem("orderId", data.orderId);
//document.location.href = "confirmation.html";
})

// j'ajoute un message au cas où le serveur ne répond pas
.catch((error) => {
console.log(error)
});
}





//**Les inputs des utilisateurs doivent être analysés et validés pour vérifier le format et le type de données avant l’envoi à l’API. Il ne serait par exemple pas recevable d’accepter un
//prénom contenant des chiffres, ou une adresse e-mail ne contenant pas de symbole “@”. En
//cas de problème de saisie, un message d’erreur devra être affiché en dessous du champ
//correspondant.
//Attention à ne pas stocker le prix des articles en local. Les données stockées en local ne
//sont pas sécurisées et l’utilisateur pourrait alors modifier le prix lui-même. */


//Validation des données
//Pour les routes POST, l’objet contact envoyé au serveur doit contenir les champs firstName,
//lastName, address, city et email. Le tableau des produits envoyé au back-end doit être un
//array de strings product-ID. Les types de ces champs et leur présence doivent être validés
//avant l’envoi des données au serveur

// let regexname= /^[a-zA-Zéêëèîïâäçù ,'-]{3,20}$/;
//let regexaddress= /^[0-9]{1,3}[a-zA-Zéêëèîïâäçù ,'-]+$/;
//fetch(`http://localhost:3000/api/products/order
//fetch("http://localhost:3000/api/products/order", options)












/// Ajout des Regex
//let form = document.querySelector(".cart__order__form");



//déclaration d'une variable contenant les ID
//let productID = recupIdProduct();
    






//Pour cette boucle for  , créez une variable d'indice i  qui sert de compteur pour le nombre d'exécutions de la boucle. C'est pour cette raison qu'elle démarrera à zéro, car on n'a pas encore parcouru la boucle.

//La deuxième commande dans les parenthèses   for  est la condition de poursuite de la boucle : dès qu'elle s'évalue comme   false  , on quitte la boucle. Dans ce cas, vous souhaitez l'exécuter autant de fois qu'il y a de passagers, donc quand l'indice  i  atteint 10 (après 10 boucles), vous souhaitez l'arrêter, car il n'y a plus de passager.//

//La troisième commande demande à la boucle   for  d'incrémenter   i  (ajouter 1) à chaque exécution. C'est ce qui permet de suivre le nombre d'exécutions de la boucle.

//L'ancienne façon de parcourir un tableau dans une boucle était d'utiliser la boucle   for  vue précédemment avec sa propriété   length  . Par exemple, avec un tableau appelé   passengers  :



