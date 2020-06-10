var data = new Map;
data.set("Green", {
    "img": "resources/1.jpg",
    "description": "Футболка",
    "price": 1000,
    "size_in_stock": ["xs", "s", "m", "l", "xl"]
})
data.set("White", {
    "img": "resources/2.jpg",
    "description": "Футболка",
    "price": 1000,
    "size_in_stock": ["m", "l", "xl"]
})
data.set("Kitten", {
    "img": "resources/3.jpg",
    "description": "Футболка",
    "price": 1500,
    "size_in_stock": ["xs", "s"]
})
data.set("Black", {
    "img": "resources/4.jpg",
    "description": "Поло",
    "price": 2000,
    "size_in_stock": ["m", "l", "xl"]
})
data.set("Blue", {
    "img": "resources/5.jpg",
    "description": "Поло",
    "price": 2000,
    "size_in_stock": ["xs", "s"]
})

var clientStatuses = [];
clientStatuses.push({"name": "Не слыхал", "points": 0, "discount": 0});
clientStatuses.push({"name": "Слышал", "points": 500, "discount": 0.05});
clientStatuses.push({"name": "Клиент", "points": 1000, "discount": 0.1});
clientStatuses.push({"name": "VIP Клиент", "points": 2000, "discount": 0.2});
clientStatuses.push({"name": "Акционер", "points": 4000, "discount": 0.3});

var username = "";
var clientPoints = 0;

var cart = new Map;

function CartItemKey(id, size) {
    return `${id},${size}`;
}

function showItem(id, item) {
    var listBlock = document.getElementById('item-list-block');

    var img = item.img;
    var description = item.description;
    var price = item.price;

    var sizesBlock = `<div class='item-sizes btn-group btn-group-toggle m-2' data-toggle='buttons'>`;
    for (var size of item.size_in_stock) {
        sizesBlock += `<label class='item-size btn btn-outline-success p-lg-2 px-4 size-radio'>
            <input type='radio' name='size' autocomplete='off'>${size.toUpperCase()}
            </label>`;
    }
    sizesBlock += "</div>";

    var cardString =
        `<div id='${id}' class='list-item card'>
        <img class='card-img-top' src='${img}' alt='Card image cap'>
        <div class='card-body p-0 pl-2'>
        <div class='card-info'>${description} '${id}'</div>
        <div class='card-info'>Стоимость: <span class='price font-weight-bold'>${price}</span>p</div>
        <div class='card-info'>Размеры: <br>${sizesBlock}</div>
        <div class='card-info'>
        <button type='button' class='add-to-cart btn btn-link' onclick=addToCart('${id}')>
        <svg class='bi bi-cart-plus align-middle' width='1.2em' height='1.2em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
        <path fill-rule='evenodd' d='M8.5 5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 .5-.5z'/>
        <path fill-rule='evenodd' d='M8 7.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0v-2z'/>
        <path fill-rule='evenodd' d='M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'/>
        </svg>
        В корзину</button>
        </div>
        </div>
        </div>`;

    var card = document.createElement('div');
    card.className = 'item float-left col-6 col-lg-3 p-0 p-lg-3';
    card.innerHTML = cardString;

    listBlock.appendChild(card);
}

function getFilteredData() {

    var filterResult = data;

    var fromPriceField = document.getElementById('from-price');
    var toPriceField = document.getElementById('to-price');
    var fromPrice = fromPriceField.value === "" ? 0 : fromPriceField.value;
    var toPrice = toPriceField.value === "" ? 99999999 : toPriceField.value;
    if (fromPrice !== 0 || toPrice !== 99999999) {
        var priceF = new Map;
        for (var [id, item] of filterResult.entries()) {
            if (item.price >= fromPrice && item.price <= toPrice) {
                priceF.set(id, item);
            }
        }
        filterResult = priceF;
    }

    var sizeFilterElement = document.getElementById('filter-size').getElementsByClassName("active")[0];
    if (sizeFilterElement.id !== 'filter-all') {
        var sizeF = new Map;
        var sizeFilter = sizeFilterElement.innerText.trim().toLowerCase();
        for (var [id, item] of filterResult.entries()) {
            if (item.size_in_stock.includes(sizeFilter)) {
                sizeF.set(id, item);
            }
        }
        filterResult = sizeF;
    }

    return filterResult;
}

function releaseFilter() {
    document.getElementById('from-price').value = "";
    document.getElementById('to-price').value = "";

    var filterSize = document.getElementById('filter-size');
    for (var item of filterSize.getElementsByClassName("btn")) {
        if (item.id === 'filter-all') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    }

    showAllItems();
}

function showAllItems() {
    var listBlock = document.getElementById('item-list-block');
    listBlock.innerHTML = "";

    var filteredData = getFilteredData();

    for (var [key, value] of filteredData.entries()) {
        showItem(key, value);
    }
}

function addToCart(id) {
    var targetItem = document.getElementById(id);

    var sizeButtons = targetItem.getElementsByClassName('item-sizes')[0].getElementsByClassName("active");
    if (sizeButtons.length === 0) {
        alert("Размер не выбран.")
    } else {
        var targetSize = targetItem.getElementsByClassName('item-sizes')[0].getElementsByClassName("active")[0]
            .innerText.toLowerCase();

        var key = CartItemKey(id, targetSize)

        if (cart.has(key)) {
            cart.set(key, cart.get(key) + 1);
        } else {
            cart.set(key, 1);
        }
        createCartHtml();
    }
}

function plusToCart(id, size) {
    var key = CartItemKey(id, size);

    cart.set(key, cart.get(key) + 1);

    createCartHtml();
    activateCartPopover();
}

function removeFromCart(id, size) {
    var key = CartItemKey(id, size);

    if (cart.get(key) === 1) {
        cart.delete(key);

    } else if (cart.get(key) > 1) {
        cart.set(key, cart.get(key) - 1);
    }

    createCartHtml();
    activateCartPopover();
}

function removeAllFromCart(id, size) {
    var key = CartItemKey(id, size);

    cart.delete(key);
    createCartHtml();
    activateCartPopover();
}

function changeNewCartItemCount(id, size, count) {
    var key = CartItemKey(id, size);
    var cartItemId = `cart-item-${id}-${size}`;

    if (count === 0){
        cart.delete(key);

        if (cart.size === 0){
            createCartHtml();
            activateCartPopover();
        } else {
            document.getElementById(cartItemId).remove();
        }
    } else {
        var newCount = cart.get(key) + count;
        var newPrice = newCount * data.get(id).price;

        cart.set(key, newCount);

        if (newCount === 0){
            changeNewCartItemCount(id, size, newCount);
        } else {
            document.getElementById(cartItemId).getElementsByClassName("cart-count")[0].innerHTML = newCount;
            document.getElementById(cartItemId).getElementsByClassName("cart-full-price")[0].innerHTML = newPrice;
        }
    }
    changeCartTotalPrice();
}

function cleanCart() {
    cart.clear();
    createCartHtml();
    activateCartPopover();
}

function createCartHtml() {

    if (cart.size === 0) {
        initCartPopover('Корзина пуста');
    } else {
        var contentString = "";

        var totalPrice = 0;

        for (var [key, count] of cart.entries()) {
            var id = key.split(",")[0];
            var size = key.split(",")[1];
            var item = data.get(id);
            var img = item.img;
            var price = item.price;

            contentString +=
                `<div id='cart-item-${id}-${size}' class='cart-item w-100 float-left mx-auto'>
                <div class='cart-item-img float-left w-25'>
                <img class='w-100' src='${img}'>
                </div>
                <div class='cart-item-info float-left w-75'>
                '<span class='cart-item-name'>${id}</span>'<br>
                Размер: <span class='font-weight-bold cart-size'>${size.toUpperCase()}</span><br>
                Стоимость: <span class='font-weight-bold cart-price'>${price}</span>p<br>
                Количество:
                <button type='button' class='cart-item-minus-button btn btn-outline-success p-0' onclick="changeNewCartItemCount('${id}', '${size}', -1)">-</button>
                <span class='font-weight-bold cart-count'>${count}</span>
                <button type='button' class='cart-item-plus-button btn btn-outline-success p-0' onclick="changeNewCartItemCount('${id}', '${size}', 1)">+</button><br>
                Общая стоимость: <span class='font-weight-bold cart-full-price'>${price * count}</span>p<br>
                <button type='button' class='cart-remove-from btn btn-link' onclick="changeNewCartItemCount('${id}', '${size}', 0)">
                <svg class='bi bi-cart-dash align-middle' width='1.2em' height='1.2em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                <path fill-rule='evenodd' d='M6 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z'/>
                <path fill-rule='evenodd' d='M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'/>
                </svg>
                Удалить из корзины
                </button>
                </div>
                </div>`;

            totalPrice += price * count;

        }

        contentString +=
            `<div id="cart-total-info">
            Итоговая стоимость: <span id='cart-total-price' class="font-weight-bold">${totalPrice}</span>p<br>
            <button type='button' id="cart-clean" class='btn btn-link p-2' onclick="cleanCart()">
                <svg class='bi bi-cart-dash align-middle' width='1.2em' height='1.2em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                    <path fill-rule='evenodd' d='M6 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z'/>
                    <path fill-rule='evenodd' d='M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'/>
                </svg>
                Очистить корзину
            </button><br>
            <button type='button' id='cart-send-order' class='btn btn-outline-success p-2' onclick="makeOrder()">
                Оформить заказ
            </button>
            </div>`;

        initCartPopover(contentString);
    }
}

function changeCartTotalPrice() {
    if (cart.size !== 0) {
        var totalPrice = 0;

        for (var [key, count] of cart.entries()) {
            var id = key.split(",")[0];
            var item = data.get(id);
            var price = item.price;

            totalPrice += price * count;
        }
        document.getElementById('cart-total-price').innerHTML = totalPrice;
    }
}

function makeOrder() {
    document.getElementById('item-list-block').classList.add("d-none");
    document.getElementById('filter-block').classList.add("d-none");

    document.getElementById('cart-button').classList.add("disabled");
    $('#cart-button').popover('hide').popover('dispose');

    document.getElementById('order-block').classList.remove("d-none");

    var totalPrice = 0;
    var totalCount = 0;

    var orderListString = "";

    for (var [key, count] of cart.entries()) {
        var id = key.split(",")[0];
        var size = key.split(",")[1];
        var item = data.get(id);
        var description = item.description;
        var img = item.img;
        var price = item.price;

        orderListString +=
            `<div class="item col-6 col-lg-3 p-0 p-lg-3">
                <div id='${id}' class='order-list-item card'>
                    <img class='card-img-top' src='${img}' alt='Card image cap'>
                    <div class='card-body p-0 pl-2'>
                        <div class='card-info'>${description} '${id}'</div>
                        <div class='card-info'>Размер: <span class='size font-weight-bold'>${size}</span></div>
                        <div class='card-info'>Стоимость: <span class='price font-weight-bold'>${price}</span>p</div>
                        <div class='card-info'>Количество: <span class='count font-weight-bold'>${count}</span></div>
                        <div class='card-info'>Общая стоимость: <span class='total-price font-weight-bold'>${price * count}</span>p</div>
                    </div>
                </div>
            </div>`;

        totalPrice += price * count;
        totalCount += count;

        $('#full-name').val(username);

    }

    $('#order-total-price').val(totalPrice);
    $('#order-total-count').val(totalCount);

    var status = getClientStatus();
    var orderTotalPriceWithStatus = totalPrice * (1 - status.discount);
    $('#order-total-price-with-status').val(orderTotalPriceWithStatus);
    $('#order-status').val(status.name);

    $('#order-points-count').val(orderTotalPriceWithStatus * 0.1);

    document.getElementById('order-list').innerHTML = orderListString;

}

function sendOrder() {
    var detailsForm = document.getElementById('order-details-form');
    if (detailsForm.checkValidity() === true) {
        document.getElementById('order-controls').classList.add("d-none");

        clientPoints += parseInt($('#order-points-count').val());
        username = $('#full-name').val();
        showClientInformation();
    }
}

function closeOrder() {
    cart = new Map();

    document.getElementById('item-list-block').classList.remove("d-none");
    document.getElementById('filter-block').classList.remove("d-none");

    document.getElementById('cart-button').classList.remove("disabled");
    createCartHtml();

    document.getElementById('order-block').classList.add("d-none");
    document.getElementById('order-controls').classList.remove("d-none");

    $('#submit-order-decline').collapse('hide');
    $('#submit-order-success').collapse('hide');
}

function cancelDeclineOrder() {
    $('#submit-order-decline').collapse('hide');
}

function showClientInformation() {
    document.getElementById('username').innerText = username;

    document.getElementById('client-bar').classList.remove("d-none");

    document.getElementById("bonus-points").innerText = clientPoints;

    var status = getClientStatus();
    document.getElementById('client-status').innerText = status.name;
    document.getElementById('client-discount').innerText = 100 * status.discount;

    var nextStatus;
    for (var obj of clientStatuses) {
        if (obj.points > clientPoints) {
            nextStatus = obj;
            break;
        }
    }
    if (nextStatus === undefined) {
        document.getElementById('next-client-status-points-remains').innerText = "У вас максимальный уровень!";
    } else {
        var remains = nextStatus.points - clientPoints;
        document.getElementById('next-client-status-points-remains').innerText = remains;
    }

}

function getClientStatus() {
    var res;
    for (var obj of clientStatuses) {
        if (obj.points <= clientPoints) {
            res = obj;
        }
    }
    return res;
}

function addValidationForOrderDetails() {
    var submitOrderButton = document.getElementById('submit-order-button');
    submitOrderButton.addEventListener('click', function (event) {
        var detailsForm = document.getElementById('order-details-form');
        if (detailsForm.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        detailsForm.classList.add('was-validated');
    })
}

function initCartPopover(contentString) {
    $('#cart-button').popover('hide').popover('dispose').popover({
        placement: 'left',
        container: 'body',
        html: true,
        content: contentString
    }).on('show.bs.popover', function () {
        document.getElementById("cart-button").innerHTML =
            `<svg class="bi bi-x align-middle" width='1.5em' height='1.5em' viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
            </svg>Закрыть`;
    }).on('hide.bs.popover', function () {
        document.getElementById("cart-button").innerHTML =
            `<svg class="bi bi-cart4 align-middle" width='1.5em' height='1.5em' viewBox="0 0 16 16"
                         fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                    </svg>
                        Корзина`;
    })
}

function activateCartPopover() {
    $('#cart-button').popover('show').click();
}