export async function jugadores(dato) {
  try {
    const res = await fetch("http://localhost:4000/jugadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dato),
    });
    if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
    const data = await res.json();
    console.log("🎮 Jugadores obtenidos:", data);
    return data;
  } catch (error) {
    console.error("❌ Error al conectar con el servidor:", error);
  }
}


export async function crearUsuario(dato) {
  const response = await fetch(`http://localhost:4000/crearUsuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato)
  })
  const data = await response.json();
  return data;
}


export async function buscarUsuario(dato) {
  const response = await fetch(`http://localhost:4000/buscarUsuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato)
  })
  const data = await response.json();
  return data;
}


export async function crearSala(dato) {
  console.log(dato)
  const response = await fetch(`http://localhost:4000/crearSala`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato)
  })
  const data = await response.json();
  return data;
}


export async function buscarSala(dato) {
  const response = await fetch(`http://localhost:4000/buscarSala`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato)
  })
  const data = await response.json();
  return data;
}

export async function agregarASala(dato) {
  console.log("DATO ES", dato)
  const response = await fetch(`http://localhost:4000/agregarASala`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato),
  });
  const data = await response.json();
  return data;
}


export async function obtenerDeSala(dato) {
  const response = await fetch(`http://localhost:4000/salasxusuarios`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato),
  });
  const data = await response.json();
  return data;
}

export async function buscarEnSala(dato) {
  const response = await fetch(`http://localhost:4000/buscarEnSala`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato),
  });
  const data = await response.json();
  return data;
}


export async function definirImpostor(dato) {
  const response = await fetch(`http://localhost:4000/actualizarImpostor`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dato),
  });
  const data = await response.json();
  return data;
}
