const urlBase = "localhost:3000";

document.getElementById('fetchData').addEventListener('click', () => {
    const lastModified = localStorage.getItem('lastModified');

    const headers = {};
    if (lastModified) {
        headers['If-Modified-Since'] = lastModified;
    }

    fetch(`http://${urlBase}/product`, {
        method: 'GET',
        headers: headers
    })
    .then(response => {
        if (response.status === 304) {
            console.log('Validación Time-Based exitosa: El recurso no ha sido modificado (304).');
            return null;
        } else {
            return response.json().then(data => {
                const newLastModified = response.headers.get('Last-Modified');
                if (newLastModified) {
                    localStorage.setItem('lastModified', newLastModified);
                    console.log(`Guardado nuevo Last-Modified: ${newLastModified}`);
                }
                return data;
            });
        }
    })
    .then(data => {
        const dataContainer = document.getElementById('dataContainer');
        if (data) {
            dataContainer.innerHTML = `
                <h3>${data.name}</h3>
                <p>Precio: $${data.price}</p>
                <p>${data.message}</p>
                <p style="color: blue;">(Petición completada con 200 OK)</p>
            `;
        } else {
            dataContainer.innerHTML += `
                <p style="color: green;">(Data validada: Se mantuvo el caché mediante 304 Not Modified)</p>
            `;
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});

document.getElementById('updateData').addEventListener('click', () => {
    const name = document.getElementById('newName').value;
    const price = document.getElementById('newPrice').value;
    const message = document.getElementById('newMessage').value;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (price) updatedData.price = parseFloat(price);
    if (message) updatedData.message = message;

    fetch(`http://${urlBase}/product`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            document.getElementById('updateStatus').innerHTML = `
                <p style="color: purple;">¡${data.message}! (Haz clic en 'Obtener datos' para ver cómo se rompe el caché 304 y descarga el nuevo contenido con un 200 OK)</p>
            `;
            document.getElementById('newName').value = '';
            document.getElementById('newPrice').value = '';
            document.getElementById('newMessage').value = '';
        }
    })
    .catch(error => {
        console.error('Error al hacer PUT:', error);
    });
});