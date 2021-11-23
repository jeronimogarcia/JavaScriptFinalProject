/*************************Clase-constructor************************/
class Vinos {
  constructor(nombre, cepa, precio, stock, fotoId, sub) {
    this.nombre = nombre;
    this.cepa = cepa;
    this.precio = precio;
    this.stock = stock;
    this.fotoId = fotoId ? fotoId : 0;
    this.sub = sub;
  }
}

/*************************Declaracion variables/arrays************************/

// array de imagenes vinos
let listaImagenes = [
  "default",
  "lopez",
  "bianchi",
  "uxmal",
  "senetiner",
  "rutini",
  "trumpeter",
];

// tabla vinos 
let tabla = document.getElementById("tablita");
// tabla carrito
let carrito = document.getElementById("carrito");
// lista vinos
let listado = document.getElementById("listadoCompleto");
// array de vinos
let listaVinos = [];
// array carrito
let listaCarrito = [];

// localStorage
const listaVinosStorage = window.localStorage.getItem(`listaVinos`);
const listaVinosCarrito = window.localStorage.getItem(`listaCarrito`);

// ajax cotizacion del dolar
const url = "https://www.dolarsi.com/api/api.php?type=valoresprincipales";

// precio dolar
let dolar;

// total de compra
let pago = 0;
let sumaCompra = 0;
let compraContainer = document.getElementById("sumaTotal");
let compraSuma = document.createElement("p");
compraSuma.setAttribute("class", "compraTotal");
compraContainer.appendChild(compraSuma);

/*************************Botones************************/

// boton panel de agregado de vinos
const button8 = document.querySelector(`#panelAgregado`);

// boton panel de muestra de lista
const button9 = document.querySelector(`#showLista`);

// boton de ordenamiento de menor a mayor precio
const button2 = document.querySelector(`#ordenarListaMenor`);
button2.addEventListener(`click`, ordenarPrecioMenor);

// boton de ordenamiento de mayor a menor precio
const button3 = document.querySelector(`#ordenarListaMayor`);
button3.addEventListener(`click`, ordenarPrecioMayor);

// boton de borrado de filtros
const button10 = document.querySelector(`#borrarFiltro`);
button10.addEventListener(`click`, actualizarTabla);

// boton de compra y actualizacion de stock
const button11 = document.querySelector(`#borrarCompra`);
button11.addEventListener(`click`, borrarCompra);

// boton de compra y actualizacion de stock
const button12 = document.querySelector(`#finalizarCompra`);
button12.addEventListener(`click`, finalizarCompra);

// boton de agregado de vinos por inputs
const button7 = document.querySelector(`#submitVinos`);
button7.addEventListener(`click`, guardarVinos);

// prevent default
$("#submitVinos").click(function (e) {
  e.preventDefault();
});


/*************************Logica separada************************/

// listaVinosStorage = null? pusheo : listaVinosStorage = string (getItem)
if (listaVinosStorage) {
  listaVinos = JSON.parse(window.localStorage.getItem(`listaVinos`));
} else {
  listaVinos.push(new Vinos(`lopez`, `malbec`, 760, 8, 1, 0));
  listaVinos.push(new Vinos(`bianchi`, `cabernet`, 450, 20, 2, 0));
  listaVinos.push(new Vinos(`uxmal`, `malbec`, 400, 15, 3, 0));
  listaVinos.push(new Vinos(`senetiner`, `cabernet`, 830, 6, 4, 0));
  listaVinos.push(new Vinos(`rutini`, `cabernet`, 1500, 10, 5, 0));
  listaVinos.push(new Vinos(`trumpeter`, `malbec`, 860, 13, 6, 0));
}

// listaVinosCarrito
if (listaVinosCarrito) {
  listaCarrito = JSON.parse(window.localStorage.getItem(`listaCarrito`));
} else {
}

/*************************Funciones************************/

// actualizado de tabla IMPORTANTISIMO
actualizarTabla();

// funcion actualizacion de tabla general 
function actualizarTabla() {
  const tempLista = Array.from(tabla.children);
  tempLista.forEach((filaTabla) => {
    filaTabla.remove();
  });
  listaVinos.forEach((vino, indice) => {
    nuevoRow(vino, indice);
  });

  const tempListaVinos = Array.from(listado.children);
  tempListaVinos.forEach((div) => {
    div.remove();
  });
  listaVinos.forEach((vino, indice) => {
    addVinos(vino, indice);
  });

  window.localStorage.setItem(`listaVinos`, JSON.stringify(listaVinos));
}

// funcion agregado de objetos a la tabla
function nuevoRow(vino, orden) {
  let tableRow = document.createElement("tr");
  let nombre = document.createElement("td");
  nombre.innerHTML = vino.nombre;
  nombre.onclick = () => {
    eliminarVino(orden);
  };
  let cepa = document.createElement("td");
  cepa.innerHTML = vino.cepa;
  let precio = document.createElement("td");
  precio.innerHTML = `$${vino.precio}`;
  let stock = document.createElement("td");
  stock.innerHTML = vino.stock;
  tableRow.appendChild(nombre);
  tableRow.appendChild(cepa);
  tableRow.appendChild(precio);
  tableRow.appendChild(stock);
  tabla.appendChild(tableRow);
}

// funcion de agregado a la lista de vinos por form/inputs
function guardarVinos() {
  const nombre = document.getElementById("nombreVino").value.toLowerCase();
  const idFoto = listaImagenes.findIndex((imgFoto) => imgFoto == nombre);
  const vinoNuevo = new Vinos(
    nombre,
    document.getElementById("cepaVino").value.toLowerCase(),
    Number(document.getElementById("precioVino").value),
    Number(document.getElementById("stockVino").value),
    idFoto == -1 ? 0 : idFoto,
    0
  );
  listaVinos.push(vinoNuevo);
  actualizarTabla();
  console.log(listaVinos);
}

// funcion eliminar elemento de tabla
function eliminarVino(indice) {
  listaVinos.splice(indice, 1);
  actualizarTabla();
}

// funcion ordenar lista de menor a mayor precio
function ordenarPrecioMenor() {
  listaVinos.sort((a, b) => {
    if (a.precio > b.precio) {
      return 1;
    }
    if (a.precio < b.precio) {
      return -1;
    }
    return 0;
  });
  actualizarTabla();
  console.log(listaVinos);
}

// funcion ordenar lista de mayor a menor
function ordenarPrecioMayor() {
  listaVinos.sort((a, b) => {
    if (a.precio > b.precio) {
      return -1;
    }
    if (a.precio < b.precio) {
      return 1;
    }
    return 0;
  });
  actualizarTabla();
  console.log(listaVinos);
}

// funcion suma total de stock
function sumaStock() {
  let suma = 0;
  for (let i = 0; i < listaVinos.length; i++) {
    suma = suma + listaVinos[i].stock;
  }
  console.log(`El stock total es de ${suma} vinos`);
}

// filtro por cepa
function filtrado(e) {
  console.log(e);
  if (e.keyCode === 13) {
    let search = document.getElementById("filtroCepa").value.toLowerCase();
    let filtroCepa = listaVinos.filter((obj) => obj.cepa === search);
    console.log(filtroCepa);
    if (filtroCepa.length > 0) {
      const tempLista = Array.from(tabla.children);
      tempLista.forEach((filaTabla) => {
        filaTabla.remove();
      });
      filtroCepa.forEach((vino, indice) => {
        nuevoRow(vino, indice);
      });

      const tempListaVinos = Array.from(listado.children);
      tempListaVinos.forEach((div) => {
        div.remove();
      });
      filtroCepa.forEach((vino, indice) => {
        addVinos(vino, indice);
      });
    }
  }
}

// creado de cards de vinos
function addVinos(vino) {
  // contenedores
  let fotoContainer = document.createElement("div");
  fotoContainer.setAttribute("class", "vinos__fotoContainer");
  let nombreContainer = document.createElement("div");
  nombreContainer.setAttribute("class", "vinos__nombreContainer");
  let cepaPrecioContainer = document.createElement("div");
  cepaPrecioContainer.setAttribute("class", "vinos__cepaPrecioContainer");
  let stockContainer = document.createElement("div");
  stockContainer.setAttribute("class", "vinos__stockContainer");
  let cartelCompra = document.createElement("div");
  cartelCompra.setAttribute("class", "vinos__compra");
  cartelCompra.innerText = "COMPRAR";
  //boton
  let btnCard = document.createElement("button");
  btnCard.setAttribute("class", "vinos__bottonCompra");
  btnCard.addEventListener("click", (e) => {
    carritos(e, vino);
  });
  // contenido
  let imagen = document.createElement("img");
  imagen.src = `./vinos/${listaImagenes[vino.fotoId]}.png`;
  let cepaContainer = document.createElement("div");
  cepaContainer.setAttribute("class", "vinos__cepaContainer");
  let cepa = document.createElement("p");
  cepa.innerText = "Cepa:";
  let cepaVino = document.createElement("p");
  cepaVino.innerHTML = `\u00a0${vino.cepa}`;
  let precioContainer = document.createElement("div");
  precioContainer.setAttribute("class", "vinos__precioContainer");
  let precio = document.createElement("p");
  precio.innerText = "Precio:";
  let precioVino = document.createElement("p");
  precioVino.innerHTML = `\u00a0$${vino.precio}`;
  let stock = document.createElement("p");
  stock.innerText = "Stock:";
  let stockNumber = document.createElement("p");
  stockNumber.innerHTML = `\u00a0${vino.stock}`;
  let nombreVino = document.createElement("p");
  nombreVino.innerHTML = vino.nombre;
  // asignacion hijos
  fotoContainer.appendChild(imagen);
  cepaPrecioContainer.appendChild(precioContainer);
  cepaPrecioContainer.appendChild(cepaContainer);
  cepaContainer.appendChild(cepa);
  cepaContainer.appendChild(cepaVino);
  precioContainer.appendChild(precio);
  precioContainer.appendChild(precioVino);
  stockContainer.appendChild(stock);
  stockContainer.appendChild(stockNumber);
  nombreContainer.appendChild(nombreVino);
  btnCard.appendChild(fotoContainer);
  btnCard.appendChild(nombreContainer);
  btnCard.appendChild(cepaPrecioContainer);
  btnCard.appendChild(stockContainer);
  btnCard.appendChild(cartelCompra);
  listado.appendChild(btnCard);
}

// slide del panel de agregado de vinos
$(function () {
  $("#panelAgregado").click(function () {
    $(".form__mainContainer").slideToggle({ duration: 1100 });
  });
});

// slide de la lista de vinos
$(function () {
  $("#showLista").click(function () {
    $(".table__tableMainContainer").slideToggle({ duration: 1000 });
  });
});

// carrito
function carritos(e, vino) {
  $(".carrito__sectionContainer").show({ duration: 1100 });
  console.log(vino);
  const VinoCarrito = new Vinos(
    vino.nombre,
    vino.cepa,
    vino.precio,
    vino.stock,
    0,
    0
  );
  listaCarrito.push(VinoCarrito);
  console.log(listaCarrito);
  actualizarTablaCarrito();
}

// funcion agregado de objetos a la tabla
function nuevoRowCarrito(vino) {
  let tableRow = document.createElement("tr");
  let nombre = document.createElement("td");
  nombre.innerHTML = vino.nombre;
  let cepa = document.createElement("td");
  cepa.innerHTML = vino.cepa;
  let precio = document.createElement("td");
  precio.setAttribute("class", `precio`);
  precio.innerHTML = vino.precio;
  let stock = document.createElement("td");
  stock.setAttribute("class", `precio`);
  stock.innerHTML = vino.stock;
  let cantidad = document.createElement("td");
  cantidad.setAttribute("class", "carrito__cantidad");
  let cantidadInput = document.createElement("input");
  cantidadInput.setAttribute("class", "carrito__input");
  let subtotal = document.createElement("td");
  subtotal.setAttribute("class", "carrito__subtotal");
  let subTotalNumero = document.createElement("p");
  subTotalNumero.setAttribute("class", "carrito__numero");
  subTotalNumero.innerHTML = vino.sub;
  cantidadInput.addEventListener("keyup", (e) => {
    subtotalx(e, subTotalNumero, vino, cantidadInput);
  });
  //asignaicon de hijos
  tableRow.appendChild(nombre);
  tableRow.appendChild(cepa);
  tableRow.appendChild(precio);
  tableRow.appendChild(stock);
  tableRow.appendChild(cantidad);
  tableRow.appendChild(subtotal);
  subtotal.appendChild(subTotalNumero);
  cantidad.appendChild(cantidadInput);
  carrito.appendChild(tableRow);
}

// actualizacion de carrito
function actualizarTablaCarrito() {
  pago = 0;
  const tempLista = Array.from(carrito.children);
  tempLista.forEach((filaTabla) => {
    filaTabla.remove();
    idInput = 100;
  });
  listaCarrito.forEach((vino, indice) => {
    nuevoRowCarrito(vino, indice);
  });
  listaCarrito.forEach((vino, indice) => {
    pago = pago + vino.sub;
  });
  window.localStorage.setItem(`pagoTotal`, JSON.stringify(pago));
  window.localStorage.setItem(`listaCarrito`, JSON.stringify(listaCarrito));
  compraSuma.innerText = window.localStorage.getItem(`pagoTotal`);
}

// funcion subtotal
function subtotalx(e, resultado, vino, cantidad) {
  if (e.keyCode === 13) {
    let cantComparada = cantidad.value;
    if (cantComparada < 1) {
      alert(`Por favor ingresar una cantidad mayor o igual a 1 unidad`);
    } else {
      if (cantComparada > vino.stock) {
        alert(`No hay tanto stock. Stock actual del vino es de ${vino.stock} unidades`);
      } else {
        vino.stock = vino.stock - cantidad.value;
        let subTotalPrecio = cantidad.value * vino.precio;
        vino.sub = vino.sub + subTotalPrecio;
        actualizarTablaCarrito();
      }
    }
  }
}

// AJAX cotizacion dolar
$.get(url, (data, est) => {
  if (est == "success") {
    dolar = data[1].casa.venta;
    console.log(dolar);
  }
});

// funcion de finalizar de compra
function finalizarCompra() {
  let dolares = parseFloat(dolar);
  let pesos = JSON.parse(window.localStorage.getItem(`pagoTotal`));
  let cantDolares = pesos / dolares;
  let cantDolaresFix = cantDolares.toFixed(2);
  alert(
    `Gracias por comprar, debe abonar un total de ${window.localStorage.getItem(
      `pagoTotal`
    )} pesos o ${cantDolaresFix} dolares`
  );
}

// funcion de borrado de carrito
function borrarCompra() {
  listaCarrito = [];
  window.localStorage.setItem(`listaCarrito`, JSON.stringify(listaCarrito));
  actualizarTablaCarrito();
}

