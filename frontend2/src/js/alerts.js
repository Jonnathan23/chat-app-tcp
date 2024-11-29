const Swal = require('sweetalert2');

// Mostrar una alerta de error
const errorServerAlert = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Problema con el servidor',
        text: message,
        showCloseButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
};

// Cerrar la alerta
const closeAlert = () => {
    Swal.close();
};

module.exports = { errorServerAlert, closeAlert };
