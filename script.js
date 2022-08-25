//je demande à fetch de récupérer les données depuis l'url de l'API-- 
fetch('http://localhost:3000/api/products')
  .then(res => res.json())
  .then(data => { 
    AllProducts(data);
  })
  // j'ajoute un message au cas où le serveur ne répond pas
  .catch(_error => {
    alert("le serveur ne repond pas, veuiller nous contacter par mail kanapsupport@gmail.com");
  });

//Ensuite une fois les produits récupérés, les informations des produits s'affichent---
function AllProducts(data) {
    for (product of data) {
        const itemCard = document.getElementById('items');
        itemCard.innerHTML +=`
        <a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
        </a>`;
    }
}