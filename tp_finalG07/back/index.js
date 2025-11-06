var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// Puerto por el que estoy ejecutando la página Web

const session = require('express-session');
// Para el manejo de las variables de sesión

const server = app.listen(port, () => {
	console.log(`Servidor NodeJS corriendo en http://localhost:${port}/`);
});;

const io = require('socket.io')(server, {
	cors: {
		// IMPORTANTE: REVISAR PUERTO DEL FRONTEND
		origin: ["http://localhost:3000", "http://localhost:3001"], // Permitir el origen localhost:3000
		methods: ["GET", "POST", "PUT", "DELETE"],  	// Métodos permitidos
		credentials: true                           	// Habilitar el envío de cookies
	}
});

const sessionMiddleware = session({
	//Elegir tu propia key secreta
	secret: "supersarasa",
	resave: false,
	saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
	sessionMiddleware(socket.request, {}, next);
});

//Ahora van los eventos

io.on("connection", (socket) => {
	const req = socket.request;

	socket.on('joinRoom', data => {
		console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
		if (req.session.room != undefined)
			socket.leave(req.session.room);
		req.session.room = data.room;
		socket.join(req.session.room);

		io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
	});

	socket.on('pingAll', data => {
		console.log("PING ALL: ", data);
		io.emit('pingAll', { event: "Ping to all", message: data });
	});

	socket.on('sendMessage', data => {
		io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
	});

	socket.on('disconnect', () => {
		console.log("Disconnect");
	})
});

app.get('/', function (req, res) {
	res.status(200).send({
		message: 'GET Home route working fine!'
	});
});

app.get('/traerUsuarios', async function (req, res) {
	try {
		let respuesta = await realizarQuery(`SELECT * FROM Usuarios WHERE username = "${req.query.username}"`)
		res.send({ mensaje: respuesta })
	} catch (error) {
		res.send({ mensaje: "error", error })
	}
})

app.get('/prueba', async function (req, res) {
	res.send({ mensaje: await realizarQuery(`SELECT * FROM Users`) });
});

app.get('/usuarios', async function (req, res) {
	res.send({ mensaje: await realizarQuery(`SELECT * FROM Usuarios`) });
});


app.get('/usuarios', async function (req, res) {
	check = await realizarQuery(`SELECT * FROM Usuarios WHERE username = "${req.body.username}  && password = ${req.body.password}"`)
	if (check.length = 0) {
		res.send({ mensaje: "El nombre o la contraseña no coincide" })
	} else {
		res.send(await realizarQuery(`SELECT id_usuario FROM Usuarios WHERE username = '${req.body.username}'`))
	}
});

app.post('/jugadores', async function (req, res) {
	try {
		const idJugadores = await realizarQuery(`SELECT idUser FROM UsuariosPorSala WHERE idRoom = '${req.body.idRoom}'`);
		const resultado = await realizarQuery(`SELECT * FROM Usuarios WHERE idUser = '${idJugadores}'`)
		res.send({ mensaje: resultado });
	} catch (error) {
		console.error("Error al traer jugadores:", error);
		res.send({ mensaje: "error", error });
	}

});

app.post('/crearUsuario', async function (req, res) {
	try {
		let check = await realizarQuery(`SELECT * FROM Usuarios WHERE nombre = "${req.body.nombre}"`)
		if (check.length > 0) {
			res.send({ mensaje: "El usuario ya existe" })
		} else {
			console.log(req.body)
			await realizarQuery(`INSERT INTO Usuarios (nombre, contraseña) VALUES
            ("${req.body.nombre}", "${req.body.contraseña}")`)
			let resTemp = await realizarQuery(`SELECT idUser FROM Usuarios WHERE nombre = "${req.body.nombre}"`)
			await realizarQuery(`UPDATE Usuarios SET fotoPerfil = "https://robohash.org/${resTemp[0].idUser}" WHERE idUser = ${resTemp[0].idUser}`)
			res.send(await realizarQuery(`SELECT idUser FROM Usuarios WHERE nombre = '${req.body.nombre}'`))
		}
	} catch (error) {
		res.send({ mensaje: "error", error })
	}

})

app.post('/buscarUsuario', async function (req, res) {
	try {
		check = await realizarQuery(`SELECT * FROM Usuarios WHERE nombre = "${req.body.nombre}" && contraseña ="${req.body.nombre}"`)
		if (check.length = 0) {
			res.send({ mensaje: "El usuario no existe" })
		} else {
			id = await realizarQuery(`SELECT idUser FROM Usuarios WHERE nombre = '${req.body.nombre}'`)
			res.send(id)
		}
	} catch (error) {
		res.send({ mensaje: "error", error })
	}

})


app.post('/buscarSala', async function (req, res) {
	try {
		console.log(req.body)
		check = await realizarQuery(`SELECT * FROM Rooms WHERE idRoom = "${req.body.idRoom}"`)
		console.log(check)
		if (check.length == 0) {
			res.send({ mensaje: "La sala no existe", crearSala: true })
		} else {
			id = await realizarQuery(`SELECT idRoom FROM Rooms WHERE idRoom = '${req.body.idRoom}'`)
			res.send({ sala: id[0], crearSala: false })
		}
	} catch (error) {
		res.send({ mensaje: "error", error })
	}

})

app.post('/crearSala', async function (req, res) {
	try {
		let check = await realizarQuery(`SELECT * FROM Rooms WHERE idRoom = "${req.body.idRoom}"`)
		if (check.length > 0) {
			res.send({ mensaje: "La sala ya existía", avanzar: false })
		} else {
			console.log("!!!!", req.body)
			await realizarQuery(`INSERT INTO Rooms (nombreRoom, idRoom) VALUES
            ("${req.body.nombreRoom}", "${req.body.idRoom}")`)
			res.send({ avanzar: true })
		}
	} catch (error) {
		res.send({ mensaje: "error", error })
	}

})


app.post('/impostor', async function (req, res) {
	try {
		let check = await realizarQuery(`SELECT * FROM Usuarios WHERE nombre = "${req.body.nombre}"`)
		if (check.length > 0) {
			res.send({ mensaje: "El usuario ya existe" })
		} else {
			console.log(req.body)
			await realizarQuery(`INSERT INTO Usuarios (nombre, contraseña) VALUES
            ("${req.body.nombre}", "${req.body.contraseña}")`)
			let resTemp = await realizarQuery(`SELECT idUser FROM Usuarios WHERE nombre = "${req.body.nombre}"`)
			await realizarQuery(`UPDATE Usuarios SET fotoPerfil = "https://robohash.org/${resTemp[0].idUser}" WHERE idUser = ${resTemp[0].idUser}`)
			res.send(await realizarQuery(`SELECT idUser FROM Usuarios WHERE nombre = '${req.body.nombre}'`))
		}
	} catch (error) {
		res.send({ mensaje: "error", error })
	}

});

app.post('/agregarASala', async function (req, res) {
	console.log(req.body)
	let check = await realizarQuery(`SELECT * FROM UsuariosPorSala WHERE idRoom = "${req.body.idRoom}" AND idUser = "${req.body.idUser}" `)
	if (check.length > 0) {
		res.send({ mensaje: "El usuario ya está cargado" })
	}
	else {
		await realizarQuery(`INSERT INTO UsuariosPorSala(idUser, idRoom, esAdmin) VALUES 
		("${req.body.idUser}", "${req.body.idRoom}", ${req.body.esAdmin})`)
		res.send(await realizarQuery(`select idUserPorSala FROM UsuariosPorSala where idUser = ${req.body.idUser} AND idRoom = ${req.body.idRoom} and esAdmin = ${req.body.esAdmin}`))
	}
})
//a revisar

app.get('/buscarEnSala', async function (req, res) {
	console.log(req.body)
	check = await realizarQuery(`
    SELECT * FROM UsuariosPorSala
    WHERE idRoom = '${req.body.idRoom}'
	`);
	console.log(check)
	if (check.length == 0) {
		res.send({ mensaje: "No existe relación entre el usuario y la sala" });
	} else {
		res.send(await realizarQuery(`
      SELECT idUser FROM UsuariosPorSala
      WHERE idRoom = ${req.body.idRoom}
    `));

	}
});

app.put("/actualizarImpostor", async function (req, res) {
	if (req.body.idUser != undefined) {
		await realizarQuery(`UPDATE UsuariosPorSala SET impostor = true where idUser= '${req.body.idUser}'`)

		res.send({ mensaje: "Se modifico el usuario" })
	} else {
		res.send({ mensaje: "Body incompleto, no se modificó el usuario" })
	}
});

