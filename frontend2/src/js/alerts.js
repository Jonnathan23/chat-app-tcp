const Swal = require('sweetalert2');

const successAlert = (message) => {
    Swal.fire({
        icon: 'success',
        title: 'Proceso exitoso',
        text: message,        
        timer: 2500
        
    })
}

const errorAlert = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Proceso fallido',
        text: message,        
        timer: 2500
        
    })
}