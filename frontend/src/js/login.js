const form = document.getElementById('loginForm');

const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;

    if (username) {
        window.electron.sendMessage(username);        
        window.location.href = 'chat.html';
    }    
};

form.addEventListener('submit', handleSubmit);