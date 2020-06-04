var data = new Map;
data.set("first", {"img": "resources/1.jpg", "description": "Футболка", "price": 1000})
data.set("second", {"img": "resources/2.jpg", "description": "Футболка", "price": 1000})
data.set("third", {"img": "resources/3.jpg", "description": "Футболка", "price": 1500})
data.set("fourth", {"img": "resources/4.jpg", "description": "Поло", "price": 2000})
data.set("fifth", {"img": "resources/5.jpg", "description": "Поло", "price": 2000})

var cart = new Map;

function showItem(id, item) {
    var listBlock = document.getElementById('list');

    var img = item.img;
    var description = item.description;
    var price = item.price;

    var cardString =
        "<div name='" + id + "' class='card w-75 mx-auto'>" +
        "<img class='card-img-top' src='" + img + "' alt='Card image cap'>" +
        "<div class='card-body'>" +
        "<div class='card-info'>" + description + " '" + id + "'</div>" +
        "<div class='card-info float-left'>Стоимость: <span class='price font-weight-bold'>" + price + "</span>p</div>" +
        "<div class='card-info float-right'>" +
        "<button type='button' class='add-to-cart btn btn-link' onclick=addToCart('" + id + "')>" +
        "<svg class='bi bi-cart-plus align-middle' width='1.2em' height='1.2em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>" +
        "<path fill-rule='evenodd' d='M8.5 5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 .5-.5z'/>" +
        "<path fill-rule='evenodd' d='M8 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0v-2z'/>" +
        "<path fill-rule='evenodd' d='M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'/>" +
        "</svg>" +
        "В корзину</button>" +
        "</div>" +
        "</div>" +
        "</div>";

    var card = document.createElement('div');
    card.className = 'item float-left w-25';
    card.innerHTML = cardString;

    listBlock.appendChild(card);
}

function getFilteredData() {

    var fromField = document.getElementById('from-price');
    var toField = document.getElementById('to-price');

    var from = fromField.value === "" ? 0 : fromField.value;
    var to = toField.value === "" ? 99999999 : toField.value;

    if (from === 0 && to === 99999999) {
        return data;
    } else {
        var filteredData = new Map;
        for (var [id, item] of data.entries()) {
            if (item.price >= from && item.price <= to){
                filteredData.set(id, item);
            }
        }
        return filteredData;
    }

}

function releaseFilter(){
    document.getElementById('from-price').value = "";
    document.getElementById('to-price').value = "";
    showAllItems();
}

function showAllItems() {
    var listBlock = document.getElementById('list');
    listBlock.innerHTML = "";

    var filteredData = getFilteredData();

    for (var [key, value] of filteredData.entries()) {
        showItem(key, value);
    }
}

function addToCart(id) {
    if (cart.has(id)) {
        cart.set(id, cart.get(id) + 1);
    } else {
        cart.set(id, 1);
    }
    certHTML();
}

function plusToCart(id) {
    addToCart(id);
    activateCartPopover()
}

function removeFromCart(id) {
    if (cart.get(id) == 1) {
        cart.delete(id);

    } else if (cart.get(id) > 1) {
        cart.set(id, cart.get(id) - 1);
    }

    certHTML();
    activateCartPopover()
}

function removeAllFromCart(id) {
    cart.delete(id);
    certHTML();
    activateCartPopover()
}

function cleanCart() {
    cart.clear();
    certHTML();
    activateCartPopover()
}

function certHTML() {

    if (cart.size == 0) {
        initCartPopover('Корзина пуста');
    } else {
        var contentString = "";

        var totalPrice = 0;

        for (var [id, count] of cart.entries()) {
            var item = data.get(id);
            var img = item.img;
            var price = item.price;

            contentString +=
                "<div name='" + id + "' class='cart-item w-100 float-left mx-auto'>" +
                "<div class='cart-item-img float-left w-25'>" +
                "<img class='w-100' src='" + img + "'>" +
                "</div>" +
                "<div class='cart-item-info float-left w-75'>" +
                "'<span class='cart-item-name'>" + id + "</span>'<br>" +
                "Стоимость: <span class='cart-price'>" + price + "</span>p<br>" +
                "Количество: " +
                "<button type='button' class='cart-item-minus-button btn btn-light p-0' onclick=removeFromCart('" + id + "')>-</button>" +
                "<span class='cart-count'>" + count + "</span>" +
                "<button type='button' class='cart-item-plus-button btn btn-light p-0' onclick=plusToCart('" + id + "')>+</button><br>" +
                "Общая стоимость: <span class='cart-full-price'>" + (price * count) + "</span>p<br>" +
                "<button type='button' class='cart-remove-from btn btn-link' onclick=removeAllFromCart('" + id + "')>" +
                "<svg class='bi bi-cart-dash align-middle' width='1.2em' height='1.2em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>" +
                "<path fill-rule='evenodd' d='M6 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z'/>" +
                "<path fill-rule='evenodd' d='M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'/>" +
                "</svg>" +
                "Удалить из корзины" +
                "</button>" +
                "</div>" +
                "</div>";

            totalPrice += price * count;

        }

        contentString +=
            "<div>" +
            "Итоговая стоимость: <span id='cart-total-price'>" + totalPrice + "</span>p<br>" +
            "<button type='button' class='cart-remove-from btn btn-link' onclick=cleanCart()>" +
            "<svg class='bi bi-cart-dash align-middle' width='1.2em' height='1.2em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>" +
            "<path fill-rule='evenodd' d='M6 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z'/>" +
            "<path fill-rule='evenodd' d='M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'/>" +
            "</svg>" +
            "Очистить корзину" +
            "</button>" +
            "</div>";

        initCartPopover(contentString);
    }
}

function initCartPopover(contentString) {
    $('#cart-button').popover('dispose').popover({
        placement: 'left',
        html: true,
        content: contentString,
        trigger: 'focus'
    });
}

function activateCartPopover() {
    $('#cart-button').popover('toggle').focus();
}