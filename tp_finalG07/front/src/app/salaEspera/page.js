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
const router = useRouter()


    return <>
        <div className={styles.bodySala}>
            <div className={styles.container1}>
                <Title className={ styles.titleSala} text={"Esperando jugadores..."}></Title>
                <Boton className={clsx({ [styles.botonSala]: siempre })} text={"Jugar"} ></Boton>
            </div>
        </div>
    </>;
}