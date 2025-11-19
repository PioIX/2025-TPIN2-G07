"use client";
import Producto from "@/app/componentesProdu/Producto";
import Descripcion from "../componentesProdu/Descripcion";
import Titulo from "../componentesProdu/Titulo";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { usuarios } from "../fetch/fetch";
import { traerUsuarios } from "../prueba/page";
import { crearUsuario } from "../fetch/fetch";

export default function pruebaTizi() {
    const [users, setUsers] = useState([])
    const [nuevo, setNuevo] = useState(false)
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")


    useEffect(() => {
        async function putoooo() {
            let auxiliar = await traerUsuarios();// tira error
            console.log(auxiliar);
            setUsers(auxiliar)
        } putoooo()
    }, []); // vacio, se ej cuando abris la pag  ||    cuando se ej la pag y cambia holaa  [, holaa]


    async function cargar() {
        if (!nombre || !descripcion) { return alert("por favor llene todos los campos") }
        if (nuevo) {
            const respuesta = await crearUsuario({ nombre: nombre, contraseña: descripcion });
            console.log(respuesta);
        }
    }

    function checkboxActivado(event) {
        setNuevo(event.target.checked)
        console.log(nuevo)/// muestra false cuande esta presionado x el await pero funca
    }
    function modificarNombre(event) {
        setNombre(event.target.value)
        console.log(nombre)
    }
    function modificarDescripcion(event) {
        setDescripcion(event.target.value)
        console.log(descripcion)
    }
//
    return (// no funca el map x error con traer usu
        <div>
          {users ? users.map((usuarios, i) => {
            <Producto key={i} text={usuarios.nombre} descrip={usuarios.contraseña} lable="fff" ></Producto>
            }) : "no hay boludos"}
            <input type="checkbox" onChange={checkboxActivado}></input>
            {nuevo ? <><input placeholder="nombre" onChange={modificarNombre}></input> <input placeholder="descripciom" onChange={modificarDescripcion}></input> <button onClick={cargar}>holaaaa</button></> : "presionar el input"}

        </div>
    )
}

