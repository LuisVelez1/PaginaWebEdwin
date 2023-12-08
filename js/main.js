function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar))
}
function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave))
    return datos
}
let productos = obtenerAlmacenamientoLocal('productos') || [];



const informacionCompra = document.getElementById('informacionCompra');
const contenedorCompra = document.getElementById('contenedorCompra');
const productosCompra = document.getElementById('productosCompra');
const contenedor = document.getElementById('contenedor');
const numero = document.getElementById('numero');
const header = document.querySelector("#header");
const total = document.getElementById('total');
const body = document.querySelector("body");
const x = document.getElementById('x');

let lista = [];
let valorTotal = 0;

window.addEventListener("scroll", function(){
    if(contenedor.getBoundingClientRect().top<10){
        header.classList.add("scroll")
    }
    else{
        header.classList.remove("scroll")
    }
})

window.addEventListener('load', () =>{
    productos = obtenerAlmacenamientoLocal('productos') || [];

    lista = obtenerAlmacenamientoLocal('carrito') || [];
    visualizarProductos();
    contenedorCompra.classList.add("none");
    mostrarElementosLista();
})

function visualizarProductos(productosMostrar = productos) {
    contenedor.innerHTML = "";

    for (let i = 0; i < productosMostrar.length; i++) {
        if (productosMostrar[i].existencia > 0) {
            contenedor.innerHTML += `
                <div>
                    <img src="${productosMostrar[i].urlImagen}">
                    <div class="informacion">
                        <p>${productosMostrar[i].nombre}</p>
                        <p class="precio">$${productosMostrar[i].valor} Dollars</p>
                        <p>${productosMostrar[i].categoria}</p>
                        <button onclick='comprar("${productosMostrar[i].nombre}")'>Buy</button>
                    </div>
                </div>`;
        } else {
            contenedor.innerHTML += `
                <div>
                    <img src="${productosMostrar[i].urlImagen}">
                    <div class="informacion">
                        <p>${productosMostrar[i].nombre}</p>
                        <p class="precio">$${productosMostrar[i].valor}</p>
                        <p>${productosMostrar[i].categoria}</p>
                        <p class="soldOut">Sold Out</p>
                    </div>
                </div>`;
        }
    }
}


function comprar(nombreProducto) {
    const productoComprado = productos.find(producto => producto.nombre === nombreProducto);

    if (productoComprado && productoComprado.existencia > 0) {
        const existeEnCarrito = lista.find(item => item.nombre === nombreProducto);

        if (!existeEnCarrito) {
            lista.push({ nombre: productoComprado.nombre, precio: productoComprado.valor });
        } else {
            const index = lista.findIndex(item => item.nombre === nombreProducto);
            lista[index].precio += productoComprado.valor;
        }

        productoComprado.existencia -= 1;

        guardarAlmacenamientoLocal("productos", productos);
        guardarAlmacenamientoLocal("carrito", lista);
        numero.innerHTML = lista.length;
        numero.classList.add("diseñoNumero");
        mostrarElementosLista();
    } else {
        alert("Este producto está agotado o no existe.");
    }
}









carrito.addEventListener("click", function(){
    body.style.overflow = "hidden"
    contenedorCompra.classList.remove('none')
    contenedorCompra.classList.add('contenedorCompra')
    informacionCompra.classList.add('informacionCompra')
    mostrarElementosLista()
})

function mostrarElementosLista() {
    productosCompra.innerHTML = ""
    valorTotal = 0
    for (let i = 0; i < lista.length; i++){
        productosCompra.innerHTML += `<div>
        <div class="img">
        <button onclick=eliminar(${i}) class="botonTrash">
        <img src="/img/trash.jpeg"></button>
        <p>${lista[i].nombre}</p></div>
        <p> $${lista[i].precio} Dollars</p>
        </div>`
        valorTotal += parseInt(lista[i].precio)
    }
    total.innerHTML = `<p>Valor Total</p> 
    <p><span>$${valorTotal} Dollars</span></p>`
}

function eliminar(indice){
    const nombreProducto = lista[indice].nombre;
    const productoEncontrado = productos.find(producto => producto.nombre === nombreProducto);

    if (productoEncontrado) {
        productoEncontrado.existencia += 1;
        lista.splice(indice, 1);
    }

    guardarAlmacenamientoLocal("productos", productos);
    guardarAlmacenamientoLocal("carrito", lista);

    numero.innerHTML = lista.length;
    if (lista.length === 0){
        numero.classList.remove("diseñoNumero");
    }
    
    visualizarProductos();
    mostrarElementosLista();
}


x.addEventListener("click", function(){
    body.style.overflow = "auto"
    contenedorCompra.classList.add('none')
    contenedorCompra.classList.remove('contenedorCompra')
    informacionCompra.classList.remove('informacionCompra')
})

const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', () => {
    const searchText = searchBar.value.toLowerCase();
    const filteredProducts = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchText) ||
        producto.categoria.toLowerCase().includes(searchText)
    );

    visualizarProductos(filteredProducts);
});

function mostrarProductosFiltrados(productosMostrar) {
    const filteredHTML = productosMostrar.map((product) => {
        return `
            <div>
                <img src="${product.urlImagen}">
                <div class="informacion">
                    <p>${product.nombre}</p>
                    <p class="precio">$${product.valor} Dollars</p>
                    <p>${product.categoria}</p>
                    <button onclick='comprar("${productosMostrar[i].nombre}")'>Buy</button>
                </div>
            </div>
        `;
    }).join('');

    contenedor.innerHTML = filteredHTML;
}

function ordernarPrecioAscendente() {
    const productosOrdenadosAsc = productos.slice().sort((a, b) => parseFloat(a.valor) - parseFloat(b.valor));
    visualizarProductos(productosOrdenadosAsc);
}

function ordenarPrecioDescendente() {
    const productosOrdenadosDesc = productos.slice().sort((a, b) => parseFloat(b.valor) - parseFloat(a.valor));
    visualizarProductos(productosOrdenadosDesc);
}

