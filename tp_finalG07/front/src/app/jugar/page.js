'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx';
import styles from './page.module.css'
import Boton from '../componentes/Boton';
import Title from '../componentes/Title';
import { useSocket } from '../hooks/useSocket';
import {useRouter} from 'next/navigation';
import { useSearchParams } from "next/navigation";


let siempre = true



export default function Jugar() {
   function iniciar(){
    router.push('./lobby')
    }
const router = useRouter()


    return <>
        <div className={styles.bodyJugar}>
            <div className={styles.container1}>
                <Title className={ styles.titleJugar} text={"Impostor"}></Title>
                <Boton className={clsx({ [styles.botonJugar]: siempre })} text={"Jugar"} onClick={iniciar}></Boton>
            </div>
        </div>
    </>;
}