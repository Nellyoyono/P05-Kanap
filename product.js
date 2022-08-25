// **OBJECTIF:LIEN ENTRE LE PRODUIT DE LA PAGE D'ACCEUIL ET LA PAGE PRODUIT// 

//-------------------------------------------------------   RECUPERATION ID DU PRODUIT --------------------------------------------
//Récupération de l'id depuis l'URL du produit grâce à la méthode window.location.herf 
let params = new URL(window.location.href).searchParams;
let idProduct = params.get("id");

//Methode Fetch pour récuperer les données de l'api avec l'id du produit 
fetch(`http://localhost:3000/api/products/${idProduct}`)
  .then(res => res.json())
  .then(data => { 
    produits = data;
    afficherLeProduit();
})
  // j'ajoute un message au cas où le serveur ne répond pas
  .catch(_error => {
    alert("le serveur ne repond pas, veuiller nous contacter par mail kanapsupport@gmail.com");
});


//-------------------------------------------------------AFFICHAGE DU PRODUIT --------------------------------------------
//depuis cette page l'utilisateur peut selectionner une quantite,une couleur et ajouter à son panier 

//fonction pour lier les élements HTML que l'on va créer avec les données de l'api
function afficherLeProduit  () {
// choix couleur: définition des variables je parcour la liste des couleurs du produit 
    let choixColor = document.getElementById("colors");
    document.querySelector(".item__img").innerHTML = `<img src="${produits.imageUrl}" alt="${produits.altTxt}">`;

    document.getElementById("title").textContent = produits.name;
    document.getElementById("price").textContent = produits.price;
    document.getElementById("description").textContent = produits.description;
    produits.colors.forEach((option) => {
        choixColor.innerHTML += `<option value="${option}">${option}</option>`;
    });
};
//------------------------------------------------------GESTION DU PANIER  ---------------------------------------------

//LA METHODE PERMETTRA DE RENVOYER LE CONTENU DU PANIER  

//SI LE PANIER EST VIDE ON RENVOI UN TABLEAU VIDE SINON ON RENVOI UN TABLEAU CONTENAT LES ARTICLES QUI SONT DANS LE LOCAL STORAGE 
// je recupere le contenu ce qui se trouve dans le localstorage, si cart n'existe pas dans le local 
//,on interroge dans le if et on te renvoi un tableau vide
//on renvoi en format Json 

function getCart() {
  let cart = localStorage.getItem('cart');
  if(!cart) {
    return [];
  }
  return JSON.parse(cart);
}

//on implemente la methode mise a jour du panier 
function updateCart(cart, product) {
// si le panier a déjà des articles on récupère le panier existant et on parcours les articles pour chercher
// si l'article existe  déja dans le panier
//si l'article existe déjà on augmente avec la nouvelle quantité

  const isExist = (element) => element.id === product.id && element.color === product.color;
  let index = cart.findIndex(isExist);//recherhe les elements dans un tableau avec les conditions (si un produit existe il me renvoi a l'index et si existe pas il me renvoi a -1)
  console.log(index);
  if(index > -1) {
  let q = parseInt(cart[index].quantity) + parseInt(product.quantity);//on recupere la qte existante et on ajoute la nouvelle qte 
      cart[index].quantity = parseInt(q);
    }else {
      cart.push(product);
    }
  // je stocke les données récupérées dans le localStorage :
  // JSON.stringify permet de convertir les données au format JavaScript en JSON 
    localStorage.setItem('cart',JSON.stringify(cart));
}

//methode addtocart
function addToCart () {
  console.log('test')
  let choixColor= document.getElementById("colors");
  let choixQuantity = document.getElementById("quantity");
  let cart = getCart();
  if (choixQuantity.value > 0 && choixQuantity.value <=100 && choixColor.value != ''){
  let optionsProduit = {
      id: idProduct,
      color: choixColor.value,
      quantity: parseInt(choixQuantity.value)
}
updateCart(cart, optionsProduit);
console.log(cart)
}}


document.getElementById("addToCart").addEventListener('click', addToCart);


