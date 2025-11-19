"use client";

import Titulo from "./Titulo";
import Botoncito from "./Botoncito";
import Descripcion from "./Descripcion";
import { useEffect } from "react";

export default function Producto(props){

   
   return <>
    <div>
        <Titulo text={props.text}></Titulo>
        <Descripcion text={props.descrip}></Descripcion>
        <Botoncito onClick={props.onClick} text={props.lable}></Botoncito>

    </div>
    </>
}