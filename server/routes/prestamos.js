const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Ruta para registrar un préstamo
router.post('/register', (req, res) => {
  const { id_usuario, monto, fecha_prestamo, plazo_meses, interes } = req.body;

  const query = `INSERT INTO prestamos (id_usuario, monto, fecha_prestamo, plazo_meses, interes, estado)
                 VALUES (?, ?, ?, ?, ?, 'activo')`;

  db.run(query, [id_usuario, monto, fecha_prestamo, plazo_meses, interes], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al registrar préstamo' });
    }
    res.status(201).json({ message: 'Préstamo registrado', id: this.lastID });
  });
});

module.exports = router;
