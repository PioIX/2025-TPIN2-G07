"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./page.module.css";
import Boton from "../componentes/Boton";
import Title from "../componentes/Title";
import { useSocket } from "../hooks/useSocket";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


let siempre = true;

export default function salaEspera() {
  const router = useRouter();
  const [segundos, setSegundos] = useState(0);
  const [idIntervalo, setIdIntervalo] = useState(null);


  const searchParams = useSearchParams()
    const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  console.log(`el usuario ${nombre} ingresó a la sala ${sala}`)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setSegundos((prevSegundos) => prevSegundos + 1);
    }, 1000);
    setIdIntervalo(intervalo);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  useEffect(()=>{
    if(segundos == 10) 
        {router.push(`./chat?nombre=${nombre}&sala=${sala}`)
        console.log("debería estar pusheando")
    }
   },[segundos])

    
  return (
    <>
      <div className={styles.bodySala}>
        <div className={styles.container1}>
          <Title
            className={styles.titleSala}
            text={"Esperando jugadores..."}
          ></Title>
          <h2 className={styles.temporizador}>Temporizador: {segundos}s</h2>
        </div>
      </div>
    </>
  );
};
