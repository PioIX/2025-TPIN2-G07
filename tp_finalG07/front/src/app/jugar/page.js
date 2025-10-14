'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx';
import styles from './page.module.css'
import Boton from '../componentes/Boton';
import Title from '../componentes/Title';
import { useSocket} from '../hooks/useSocket';



let siempre = true


export default function Jugar(){

return <>
        <div className='body'>
            <Title className={clsx({
                [styles.title] : siempre})} text={"Impostor"}>Im</Title>
            <Boton className={clsx([styles.boton])} text={"Jugar"}></Boton>
        </div>
    </>;
}