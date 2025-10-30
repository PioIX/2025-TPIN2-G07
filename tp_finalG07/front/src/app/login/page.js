"use client";


import Boton from '../componentes/Boton';
import Input from "../componentes/Input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";


export default function Login() {
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nuevoUsuario, setNuevo] = useState(false);
  const router = useRouter();









  async function ingresar() {
    if (nuevoUsuario) {
      const respuesta = await crearUsuario({ username: nombre, password: contraseña });
      console.log(respuesta);
    } else {
      const respuesta = await buscarUsuario({ username: nombre, password: contraseña });
      console.log(respuesta);
    }
    localStorage.setItem("id", usuarios);
    router.push('./lobby')
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
            <input type="checkbox" onChange={checkboxActivado}/>
          </div>


          <Boton className={styles.butonLogin} text="INGRESAR" tipo="login" onClick={ingresar}></Boton>
        </div>
      </div>
    </>
  );
}
