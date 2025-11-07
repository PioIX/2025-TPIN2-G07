'use client'

import clsx from 'clsx';
import styles from './page.module.css'
import Boton from '../componentes/Boton';
import Title from '../componentes/Title';
import {useRouter} from 'next/navigation';

export default function Jugar() {
    const router = useRouter();

    let siempre = true;
   function iniciar(){
    router.push('./login')
    }

    return <>
        <div className={styles.bodyJugar}>
            <div className={styles.container1}>
                <Title className={ styles.titleJugar} text={"Impostor"}></Title>
                <Boton className={clsx({ [styles.botonJugar]: siempre })} text={"Jugar"} onClick={iniciar}></Boton>
            </div>
        </div>
    </>;
}