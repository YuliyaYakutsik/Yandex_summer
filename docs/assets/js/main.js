(function () {
    'use strict';

    var cards = [],
        sortedCards = [],
        arrivalPoint;

    // Функция addCard добавляет карточку в массив cards. Входные данные будуд представлять массив из объектов.
    function addCard(departure, arrival, transport, number, seat, notes) {
        cards.push({
            departure: departure,
            arrival: arrival,
            transport: transport,
            number: number,
            seat: seat,
            notes: notes
        });
    }

    // Добавляем карточки.
    addCard('Minsk', 'Rome', 'plane', '21', '23D', '');
    addCard('Rome', 'Venice', 'train', '', '57', '');
    addCard('Venice', 'Rimini', 'train', '23A', '', 'Relax');
    addCard('Rimini', 'Barcelona', 'train', '', '45', '');
    addCard('Barcelona', 'Malaga', 'plane', '25', '12A', 'You go home');

    // Вешаем обработчик на кнопку, чтобы начал сортировать.
    var link = document.getElementById('cards__link');
    if (link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (!link.classList.contains('active')) {
                // Запускаем сортировку массива cards. Отсортированный массив будет лежать в sortedCards.
                sortCards(cards, sortedCards);
                link.classList.toggle('active');
            }
        });
    }

    // Функция sortCards запускает сортировку карточек для построения маршрута.
    function sortCards(cards, sortedCards) {
        if (firstCard(cards, sortedCards) !== false) {
            makeTrip(cards, sortedCards);
            printTrip(sortedCards);
        }
    }

    /* Функция firstCard:
    1) Делает проверку массива на наличие ошибок во входящих данных (одинаковый начальный и конечный пункт в одной из карточек;
                                                                    отсутствие начального или конечного пункта в одной из карточек;
                                                                    одинаковый начальный и конечный пункт всего маршрута;)
    2) Находит во входящем массиве cards карточку, которая соответствует началу маршрута;
    3) Кладет найденную карточку в начало массива sortedCards, который содержит отсортированные карточки.*/
    function firstCard(cards, sortedCards) {
        var arrivals = [],
            f = 0;

        for (var i=0; i<cards.length;i++) {
            // проверка на одинаковый начальный и конечный пункт в карточке.
            if (cards[i].departure.toUpperCase() == cards[i].arrival.toUpperCase()) {
              errorAlert('wrongCard');
              return false;
            }
            // проверка на отсутствие начального или конечного пункта в карточке.
            if (cards[i].departure.replace(' ', '') == '' || cards[i].arrival.replace(' ', '') == '') {
              errorAlert('missPointInCard');
              return false;
            }
        }

        // получаем массив всех точек прибытия.
        for (var i=0; i<cards.length;i++) {
            arrivals.push(cards[i].arrival.toUpperCase()); 
        }

        // находим карточку начала маршрута.
        for (var i=0; i<cards.length;i++) {
            if (arrivals.indexOf(cards[i].departure.toUpperCase()) == -1) {
              sortedCards.push(cards[i]);
              arrivalPoint = cards[i].arrival;
              cards.splice(i,1);
              f += 1;
              break;
            }
        }
      
        // проверка на одинаковый начальный или конечный пункт всего маршрута.
        if (f == 0){
            errorAlert('firstCard');
            return false;
        } 

    }

    // Функция makeTrip составляет массив sortedCards, который содержит отсортированные карточки.
    function makeTrip(cards, sortedCards) {

        if (cards.length >0) {
            for (var i=0; i<cards.length;i++) {
                if (cards[i].departure.toUpperCase() == arrivalPoint.toUpperCase()) {
                    sortedCards.push(cards[i]);
                    arrivalPoint = cards[i].arrival;
                    cards.splice(i,1);
                    break;
                }
            }
        } else {
            return false;
        }

        // рекурсивно запускаем функцию makeTrip (пока не положим в отсортированный массив все имеющиеся карточки).
        makeTrip(cards, sortedCards);

    }

    // Функция printTrip выводит словесное описание маршрута на экран.
    function printTrip(sortedCards) {
        var element = document.getElementById('cards__trip'),
            result = '';
            //var element2 = document.getElementById('trip2');
            //var result2 = "";

        for (var i=0; i<sortedCards.length;i++) {
            if (sortedCards[i].transport !== '') {
                result += (i+1) + ') Take '+sortedCards[i].transport + ' ';
                if (sortedCards[i].number !== '') {
                    result += sortedCards[i].number + ' ';
                } 
            } else {
                result += (i+1) + ') Take some transport ';
            }
            result += 'from ' + sortedCards[i].departure + ' to ' + sortedCards[i].arrival;
            if (sortedCards[i].seat !== '') {
                result += '. Your seat is ' + sortedCards[i].seat + '.';
            } else {
                result += '. No seat assignment. ';
            }
            if (sortedCards[i].notes !== '') {
                result += sortedCards[i].notes.charAt(0).toUpperCase() + sortedCards[i].notes.slice(1) + '. \n';
            } else {
                result += '\n';
            } 
        }
      
        element.innerText = result;
      
          /*element1.innerText = result1;
          for(var card in sortedCards){
            result2 += parseInt(card)+1 + ') ';
            for(var key in sortedCards[card]){
              if(sortedCards[card][key] !== '') {
                result2 += key.charAt(0).toUpperCase() + key.slice(1) + ": " + sortedCards[card][key] + '\n';
                element2.innerText = result2;
              }
            }
          }
          */
    }

    // Функция errorAlert выводит предупреждение об ошибках в заданных карточках.
    function errorAlert(errorType) {
        switch (errorType) {
            case 'firstCard': 
                alert('Ошибка в маршруте one-way. Начальный и конечный пункт маршрута совпадают.'); 
                break;
            case 'wrongCard': 
                alert('Начальный и конечный пункты в карточке совподают.'); 
                break;
            case 'missPointInCard': 
                alert('Пустая точка начального/конечного пункта в карточке.'); 
                break;
            case 'missCard': 
                alert('Пропущена карточка в маршруте.'); 
                break;
            default: sortCards(cards,sortedCards);
        }
    }

})();
(function () {
    'use strict';

    /* Функция getElement получает список нужных объектов, если такие есть на сранице, иначе - false (selector - задаваемый селектор) */
    function getElement (selector) {
        if (selector.length) {
            var element;
        
            if (document.getElementsByTagName(selector).length) {
                element = document.getElementsByTagName(selector);
            } else {
                element = document.querySelectorAll(selector);
            }
        
            if (element) return element;
        }
        
        return false;
    }

    /* Функция removeClass удаляет класс className из объектов name на странице 
    (numOfItem - порядковый номер нужного объекта, если хотим взять только один элемент с таким селетором, а не все)*/
    function removeClass (className, name, numOfItem) {
        var objects = getElement(name);
       
        if (!(numOfItem+1)) {
            for (var i = 0; i < objects.length; i++) {
                objects[i].classList.remove(className);
            }
        } else {
            objects[numOfItem-1].classList.remove(className);
        }
    }

    /* Функция addClass добавляет класс className объектам name на странице 
    (numOfItem - порядковый номер нужного объекта, если хотим взять только один элемент с таким селетором, а не все)*/
    function addClass (className, name, numOfItem) {
        var objects = getElement(name);
        if(!(numOfItem+1)){
            for (var i = 0; i < objects.length; i++) {
            objects[i].classList.add(className);
            }
        } else {
            objects[numOfItem-1].classList.add(className);
        }
    }

    /* Функция toggleClass переключает класс className в объектах name 
    (numOfItem - порядковый номер нужного объекта, если хотим взять только один элемент с таким селетором, а не все)*/
    function toggleClass (className, name, numOfItem) {
        var objects = getElement(name);
        if(!(numOfItem+1)){ 
            for (var i = 0; i < objects.length; i++) {
            objects[i].classList.toggle(className);
            }
        } else {
            objects[numOfItem-1].classList.toggle(className);
        }
    }

    var addButton1 = document.getElementById('DOM__link_addClass'),
        addButton2 = document.getElementById('DOM__link_addId'),
        addButton3 = document.getElementById('DOM__link_addP'),
        removeButton1 = document.getElementById('DOM__link_removeClass'),
        removeButton2 = document.getElementById('DOM__link_removeId'),
        removeButton3 = document.getElementById('DOM__link_removeP'),
        toggleButton1 = document.getElementById('DOM__link_toggleClass'),
        toggleButton2 = document.getElementById('DOM__link_toggleId'),
        toggleButton3 = document.getElementById('DOM__link_toggleP');

    addButton1.addEventListener('click', function(e) {
        e.preventDefault();
        addClass ('new', '.DOM__trip');
    });

    addButton2.addEventListener('click', function(e) {
        e.preventDefault();
        addClass ('new', '#DOM__trip');
    });

    addButton3.addEventListener('click', function(e) {
        e.preventDefault();
        addClass ('new', 'p');
    });

    removeButton1.addEventListener('click', function(e) {
        e.preventDefault();
        removeClass ('new', '.DOM__trip');
    });

    removeButton2.addEventListener('click', function(e) {
        e.preventDefault();
        removeClass ('new', '#DOM__trip');
    });

    removeButton3.addEventListener('click', function(e) {
        e.preventDefault();
        removeClass ('new', 'p');
    });

    toggleButton1.addEventListener('click', function(e) {
        e.preventDefault();
        toggleClass ('new', '.DOM__trip');
    });

    toggleButton2.addEventListener('click', function(e) {
        e.preventDefault();
        toggleClass ('new', '#DOM__trip');
    });

    toggleButton3.addEventListener('click', function(e) {
        e.preventDefault();
        toggleClass ('new', 'p');
    });

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmRzL2NhcmRzLmpzIiwiRE9NL0RPTS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIGNhcmRzID0gW10sXHJcbiAgICAgICAgc29ydGVkQ2FyZHMgPSBbXSxcclxuICAgICAgICBhcnJpdmFsUG9pbnQ7XHJcblxyXG4gICAgLy8g0KTRg9C90LrRhtC40Y8gYWRkQ2FyZCDQtNC+0LHQsNCy0LvRj9C10YIg0LrQsNGA0YLQvtGH0LrRgyDQsiDQvNCw0YHRgdC40LIgY2FyZHMuINCS0YXQvtC00L3Ri9C1INC00LDQvdC90YvQtSDQsdGD0LTRg9C0INC/0YDQtdC00YHRgtCw0LLQu9GP0YLRjCDQvNCw0YHRgdC40LIg0LjQtyDQvtCx0YrQtdC60YLQvtCyLlxyXG4gICAgZnVuY3Rpb24gYWRkQ2FyZChkZXBhcnR1cmUsIGFycml2YWwsIHRyYW5zcG9ydCwgbnVtYmVyLCBzZWF0LCBub3Rlcykge1xyXG4gICAgICAgIGNhcmRzLnB1c2goe1xyXG4gICAgICAgICAgICBkZXBhcnR1cmU6IGRlcGFydHVyZSxcclxuICAgICAgICAgICAgYXJyaXZhbDogYXJyaXZhbCxcclxuICAgICAgICAgICAgdHJhbnNwb3J0OiB0cmFuc3BvcnQsXHJcbiAgICAgICAgICAgIG51bWJlcjogbnVtYmVyLFxyXG4gICAgICAgICAgICBzZWF0OiBzZWF0LFxyXG4gICAgICAgICAgICBub3Rlczogbm90ZXNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQlNC+0LHQsNCy0LvRj9C10Lwg0LrQsNGA0YLQvtGH0LrQuC5cclxuICAgIGFkZENhcmQoJ01pbnNrJywgJ1JvbWUnLCAncGxhbmUnLCAnMjEnLCAnMjNEJywgJycpO1xyXG4gICAgYWRkQ2FyZCgnUm9tZScsICdWZW5pY2UnLCAndHJhaW4nLCAnJywgJzU3JywgJycpO1xyXG4gICAgYWRkQ2FyZCgnVmVuaWNlJywgJ1JpbWluaScsICd0cmFpbicsICcyM0EnLCAnJywgJ1JlbGF4Jyk7XHJcbiAgICBhZGRDYXJkKCdSaW1pbmknLCAnQmFyY2Vsb25hJywgJ3RyYWluJywgJycsICc0NScsICcnKTtcclxuICAgIGFkZENhcmQoJ0JhcmNlbG9uYScsICdNYWxhZ2EnLCAncGxhbmUnLCAnMjUnLCAnMTJBJywgJ1lvdSBnbyBob21lJyk7XHJcblxyXG4gICAgLy8g0JLQtdGI0LDQtdC8INC+0LHRgNCw0LHQvtGC0YfQuNC6INC90LAg0LrQvdC+0L/QutGDLCDRh9GC0L7QsdGLINC90LDRh9Cw0Lsg0YHQvtGA0YLQuNGA0L7QstCw0YLRjC5cclxuICAgIHZhciBsaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmRzX19saW5rJyk7XHJcbiAgICBpZiAobGluaykge1xyXG4gICAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgaWYgKCFsaW5rLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgIC8vINCX0LDQv9GD0YHQutCw0LXQvCDRgdC+0YDRgtC40YDQvtCy0LrRgyDQvNCw0YHRgdC40LLQsCBjYXJkcy4g0J7RgtGB0L7RgNGC0LjRgNC+0LLQsNC90L3Ri9C5INC80LDRgdGB0LjQsiDQsdGD0LTQtdGCINC70LXQttCw0YLRjCDQsiBzb3J0ZWRDYXJkcy5cclxuICAgICAgICAgICAgICAgIHNvcnRDYXJkcyhjYXJkcywgc29ydGVkQ2FyZHMpO1xyXG4gICAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCk0YPQvdC60YbQuNGPIHNvcnRDYXJkcyDQt9Cw0L/Rg9GB0LrQsNC10YIg0YHQvtGA0YLQuNGA0L7QstC60YMg0LrQsNGA0YLQvtGH0LXQuiDQtNC70Y8g0L/QvtGB0YLRgNC+0LXQvdC40Y8g0LzQsNGA0YjRgNGD0YLQsC5cclxuICAgIGZ1bmN0aW9uIHNvcnRDYXJkcyhjYXJkcywgc29ydGVkQ2FyZHMpIHtcclxuICAgICAgICBpZiAoZmlyc3RDYXJkKGNhcmRzLCBzb3J0ZWRDYXJkcykgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG1ha2VUcmlwKGNhcmRzLCBzb3J0ZWRDYXJkcyk7XHJcbiAgICAgICAgICAgIHByaW50VHJpcChzb3J0ZWRDYXJkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qINCk0YPQvdC60YbQuNGPIGZpcnN0Q2FyZDpcclxuICAgIDEpINCU0LXQu9Cw0LXRgiDQv9GA0L7QstC10YDQutGDINC80LDRgdGB0LjQstCwINC90LAg0L3QsNC70LjRh9C40LUg0L7RiNC40LHQvtC6INCy0L4g0LLRhdC+0LTRj9GJ0LjRhSDQtNCw0L3QvdGL0YUgKNC+0LTQuNC90LDQutC+0LLRi9C5INC90LDRh9Cw0LvRjNC90YvQuSDQuCDQutC+0L3QtdGH0L3Ri9C5INC/0YPQvdC60YIg0LIg0L7QtNC90L7QuSDQuNC3INC60LDRgNGC0L7Rh9C10Lo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg0L7RgtGB0YPRgtGB0YLQstC40LUg0L3QsNGH0LDQu9GM0L3QvtCz0L4g0LjQu9C4INC60L7QvdC10YfQvdC+0LPQviDQv9GD0L3QutGC0LAg0LIg0L7QtNC90L7QuSDQuNC3INC60LDRgNGC0L7Rh9C10Lo7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg0L7QtNC40L3QsNC60L7QstGL0Lkg0L3QsNGH0LDQu9GM0L3Ri9C5INC4INC60L7QvdC10YfQvdGL0Lkg0L/Rg9C90LrRgiDQstGB0LXQs9C+INC80LDRgNGI0YDRg9GC0LA7KVxyXG4gICAgMikg0J3QsNGF0L7QtNC40YIg0LLQviDQstGF0L7QtNGP0YnQtdC8INC80LDRgdGB0LjQstC1IGNhcmRzINC60LDRgNGC0L7Rh9C60YMsINC60L7RgtC+0YDQsNGPINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPQtdGCINC90LDRh9Cw0LvRgyDQvNCw0YDRiNGA0YPRgtCwO1xyXG4gICAgMykg0JrQu9Cw0LTQtdGCINC90LDQudC00LXQvdC90YPRjiDQutCw0YDRgtC+0YfQutGDINCyINC90LDRh9Cw0LvQviDQvNCw0YHRgdC40LLQsCBzb3J0ZWRDYXJkcywg0LrQvtGC0L7RgNGL0Lkg0YHQvtC00LXRgNC20LjRgiDQvtGC0YHQvtGA0YLQuNGA0L7QstCw0L3QvdGL0LUg0LrQsNGA0YLQvtGH0LrQuC4qL1xyXG4gICAgZnVuY3Rpb24gZmlyc3RDYXJkKGNhcmRzLCBzb3J0ZWRDYXJkcykge1xyXG4gICAgICAgIHZhciBhcnJpdmFscyA9IFtdLFxyXG4gICAgICAgICAgICBmID0gMDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPGNhcmRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQvdCwINC+0LTQuNC90LDQutC+0LLRi9C5INC90LDRh9Cw0LvRjNC90YvQuSDQuCDQutC+0L3QtdGH0L3Ri9C5INC/0YPQvdC60YIg0LIg0LrQsNGA0YLQvtGH0LrQtS5cclxuICAgICAgICAgICAgaWYgKGNhcmRzW2ldLmRlcGFydHVyZS50b1VwcGVyQ2FzZSgpID09IGNhcmRzW2ldLmFycml2YWwudG9VcHBlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgIGVycm9yQWxlcnQoJ3dyb25nQ2FyZCcpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyDQv9GA0L7QstC10YDQutCwINC90LAg0L7RgtGB0YPRgtGB0YLQstC40LUg0L3QsNGH0LDQu9GM0L3QvtCz0L4g0LjQu9C4INC60L7QvdC10YfQvdC+0LPQviDQv9GD0L3QutGC0LAg0LIg0LrQsNGA0YLQvtGH0LrQtS5cclxuICAgICAgICAgICAgaWYgKGNhcmRzW2ldLmRlcGFydHVyZS5yZXBsYWNlKCcgJywgJycpID09ICcnIHx8IGNhcmRzW2ldLmFycml2YWwucmVwbGFjZSgnICcsICcnKSA9PSAnJykge1xyXG4gICAgICAgICAgICAgIGVycm9yQWxlcnQoJ21pc3NQb2ludEluQ2FyZCcpO1xyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0L/QvtC70YPRh9Cw0LXQvCDQvNCw0YHRgdC40LIg0LLRgdC10YUg0YLQvtGH0LXQuiDQv9GA0LjQsdGL0YLQuNGPLlxyXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxjYXJkcy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIGFycml2YWxzLnB1c2goY2FyZHNbaV0uYXJyaXZhbC50b1VwcGVyQ2FzZSgpKTsgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQvdCw0YXQvtC00LjQvCDQutCw0YDRgtC+0YfQutGDINC90LDRh9Cw0LvQsCDQvNCw0YDRiNGA0YPRgtCwLlxyXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxjYXJkcy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChhcnJpdmFscy5pbmRleE9mKGNhcmRzW2ldLmRlcGFydHVyZS50b1VwcGVyQ2FzZSgpKSA9PSAtMSkge1xyXG4gICAgICAgICAgICAgIHNvcnRlZENhcmRzLnB1c2goY2FyZHNbaV0pO1xyXG4gICAgICAgICAgICAgIGFycml2YWxQb2ludCA9IGNhcmRzW2ldLmFycml2YWw7XHJcbiAgICAgICAgICAgICAgY2FyZHMuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgZiArPSAxO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICAvLyDQv9GA0L7QstC10YDQutCwINC90LAg0L7QtNC40L3QsNC60L7QstGL0Lkg0L3QsNGH0LDQu9GM0L3Ri9C5INC40LvQuCDQutC+0L3QtdGH0L3Ri9C5INC/0YPQvdC60YIg0LLRgdC10LPQviDQvNCw0YDRiNGA0YPRgtCwLlxyXG4gICAgICAgIGlmIChmID09IDApe1xyXG4gICAgICAgICAgICBlcnJvckFsZXJ0KCdmaXJzdENhcmQnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vINCk0YPQvdC60YbQuNGPIG1ha2VUcmlwINGB0L7RgdGC0LDQstC70Y/QtdGCINC80LDRgdGB0LjQsiBzb3J0ZWRDYXJkcywg0LrQvtGC0L7RgNGL0Lkg0YHQvtC00LXRgNC20LjRgiDQvtGC0YHQvtGA0YLQuNGA0L7QstCw0L3QvdGL0LUg0LrQsNGA0YLQvtGH0LrQuC5cclxuICAgIGZ1bmN0aW9uIG1ha2VUcmlwKGNhcmRzLCBzb3J0ZWRDYXJkcykge1xyXG5cclxuICAgICAgICBpZiAoY2FyZHMubGVuZ3RoID4wKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxjYXJkcy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FyZHNbaV0uZGVwYXJ0dXJlLnRvVXBwZXJDYXNlKCkgPT0gYXJyaXZhbFBvaW50LnRvVXBwZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzb3J0ZWRDYXJkcy5wdXNoKGNhcmRzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICBhcnJpdmFsUG9pbnQgPSBjYXJkc1tpXS5hcnJpdmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmRzLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YDQtdC60YPRgNGB0LjQstC90L4g0LfQsNC/0YPRgdC60LDQtdC8INGE0YPQvdC60YbQuNGOIG1ha2VUcmlwICjQv9C+0LrQsCDQvdC1INC/0L7Qu9C+0LbQuNC8INCyINC+0YLRgdC+0YDRgtC40YDQvtCy0LDQvdC90YvQuSDQvNCw0YHRgdC40LIg0LLRgdC1INC40LzQtdGO0YnQuNC10YHRjyDQutCw0YDRgtC+0YfQutC4KS5cclxuICAgICAgICBtYWtlVHJpcChjYXJkcywgc29ydGVkQ2FyZHMpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyDQpNGD0L3QutGG0LjRjyBwcmludFRyaXAg0LLRi9Cy0L7QtNC40YIg0YHQu9C+0LLQtdGB0L3QvtC1INC+0L/QuNGB0LDQvdC40LUg0LzQsNGA0YjRgNGD0YLQsCDQvdCwINGN0LrRgNCw0L0uXHJcbiAgICBmdW5jdGlvbiBwcmludFRyaXAoc29ydGVkQ2FyZHMpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkc19fdHJpcCcpLFxyXG4gICAgICAgICAgICByZXN1bHQgPSAnJztcclxuICAgICAgICAgICAgLy92YXIgZWxlbWVudDIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJpcDInKTtcclxuICAgICAgICAgICAgLy92YXIgcmVzdWx0MiA9IFwiXCI7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxzb3J0ZWRDYXJkcy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChzb3J0ZWRDYXJkc1tpXS50cmFuc3BvcnQgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gKGkrMSkgKyAnKSBUYWtlICcrc29ydGVkQ2FyZHNbaV0udHJhbnNwb3J0ICsgJyAnO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNvcnRlZENhcmRzW2ldLm51bWJlciAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gc29ydGVkQ2FyZHNbaV0ubnVtYmVyICsgJyAnO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAoaSsxKSArICcpIFRha2Ugc29tZSB0cmFuc3BvcnQgJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQgKz0gJ2Zyb20gJyArIHNvcnRlZENhcmRzW2ldLmRlcGFydHVyZSArICcgdG8gJyArIHNvcnRlZENhcmRzW2ldLmFycml2YWw7XHJcbiAgICAgICAgICAgIGlmIChzb3J0ZWRDYXJkc1tpXS5zZWF0ICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcuIFlvdXIgc2VhdCBpcyAnICsgc29ydGVkQ2FyZHNbaV0uc2VhdCArICcuJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAnLiBObyBzZWF0IGFzc2lnbm1lbnQuICc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNvcnRlZENhcmRzW2ldLm5vdGVzICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IHNvcnRlZENhcmRzW2ldLm5vdGVzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc29ydGVkQ2FyZHNbaV0ubm90ZXMuc2xpY2UoMSkgKyAnLiBcXG4nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9ICdcXG4nO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgZWxlbWVudC5pbm5lclRleHQgPSByZXN1bHQ7XHJcbiAgICAgIFxyXG4gICAgICAgICAgLyplbGVtZW50MS5pbm5lclRleHQgPSByZXN1bHQxO1xyXG4gICAgICAgICAgZm9yKHZhciBjYXJkIGluIHNvcnRlZENhcmRzKXtcclxuICAgICAgICAgICAgcmVzdWx0MiArPSBwYXJzZUludChjYXJkKSsxICsgJykgJztcclxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gc29ydGVkQ2FyZHNbY2FyZF0pe1xyXG4gICAgICAgICAgICAgIGlmKHNvcnRlZENhcmRzW2NhcmRdW2tleV0gIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQyICs9IGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zbGljZSgxKSArIFwiOiBcIiArIHNvcnRlZENhcmRzW2NhcmRdW2tleV0gKyAnXFxuJztcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQyLmlubmVyVGV4dCA9IHJlc3VsdDI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAqL1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCk0YPQvdC60YbQuNGPIGVycm9yQWxlcnQg0LLRi9Cy0L7QtNC40YIg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtSDQvtCxINC+0YjQuNCx0LrQsNGFINCyINC30LDQtNCw0L3QvdGL0YUg0LrQsNGA0YLQvtGH0LrQsNGFLlxyXG4gICAgZnVuY3Rpb24gZXJyb3JBbGVydChlcnJvclR5cGUpIHtcclxuICAgICAgICBzd2l0Y2ggKGVycm9yVHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdmaXJzdENhcmQnOiBcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfQntGI0LjQsdC60LAg0LIg0LzQsNGA0YjRgNGD0YLQtSBvbmUtd2F5LiDQndCw0YfQsNC70YzQvdGL0Lkg0Lgg0LrQvtC90LXRh9C90YvQuSDQv9GD0L3QutGCINC80LDRgNGI0YDRg9GC0LAg0YHQvtCy0L/QsNC00LDRjtGCLicpOyBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd3cm9uZ0NhcmQnOiBcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfQndCw0YfQsNC70YzQvdGL0Lkg0Lgg0LrQvtC90LXRh9C90YvQuSDQv9GD0L3QutGC0Ysg0LIg0LrQsNGA0YLQvtGH0LrQtSDRgdC+0LLQv9C+0LTQsNGO0YIuJyk7IFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ21pc3NQb2ludEluQ2FyZCc6IFxyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ9Cf0YPRgdGC0LDRjyDRgtC+0YfQutCwINC90LDRh9Cw0LvRjNC90L7Qs9C+L9C60L7QvdC10YfQvdC+0LPQviDQv9GD0L3QutGC0LAg0LIg0LrQsNGA0YLQvtGH0LrQtS4nKTsgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbWlzc0NhcmQnOiBcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCfQn9GA0L7Qv9GD0YnQtdC90LAg0LrQsNGA0YLQvtGH0LrQsCDQsiDQvNCw0YDRiNGA0YPRgtC1LicpOyBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBzb3J0Q2FyZHMoY2FyZHMsc29ydGVkQ2FyZHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvKiDQpNGD0L3QutGG0LjRjyBnZXRFbGVtZW50INC/0L7Qu9GD0YfQsNC10YIg0YHQv9C40YHQvtC6INC90YPQttC90YvRhSDQvtCx0YrQtdC60YLQvtCyLCDQtdGB0LvQuCDRgtCw0LrQuNC1INC10YHRgtGMINC90LAg0YHRgNCw0L3QuNGG0LUsINC40L3QsNGH0LUgLSBmYWxzZSAoc2VsZWN0b3IgLSDQt9Cw0LTQsNCy0LDQtdC80YvQuSDRgdC10LvQtdC60YLQvtGAKSAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudCAoc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAoc2VsZWN0b3IubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50O1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoc2VsZWN0b3IpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiDQpNGD0L3QutGG0LjRjyByZW1vdmVDbGFzcyDRg9C00LDQu9GP0LXRgiDQutC70LDRgdGBIGNsYXNzTmFtZSDQuNC3INC+0LHRitC10LrRgtC+0LIgbmFtZSDQvdCwINGB0YLRgNCw0L3QuNGG0LUgXHJcbiAgICAobnVtT2ZJdGVtIC0g0L/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQvdGD0LbQvdC+0LPQviDQvtCx0YrQtdC60YLQsCwg0LXRgdC70Lgg0YXQvtGC0LjQvCDQstC30Y/RgtGMINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRjdC70LXQvNC10L3RgiDRgSDRgtCw0LrQuNC8INGB0LXQu9C10YLQvtGA0L7QvCwg0LAg0L3QtSDQstGB0LUpKi9cclxuICAgIGZ1bmN0aW9uIHJlbW92ZUNsYXNzIChjbGFzc05hbWUsIG5hbWUsIG51bU9mSXRlbSkge1xyXG4gICAgICAgIHZhciBvYmplY3RzID0gZ2V0RWxlbWVudChuYW1lKTtcclxuICAgICAgIFxyXG4gICAgICAgIGlmICghKG51bU9mSXRlbSsxKSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdHNbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2JqZWN0c1tudW1PZkl0ZW0tMV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiDQpNGD0L3QutGG0LjRjyBhZGRDbGFzcyDQtNC+0LHQsNCy0LvRj9C10YIg0LrQu9Cw0YHRgSBjbGFzc05hbWUg0L7QsdGK0LXQutGC0LDQvCBuYW1lINC90LAg0YHRgtGA0LDQvdC40YbQtSBcclxuICAgIChudW1PZkl0ZW0gLSDQv9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINC90YPQttC90L7Qs9C+INC+0LHRitC10LrRgtCwLCDQtdGB0LvQuCDRhdC+0YLQuNC8INCy0LfRj9GC0Ywg0YLQvtC70YzQutC+INC+0LTQuNC9INGN0LvQtdC80LXQvdGCINGBINGC0LDQutC40Lwg0YHQtdC70LXRgtC+0YDQvtC8LCDQsCDQvdC1INCy0YHQtSkqL1xyXG4gICAgZnVuY3Rpb24gYWRkQ2xhc3MgKGNsYXNzTmFtZSwgbmFtZSwgbnVtT2ZJdGVtKSB7XHJcbiAgICAgICAgdmFyIG9iamVjdHMgPSBnZXRFbGVtZW50KG5hbWUpO1xyXG4gICAgICAgIGlmKCEobnVtT2ZJdGVtKzEpKXtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG9iamVjdHNbaV0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2JqZWN0c1tudW1PZkl0ZW0tMV0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiDQpNGD0L3QutGG0LjRjyB0b2dnbGVDbGFzcyDQv9C10YDQtdC60LvRjtGH0LDQtdGCINC60LvQsNGB0YEgY2xhc3NOYW1lINCyINC+0LHRitC10LrRgtCw0YUgbmFtZSBcclxuICAgIChudW1PZkl0ZW0gLSDQv9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINC90YPQttC90L7Qs9C+INC+0LHRitC10LrRgtCwLCDQtdGB0LvQuCDRhdC+0YLQuNC8INCy0LfRj9GC0Ywg0YLQvtC70YzQutC+INC+0LTQuNC9INGN0LvQtdC80LXQvdGCINGBINGC0LDQutC40Lwg0YHQtdC70LXRgtC+0YDQvtC8LCDQsCDQvdC1INCy0YHQtSkqL1xyXG4gICAgZnVuY3Rpb24gdG9nZ2xlQ2xhc3MgKGNsYXNzTmFtZSwgbmFtZSwgbnVtT2ZJdGVtKSB7XHJcbiAgICAgICAgdmFyIG9iamVjdHMgPSBnZXRFbGVtZW50KG5hbWUpO1xyXG4gICAgICAgIGlmKCEobnVtT2ZJdGVtKzEpKXsgXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBvYmplY3RzW2ldLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iamVjdHNbbnVtT2ZJdGVtLTFdLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFkZEJ1dHRvbjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRE9NX19saW5rX2FkZENsYXNzJyksXHJcbiAgICAgICAgYWRkQnV0dG9uMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdET01fX2xpbmtfYWRkSWQnKSxcclxuICAgICAgICBhZGRCdXR0b24zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0RPTV9fbGlua19hZGRQJyksXHJcbiAgICAgICAgcmVtb3ZlQnV0dG9uMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdET01fX2xpbmtfcmVtb3ZlQ2xhc3MnKSxcclxuICAgICAgICByZW1vdmVCdXR0b24yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0RPTV9fbGlua19yZW1vdmVJZCcpLFxyXG4gICAgICAgIHJlbW92ZUJ1dHRvbjMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRE9NX19saW5rX3JlbW92ZVAnKSxcclxuICAgICAgICB0b2dnbGVCdXR0b24xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0RPTV9fbGlua190b2dnbGVDbGFzcycpLFxyXG4gICAgICAgIHRvZ2dsZUJ1dHRvbjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRE9NX19saW5rX3RvZ2dsZUlkJyksXHJcbiAgICAgICAgdG9nZ2xlQnV0dG9uMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdET01fX2xpbmtfdG9nZ2xlUCcpO1xyXG5cclxuICAgIGFkZEJ1dHRvbjEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGFkZENsYXNzICgnbmV3JywgJy5ET01fX3RyaXAnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFkZEJ1dHRvbjIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGFkZENsYXNzICgnbmV3JywgJyNET01fX3RyaXAnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFkZEJ1dHRvbjMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGFkZENsYXNzICgnbmV3JywgJ3AnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJlbW92ZUJ1dHRvbjEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHJlbW92ZUNsYXNzICgnbmV3JywgJy5ET01fX3RyaXAnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJlbW92ZUJ1dHRvbjIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHJlbW92ZUNsYXNzICgnbmV3JywgJyNET01fX3RyaXAnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJlbW92ZUJ1dHRvbjMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHJlbW92ZUNsYXNzICgnbmV3JywgJ3AnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRvZ2dsZUJ1dHRvbjEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRvZ2dsZUNsYXNzICgnbmV3JywgJy5ET01fX3RyaXAnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRvZ2dsZUJ1dHRvbjIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRvZ2dsZUNsYXNzICgnbmV3JywgJyNET01fX3RyaXAnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRvZ2dsZUJ1dHRvbjMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRvZ2dsZUNsYXNzICgnbmV3JywgJ3AnKTtcclxuICAgIH0pO1xyXG5cclxufSkoKTsiXX0=
