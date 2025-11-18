"use client";
import Jugador from "@/app/componentes/Jugador";
import Boton from "@/app/componentes/Boton";
import Title from "@/app/componentes/Title";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function pruebaTizi() {
  const [marca, setMarca] = useState(false);

  function marcado(event) {
    setMarca(event.target.checked);
    console.log(marca);
  }

  return (
    <>
      <div>
        <Jugador text={"hola"}></Jugador>
        <input
          type="checkbox"
          label="agregar producto"
          onClick={marcado}
        ></input>
      </div>
    </>
  );
}
