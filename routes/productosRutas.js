const express = require("express");
const ruta2 = express.Router();
const ProductoClase=require("../clases/ProductoClase");
const ProductosBD = require("../bd/ProductosDB");


// Ruta para mostrar todos los productos
ruta2.get("/productos", async (req, res) => {
    const productobd = new ProductosBD();
    const productosMySql = await productobd.mostrarProductos();
    var productosCorrectos = [];
    productosMySql.forEach(producto => {
            var producto1 = new ProductoClase(producto);
            console.log(producto1.nombrePro);
            console.log(producto1.cantidad);
            console.log(producto1.precio);
            console.log("descripcion "+producto1.descripcion);
            
        if (producto1.nombrePro != undefined && producto1.cantidad != undefined && producto1.precio != undefined && producto1.descripcion != undefined){
                productosCorrectos.push(producto);
         }
    });
    //console.log(productosCorrectos);
    res.render("mostrarProductos", { productosCorrectos });
});

//agregar un nuevo producto
ruta2.post("/agregarProductos", (req,res)=>{
    var producto1 = new ProductoClase(req.body);
    console.log(producto1.mostrarDatos);
    if (producto1.nombrePro != undefined && producto1.cantidad != undefined && producto1.precio != undefined && producto1.descripcion != undefined) {
        const productobd = new ProductosBD();
        productobd.nuevoProducto(producto1.mostrarDatos);
        res.redirect("/productos");
    } else {
        res.render("error");
    }
});
  
//mostrar el formulario de agregar producto
ruta2.get("/agregarProducto", (req, res) => {
    res.render("formulario2");
});

// mostrar editar producto
ruta2.get("/editarProducto/:idPro", async (req, res) => {
    try {
        const productobd = new ProductosBD();
        const producto = await productobd.productoID(req.params.idPro);
        res.render("editarProducto", producto);
    } catch (error) {
        console.error("Error al obtener el producto para editar: " + error);
        res.render("error");
    }
});

//borrar producto
ruta2.get("/borrarProductos/:idPro", async (req,res)=>{
    try {
        const productobd = new ProductosBD();
        await productobd.borrarProducto(req.params.idPro);
        res.redirect("/productos");
    } catch (error) {
        console.log(error);
    }
})

//procesar editar productos
ruta2.post("/editarProducto", async (req,res)=>{
    try {
        const productobd = new ProductosBD();
        console.log(req.body);
        await productobd.editarProducto(req.body);
        console.log("Productos editado correctamente");
        res.redirect("/productos");
    } catch (error) {
        console.log("Error al editar el usuario");
        res.render("error");
    }
})

module.exports=ruta2;