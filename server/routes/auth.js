const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../database/connection");

// Ruta para registrar un nuevo usuario
router.post("/register", async (req, res) => {
  const { nombre, correo, numero_cuenta, contraseña } = req.body;

  try {
    // Verifica si el número de cuenta ya está registrado
    db.get(
      "SELECT * FROM usuarios WHERE numero_cuenta = ?",
      [numero_cuenta],
      async (err, row) => {
        if (row) {
          return res
            .status(400)
            .json({ message: "Este número de cuenta ya está registrado." });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Insertar nuevo usuario
        db.run(
          "INSERT INTO usuarios (nombre, correo, numero_cuenta, contraseña) VALUES (?, ?, ?, ?)",
          [nombre, correo, numero_cuenta, hashedPassword],
          function (err) {
            if (err) {
              console.error(err);
              res.status(500).json({ message: "Error al registrar usuario" });
            } else {
              res
                .status(201)
                .json({
                  message: "Usuario registrado con éxito",
                  userId: this.lastID,
                });
            }
          },
        );
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Ruta para iniciar sesión (login)
router.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Buscar usuario por correo
    db.get(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo],
      async (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error en el servidor" });
        }

        if (!user) {
          return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseña
        const esValida = await bcrypt.compare(contraseña, user.contraseña);
        if (!esValida) {
          return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Éxito
        res.status(200).json({
          message: "Inicio de sesión exitoso",
          user: {
            id: user.id,
            nombre: user.nombre,
            correo: user.correo,
            numero_cuenta: user.numero_cuenta,
          },
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Ruta para listar usuarios
router.get('/usuarios', (req, res) => {
  db.all('SELECT id, nombre, correo FROM usuarios', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener usuarios' });
    }
    res.json(rows);
  });
});


module.exports = router;
