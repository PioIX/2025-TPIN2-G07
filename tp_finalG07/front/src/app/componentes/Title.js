'use client'

export default function Title(props) {
    return (
        <h2 className={props.className}>
            {props.text}
        </h2>
    );
}