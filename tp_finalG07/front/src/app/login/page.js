"use client";
import Boton from '../componentes/Boton';
import Input from "../componentes/Input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { buscarUsuario } from '../fetch/fetch';
import { crearUsuario } from '../fetch/fetch';
import { useSearchParams } from "next/navigation";
//import {buscarUsuario, crearUsuario} from "../fetch/fetch";

export default function Login() {
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nuevoUsuario, setNuevo] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function ingresar() {
    if (nuevoUsuario) {
      const respuesta = await crearUsuario({ nombre: nombre, contraseña: contraseña });
      console.log(respuesta);

      router.push(`./lobby?id=${respuesta.idUser}`);
    } else {
      const respuesta = await buscarUsuario({ nombre: nombre, contraseña: contraseña });
      console.log(respuesta);
      router.push(`./lobby?id=${respuesta[0].idUser}`);
    }

  }
  function modificarNombre(event) {
    setNombre(event.target.value)
  }
  function modificarContraseña(event) {
    setContraseña(event.target.value)
  }
  function checkboxActivado(event) {
    setNuevo(event.target.checked)
  }
  return (
    <>
      <div className={styles.body}>
        <div className={styles.container}>
          <h1 className={styles.header}>Iniciar Sesión</h1>


          <Input className={styles.inputLogin} tipo="login" placeholder="Nombre" onChange={modificarNombre}></Input>
          <Input className={styles.inputLogin} tipo="login" placeholder="Contraseña" onChange={modificarContraseña}></Input>


          <div className={styles.row}>
            <h2 className={styles.h2}>¿Eres nuevo?</h2>
            <input type="checkbox" onChange={checkboxActivado} />
          </div>


          <Boton className={styles.butonLogin} text="INGRESAR" tipo="login" onClick={ingresar}></Boton>
        </div>
      </div>
    </>
  );
}
