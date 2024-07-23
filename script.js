// Arrays de objetos de alimentos
const foods = [
    { name: "Pizza", price: 5000 },
    { name: "Hamburguesa", price: 3000 },
    { name: "Lomito de carne", price: 3500 },
    { name: "Sandwich de milanesa", price: 3500 },
    { name: "Papas fritas", price: 2000 },
    { name: "Papas fritas / GRATINADAS", price: 2500 }
];

// Arrays de pedidos
let order = JSON.parse(localStorage.getItem('order')) || []; // Recuperar pedido desde localStorage
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0; // Recuperar precio total desde localStorage

// Función para sumar dos números
const sumar = (a, b) => a + b;

// Función para multiplicar dos números
const multiplicar = (a, b) => a * b;

// Función de orden superior que aplica una operación a los elementos de un pedido
const aplicarOperacionSobrePedido = (operacion, pedido) => {
    return pedido.reduce((resultado, item) => operacion(resultado, multiplicar(item.price, item.quantity)), 0);
};

// Función para mostrar las opciones de alimentos en el DOM
const mostrarOpcionesAlimentos = () => {
    const foodChoice = document.getElementById('foodChoice');
    foods.forEach((food, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${food.name} ($${food.price.toFixed(2)})`;
        foodChoice.appendChild(option);
    });
};

// Función para mostrar el resumen del pedido en el DOM
const mostrarResumenPedido = () => {
    const resumenDiv = document.getElementById('resumenPedido');
    if (order.length > 0) {
        const orderSummary = order.map(({ item, quantity, price }) => `${quantity} x ${item} ($${multiplicar(price, quantity).toFixed(2)})`).join('<br>');
        resumenDiv.innerHTML = `Vista de su pedido:<br>${orderSummary}<br>Total a pagar: $${totalPrice.toFixed(2)}`;
    } else {
        resumenDiv.innerHTML = "No colocó ningún pedido. (haga su pedido)";
    }
};

// Mostrar el resumen del pedido al cargar la página
mostrarResumenPedido();

// Mostrar las opciones de alimentos al cargar la página
mostrarOpcionesAlimentos();

// Evento click del botón de añadir comida
document.getElementById('addFood').addEventListener('click', () => {
    const foodChoice = document.getElementById('foodChoice');
    const quantityInput = document.getElementById('quantity');
    const selectedFood = foods[parseInt(foodChoice.value, 10)];
    const quantity = parseInt(quantityInput.value, 10);

    if (quantity > 0) {
        order.push({ item: selectedFood.name, quantity, price: selectedFood.price });
        totalPrice = aplicarOperacionSobrePedido(sumar, order);

        // Guardar el pedido y el precio total en localStorage
        localStorage.setItem('order', JSON.stringify(order));
        localStorage.setItem('totalPrice', totalPrice.toString());

        // Mostrar el resumen del pedido
        mostrarResumenPedido();

        // Mostrar notificación
        mostrarNotificacion(`Añadido ${quantity} x ${selectedFood.name} al pedido.`);
    } else {
        mostrarNotificacion("Cantidad rechazada. (haga su pedido)");
    }
});

// Evento click del botón de realizar pedido
document.getElementById('realizarPedido').addEventListener('click', () => {
    if (order.length > 0) {
        mostrarNotificacion("Pedido realizado con éxito. ¡Gracias por su compra!");
        // Reiniciar pedido y precio total
        order = [];
        totalPrice = 0;

        // Actualizar localStorage
        localStorage.setItem('order', JSON.stringify(order));
        localStorage.setItem('totalPrice', totalPrice.toString());

        // Mostrar el resumen del pedido
        mostrarResumenPedido();
    } else {
        mostrarNotificacion("No colocó ningún pedido. (haga su pedido)");
    }
});

// Función para mostrar notificaciones en el DOM
const mostrarNotificacion = (mensaje) => {
    const notificacionesDiv = document.getElementById('notificaciones');
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacionesDiv.appendChild(notificacion);
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
};
