"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Title from "../componentes/Title";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


let siempre = true;

export default function salaEspera() {
  const [impostorinador, setImpostor] = useState([]) 
  const [segundos, setSegundos] = useState(0);
  const [idIntervalo, setIdIntervalo] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre");
  const sala = searchParams.get("sala");
  const id = searchParams.get("id");
  const admin = searchParams.get("admin")

  console.log(`el usuario ${nombre} ingresó a la sala ${sala}`)

  useEffect(() => {

    if (admin){
    setImpostor(id)};
    const intervalo = setInterval(() => {
      setSegundos((prevSegundos) => prevSegundos + 1);
    }, 1000);
    setIdIntervalo(intervalo);

    return () => {
      clearInterval(intervalo);
    };
    
  }, []);

  useEffect(() => {
    if (admin)
    setImpostor((prev) => [...prev, id]);
  });

  useEffect(() => {
    if (segundos == 10) {
      
      router.push(`./chat?nombre=${nombre}&sala=${sala}&id=${id}&admin=${admin}`);
      console.log("debería estar pusheando")
    }
  }, [segundos])


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
