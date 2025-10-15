'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx';
import styles from './page.module.css'
import Boton from '../componentes/Boton';
import Title from '../componentes/Title';
import { useSocket } from '../hooks/useSocket';



let siempre = true


export default function Jugar() {

    return <>
        <div className={styles.bodyJugar}>
            <div className={styles.container1}>
                <Title className={clsx({
                    [styles.titleJugar]: siempre
                })} text={"Impostor"}></Title>
                <Boton className={clsx({ [styles.botonJugar]: siempre })} text={"Jugar"}></Boton>
            </div>
        </div>
    </>;
}