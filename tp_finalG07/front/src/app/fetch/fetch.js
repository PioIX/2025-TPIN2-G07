export async function jugadores() {
      try {
        const res = await fetch("http://localhost:4000/jugadores", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();
        console.log("🎮 Jugadores obtenidos:", data);
        setUserList(data.mensaje || []);
      } catch (error) {
        console.error("❌ Error al conectar con el servidor:", error);
      }
    }


  export async function crearUsuario(dato){
    const response = await fetch(`http://localhost:4000/crearUsuario`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(dato)
    })
  const data = await response.json();
  return data;
}


  export async function  buscarUsuario(dato){
    const response = await fetch(`http://localhost:4000/buscarUsuario`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(dato)
    })
  const data = await response.json();
  return data;
}
