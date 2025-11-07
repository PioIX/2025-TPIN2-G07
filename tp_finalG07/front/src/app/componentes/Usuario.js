'use client'


export default function Usuario(props) {
    return <>
    <div key={props.index}>
                    <h2>{props.nombre}</h2>
                    <img src={`https://robohash.org/${props.nombre}`} alt={props.nombre} />
                    
                </div>
</>
};