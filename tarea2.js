// Cada producto que vende el super es creado con esta clase
class Producto {
    sku; // Identificador único del producto
    nombre; // Su nombre
    categoria; // Categoría a la que pertenece este producto
    precio; // Su precio
    stock; // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock = 10) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
    }
}

// Creo todos los productos que vende mi super
const productosDelSuper = [
    {
        sku: 'MNj123k',
        nombre: 'Coca Cola',
        precio: 100,
        categoria: 'Bebidas',
        stock: 10
    },
    {
        sku: 'WE328NJ',
        nombre: 'Jabon',
        precio: 4,
        categoria: 'Higiene',
        stock: 3
    },
    {
        sku: 'FN312PPE',
        nombre: 'Gaseosa',
        precio: 5,
        categoria: 'Bebidas',
        stock: 5
    },
    {
        sku: 'PV332MJ',
        nombre: 'Cerveza',
        precio: 20,
        categoria: 'Bebidas',
        stock: 20
    },
    {
        sku: 'XX92LKI',
        nombre: 'Arroz',
        precio: 7,
        categoria: 'Alimentos',
        stock: 20
    },
    {
        sku: 'UI999TY',
        nombre: 'Fideos',
        precio: 5,
        categoria: 'Alimentos',
        stock: 20
    },
    {
        sku: 'OL883YE',
        nombre: 'Shampoo',
        precio: 3,
        categoria: 'Higiene',
        stock: 50
    },
    {
        sku: 'RT324GD',
        nombre: 'Lavandina',
        precio: 9,
        categoria: 'Limpieza',
        stock: 3
    }
];

// Genero un listado actualizado de productos. Simulando fetching de base de datos
const dataBase = productosDelSuper.map(e => e);


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos; // Lista de productos agregados
    categorias; // Lista de las diferentes categorías de los productos en el carrito
    precioTotal; // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vacío
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku);

        const agregarProducto = new Promise((resolve, reject) => {
            if(producto){
                try {
                    resolve(producto);
                } catch (error) {
                    console.log(error);
                }
            } else {
                reject(`Hubo un error al agregar el item ${sku}`);            
            }

        });
        agregarProducto.then((data)=>{ //producto {sku: ... nombre: ... precio: ... categoria: ... stock: ...}
            // Verificar si el producto ya está en el carrito
            const productoEnCarrito = this.productos.find((p) => p.sku === sku);
            if (productoEnCarrito) {                
                productoEnCarrito.cantidad += cantidad;
                data.stock -= cantidad;
            } else {
                const nuevoProducto = new ProductoEnCarrito(sku, data.nombre, cantidad);
                this.productos.push(nuevoProducto);
                data.stock -= cantidad;
            }
            this.precioTotal += data.precio * cantidad;

            // Actualizar la lista de categorías si la categoría no está presente
            if (!this.categorias.includes(data.categoria)) {
                this.categorias.push(data.categoria);
            }

        }).catch((error) => {
            console.log(error);
            console.log(`Error: El producto ${sku} no existe.`);
        });
    }

    /**
     * función que elimina @{cantidad} del producto con @{sku} del carrito
     * Devuelve una promesa que se resuelve cuando se completa la eliminación.
     */
    async eliminarProducto(sku, cantidad) {
        return new Promise((resolve, reject) => {
            const productoEnCarrito = this.productos.find((p) => p.sku === sku);
            const stockDB = dataBase.find((p) => p.sku === sku);

            if (!productoEnCarrito) {
                reject(`Error: El producto ${sku} no está en el carrito.`);
            }

            if (cantidad < productoEnCarrito.cantidad) {
                productoEnCarrito.cantidad -= cantidad;
                stockDB.stock += cantidad;
            } else {
                const index = this.productos.indexOf(productoEnCarrito);
                this.productos.splice(index, 1);
            }

            resolve();
        });
    }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku; // Identificador único del producto
    nombre; // Su nombre
    cantidad; // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = dataBase.find((product) => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);
            }
        }, 1500);
    });
}

function mostrarProductosEnCarrito(carrito) {
    console.table(carrito.productos);
}

function mostrarProductosEnBaseDeDatos() {
    console.table(dataBase);
}

function agregarProductosALaBaseDeDatos(nuevosProductos) {
    nuevosProductos.forEach((producto) => {
        dataBase.push(producto);
    });
}

/***************** EJEMPLOS ********************/

//Prueba de funcionamiento
const carrito = new Carrito();

console.log("********************Base de Datos**********")
mostrarProductosEnBaseDeDatos();

carrito.agregarProducto('OL883YE', 2) 
carrito.agregarProducto('XX92LKI', 3) 
carrito.agregarProducto('WE328NJ', 1) 
carrito.agregarProducto('UI999TY', 2) 
carrito.agregarProducto('OL883YE', 5) 
carrito.agregarProducto('XX92LKI', 2) 
carrito.agregarProducto('WE328NJ', 2) 
    .then(() => {
        // console.log(carrito.productos);
        // console.log(productosDelSuper); //se resta el stock
        console.log("***********Productos AGREGADOS en Carrito************")
        mostrarProductosEnCarrito(carrito);
        console.log("*******************************************")
        // mostrarProductosEnBaseDeDatos();
    })
    .then(() => {
        carrito.eliminarProducto('WE328NJ', 2) 
        carrito.eliminarProducto('UI999TY', 2) 
        carrito.eliminarProducto('OL883YE', 2) 
            .then(() => {
                // console.log(carrito.productos);
                // console.log(productosDelSuper); //se suma al stock devuelta
                // mostrarProductosEnCarrito(carrito);
                // mostrarProductosEnBaseDeDatos();
            })
            .catch((error) => {
                console.log(error);
            });
        console.log("***********Productos POST ELIMINACION en Carrito**********")
        mostrarProductosEnCarrito(carrito);
        console.log("**************Base de Datos POST CARRITO **************")
        mostrarProductosEnBaseDeDatos();
    }).catch((error) => {
        console.log(error);
    });



/*
function main(){
    const nuevosProductos = [
        {
            sku: 'AB123CD',
            nombre: 'Leche',
            precio: 3,
            categoria: 'Lácteos',
            stock: 15
        },
        {
            sku: 'XY456ZT',
            nombre: 'Pan',
            precio: 2,
            categoria: 'Panadería',
            stock: 8
        }
    ];
    agregarProductosALaBaseDeDatos(nuevosProductos);

    // Mostrar la base de datos actualizada
    console.log("**************Base de Datos Actualizada**************")
    mostrarProductosEnBaseDeDatos();
}

main();
*/