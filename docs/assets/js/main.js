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

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcmRzL2NhcmRzLmpzIiwiRE9NL0RPTS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgY2FyZHMgPSBbXSxcclxuICAgICAgICBzb3J0ZWRDYXJkcyA9IFtdLFxyXG4gICAgICAgIGFycml2YWxQb2ludDtcclxuXHJcbiAgICAvLyDQpNGD0L3QutGG0LjRjyBhZGRDYXJkINC00L7QsdCw0LLQu9GP0LXRgiDQutCw0YDRgtC+0YfQutGDINCyINC80LDRgdGB0LjQsiBjYXJkcy4g0JLRhdC+0LTQvdGL0LUg0LTQsNC90L3Ri9C1INCx0YPQtNGD0LQg0L/RgNC10LTRgdGC0LDQstC70Y/RgtGMINC80LDRgdGB0LjQsiDQuNC3INC+0LHRitC10LrRgtC+0LIuXHJcbiAgICBmdW5jdGlvbiBhZGRDYXJkKGRlcGFydHVyZSwgYXJyaXZhbCwgdHJhbnNwb3J0LCBudW1iZXIsIHNlYXQsIG5vdGVzKSB7XHJcbiAgICAgICAgY2FyZHMucHVzaCh7XHJcbiAgICAgICAgICAgIGRlcGFydHVyZTogZGVwYXJ0dXJlLFxyXG4gICAgICAgICAgICBhcnJpdmFsOiBhcnJpdmFsLFxyXG4gICAgICAgICAgICB0cmFuc3BvcnQ6IHRyYW5zcG9ydCxcclxuICAgICAgICAgICAgbnVtYmVyOiBudW1iZXIsXHJcbiAgICAgICAgICAgIHNlYXQ6IHNlYXQsXHJcbiAgICAgICAgICAgIG5vdGVzOiBub3Rlc1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCU0L7QsdCw0LLQu9GP0LXQvCDQutCw0YDRgtC+0YfQutC4LlxyXG4gICAgYWRkQ2FyZCgnTWluc2snLCAnUm9tZScsICdwbGFuZScsICcyMScsICcyM0QnLCAnJyk7XHJcbiAgICBhZGRDYXJkKCdSb21lJywgJ1ZlbmljZScsICd0cmFpbicsICcnLCAnNTcnLCAnJyk7XHJcbiAgICBhZGRDYXJkKCdWZW5pY2UnLCAnUmltaW5pJywgJ3RyYWluJywgJzIzQScsICcnLCAnUmVsYXgnKTtcclxuICAgIGFkZENhcmQoJ1JpbWluaScsICdCYXJjZWxvbmEnLCAndHJhaW4nLCAnJywgJzQ1JywgJycpO1xyXG4gICAgYWRkQ2FyZCgnQmFyY2Vsb25hJywgJ01hbGFnYScsICdwbGFuZScsICcyNScsICcxMkEnLCAnWW91IGdvIGhvbWUnKTtcclxuXHJcbiAgICAvLyDQktC10YjQsNC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40Log0L3QsCDQutC90L7Qv9C60YMsINGH0YLQvtCx0Ysg0L3QsNGH0LDQuyDRgdC+0YDRgtC40YDQvtCy0LDRgtGMLlxyXG4gICAgdmFyIGxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZHNfX2xpbmsnKTtcclxuICAgIGlmIChsaW5rKSB7XHJcbiAgICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoIWxpbmsuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICAgICAgLy8g0JfQsNC/0YPRgdC60LDQtdC8INGB0L7RgNGC0LjRgNC+0LLQutGDINC80LDRgdGB0LjQstCwIGNhcmRzLiDQntGC0YHQvtGA0YLQuNGA0L7QstCw0L3QvdGL0Lkg0LzQsNGB0YHQuNCyINCx0YPQtNC10YIg0LvQtdC20LDRgtGMINCyIHNvcnRlZENhcmRzLlxyXG4gICAgICAgICAgICAgICAgc29ydENhcmRzKGNhcmRzLCBzb3J0ZWRDYXJkcyk7XHJcbiAgICAgICAgICAgICAgICBsaW5rLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0KTRg9C90LrRhtC40Y8gc29ydENhcmRzINC30LDQv9GD0YHQutCw0LXRgiDRgdC+0YDRgtC40YDQvtCy0LrRgyDQutCw0YDRgtC+0YfQtdC6INC00LvRjyDQv9C+0YHRgtGA0L7QtdC90LjRjyDQvNCw0YDRiNGA0YPRgtCwLlxyXG4gICAgZnVuY3Rpb24gc29ydENhcmRzKGNhcmRzLCBzb3J0ZWRDYXJkcykge1xyXG4gICAgICAgIGlmIChmaXJzdENhcmQoY2FyZHMsIHNvcnRlZENhcmRzKSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgbWFrZVRyaXAoY2FyZHMsIHNvcnRlZENhcmRzKTtcclxuICAgICAgICAgICAgcHJpbnRUcmlwKHNvcnRlZENhcmRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyog0KTRg9C90LrRhtC40Y8gZmlyc3RDYXJkOlxyXG4gICAgMSkg0JTQtdC70LDQtdGCINC/0YDQvtCy0LXRgNC60YMg0LzQsNGB0YHQuNCy0LAg0L3QsCDQvdCw0LvQuNGH0LjQtSDQvtGI0LjQsdC+0Log0LLQviDQstGF0L7QtNGP0YnQuNGFINC00LDQvdC90YvRhSAo0L7QtNC40L3QsNC60L7QstGL0Lkg0L3QsNGH0LDQu9GM0L3Ri9C5INC4INC60L7QvdC10YfQvdGL0Lkg0L/Rg9C90LrRgiDQsiDQvtC00L3QvtC5INC40Lcg0LrQsNGA0YLQvtGH0LXQujtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDQvtGC0YHRg9GC0YHRgtCy0LjQtSDQvdCw0YfQsNC70YzQvdC+0LPQviDQuNC70Lgg0LrQvtC90LXRh9C90L7Qs9C+INC/0YPQvdC60YLQsCDQsiDQvtC00L3QvtC5INC40Lcg0LrQsNGA0YLQvtGH0LXQujtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDQvtC00LjQvdCw0LrQvtCy0YvQuSDQvdCw0YfQsNC70YzQvdGL0Lkg0Lgg0LrQvtC90LXRh9C90YvQuSDQv9GD0L3QutGCINCy0YHQtdCz0L4g0LzQsNGA0YjRgNGD0YLQsDspXHJcbiAgICAyKSDQndCw0YXQvtC00LjRgiDQstC+INCy0YXQvtC00Y/RidC10Lwg0LzQsNGB0YHQuNCy0LUgY2FyZHMg0LrQsNGA0YLQvtGH0LrRgywg0LrQvtGC0L7RgNCw0Y8g0YHQvtC+0YLQstC10YLRgdGC0LLRg9C10YIg0L3QsNGH0LDQu9GDINC80LDRgNGI0YDRg9GC0LA7XHJcbiAgICAzKSDQmtC70LDQtNC10YIg0L3QsNC50LTQtdC90L3Rg9GOINC60LDRgNGC0L7Rh9C60YMg0LIg0L3QsNGH0LDQu9C+INC80LDRgdGB0LjQstCwIHNvcnRlZENhcmRzLCDQutC+0YLQvtGA0YvQuSDRgdC+0LTQtdGA0LbQuNGCINC+0YLRgdC+0YDRgtC40YDQvtCy0LDQvdC90YvQtSDQutCw0YDRgtC+0YfQutC4LiovXHJcbiAgICBmdW5jdGlvbiBmaXJzdENhcmQoY2FyZHMsIHNvcnRlZENhcmRzKSB7XHJcbiAgICAgICAgdmFyIGFycml2YWxzID0gW10sXHJcbiAgICAgICAgICAgIGYgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpPTA7IGk8Y2FyZHMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICAvLyDQv9GA0L7QstC10YDQutCwINC90LAg0L7QtNC40L3QsNC60L7QstGL0Lkg0L3QsNGH0LDQu9GM0L3Ri9C5INC4INC60L7QvdC10YfQvdGL0Lkg0L/Rg9C90LrRgiDQsiDQutCw0YDRgtC+0YfQutC1LlxyXG4gICAgICAgICAgICBpZiAoY2FyZHNbaV0uZGVwYXJ0dXJlLnRvVXBwZXJDYXNlKCkgPT0gY2FyZHNbaV0uYXJyaXZhbC50b1VwcGVyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgICAgZXJyb3JBbGVydCgnd3JvbmdDYXJkJyk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vINC/0YDQvtCy0LXRgNC60LAg0L3QsCDQvtGC0YHRg9GC0YHRgtCy0LjQtSDQvdCw0YfQsNC70YzQvdC+0LPQviDQuNC70Lgg0LrQvtC90LXRh9C90L7Qs9C+INC/0YPQvdC60YLQsCDQsiDQutCw0YDRgtC+0YfQutC1LlxyXG4gICAgICAgICAgICBpZiAoY2FyZHNbaV0uZGVwYXJ0dXJlLnJlcGxhY2UoJyAnLCAnJykgPT0gJycgfHwgY2FyZHNbaV0uYXJyaXZhbC5yZXBsYWNlKCcgJywgJycpID09ICcnKSB7XHJcbiAgICAgICAgICAgICAgZXJyb3JBbGVydCgnbWlzc1BvaW50SW5DYXJkJyk7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQv9C+0LvRg9GH0LDQtdC8INC80LDRgdGB0LjQsiDQstGB0LXRhSDRgtC+0YfQtdC6INC/0YDQuNCx0YvRgtC40Y8uXHJcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPGNhcmRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgYXJyaXZhbHMucHVzaChjYXJkc1tpXS5hcnJpdmFsLnRvVXBwZXJDYXNlKCkpOyBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC90LDRhdC+0LTQuNC8INC60LDRgNGC0L7Rh9C60YMg0L3QsNGH0LDQu9CwINC80LDRgNGI0YDRg9GC0LAuXHJcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPGNhcmRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgaWYgKGFycml2YWxzLmluZGV4T2YoY2FyZHNbaV0uZGVwYXJ0dXJlLnRvVXBwZXJDYXNlKCkpID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgc29ydGVkQ2FyZHMucHVzaChjYXJkc1tpXSk7XHJcbiAgICAgICAgICAgICAgYXJyaXZhbFBvaW50ID0gY2FyZHNbaV0uYXJyaXZhbDtcclxuICAgICAgICAgICAgICBjYXJkcy5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgICBmICs9IDE7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgIC8vINC/0YDQvtCy0LXRgNC60LAg0L3QsCDQvtC00LjQvdCw0LrQvtCy0YvQuSDQvdCw0YfQsNC70YzQvdGL0Lkg0LjQu9C4INC60L7QvdC10YfQvdGL0Lkg0L/Rg9C90LrRgiDQstGB0LXQs9C+INC80LDRgNGI0YDRg9GC0LAuXHJcbiAgICAgICAgaWYgKGYgPT0gMCl7XHJcbiAgICAgICAgICAgIGVycm9yQWxlcnQoJ2ZpcnN0Q2FyZCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8g0KTRg9C90LrRhtC40Y8gbWFrZVRyaXAg0YHQvtGB0YLQsNCy0LvRj9C10YIg0LzQsNGB0YHQuNCyIHNvcnRlZENhcmRzLCDQutC+0YLQvtGA0YvQuSDRgdC+0LTQtdGA0LbQuNGCINC+0YLRgdC+0YDRgtC40YDQvtCy0LDQvdC90YvQtSDQutCw0YDRgtC+0YfQutC4LlxyXG4gICAgZnVuY3Rpb24gbWFrZVRyaXAoY2FyZHMsIHNvcnRlZENhcmRzKSB7XHJcblxyXG4gICAgICAgIGlmIChjYXJkcy5sZW5ndGggPjApIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPGNhcmRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYXJkc1tpXS5kZXBhcnR1cmUudG9VcHBlckNhc2UoKSA9PSBhcnJpdmFsUG9pbnQudG9VcHBlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRlZENhcmRzLnB1c2goY2FyZHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGFycml2YWxQb2ludCA9IGNhcmRzW2ldLmFycml2YWw7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZHMuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgNC10LrRg9GA0YHQuNCy0L3QviDQt9Cw0L/Rg9GB0LrQsNC10Lwg0YTRg9C90LrRhtC40Y4gbWFrZVRyaXAgKNC/0L7QutCwINC90LUg0L/QvtC70L7QttC40Lwg0LIg0L7RgtGB0L7RgNGC0LjRgNC+0LLQsNC90L3Ri9C5INC80LDRgdGB0LjQsiDQstGB0LUg0LjQvNC10Y7RidC40LXRgdGPINC60LDRgNGC0L7Rh9C60LgpLlxyXG4gICAgICAgIG1ha2VUcmlwKGNhcmRzLCBzb3J0ZWRDYXJkcyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vINCk0YPQvdC60YbQuNGPIHByaW50VHJpcCDQstGL0LLQvtC00LjRgiDRgdC70L7QstC10YHQvdC+0LUg0L7Qv9C40YHQsNC90LjQtSDQvNCw0YDRiNGA0YPRgtCwINC90LAg0Y3QutGA0LDQvS5cclxuICAgIGZ1bmN0aW9uIHByaW50VHJpcChzb3J0ZWRDYXJkcykge1xyXG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmRzX190cmlwJyksXHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgICAgICAvL3ZhciBlbGVtZW50MiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmlwMicpO1xyXG4gICAgICAgICAgICAvL3ZhciByZXN1bHQyID0gXCJcIjtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPHNvcnRlZENhcmRzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNvcnRlZENhcmRzW2ldLnRyYW5zcG9ydCAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAoaSsxKSArICcpIFRha2UgJytzb3J0ZWRDYXJkc1tpXS50cmFuc3BvcnQgKyAnICc7XHJcbiAgICAgICAgICAgICAgICBpZiAoc29ydGVkQ2FyZHNbaV0ubnVtYmVyICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBzb3J0ZWRDYXJkc1tpXS5udW1iZXIgKyAnICc7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IChpKzEpICsgJykgVGFrZSBzb21lIHRyYW5zcG9ydCAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSAnZnJvbSAnICsgc29ydGVkQ2FyZHNbaV0uZGVwYXJ0dXJlICsgJyB0byAnICsgc29ydGVkQ2FyZHNbaV0uYXJyaXZhbDtcclxuICAgICAgICAgICAgaWYgKHNvcnRlZENhcmRzW2ldLnNlYXQgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gJy4gWW91ciBzZWF0IGlzICcgKyBzb3J0ZWRDYXJkc1tpXS5zZWF0ICsgJy4nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9ICcuIE5vIHNlYXQgYXNzaWdubWVudC4gJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc29ydGVkQ2FyZHNbaV0ubm90ZXMgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gc29ydGVkQ2FyZHNbaV0ubm90ZXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzb3J0ZWRDYXJkc1tpXS5ub3Rlcy5zbGljZSgxKSArICcuIFxcbic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gJ1xcbic7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICBlbGVtZW50LmlubmVyVGV4dCA9IHJlc3VsdDtcclxuICAgICAgXHJcbiAgICAgICAgICAvKmVsZW1lbnQxLmlubmVyVGV4dCA9IHJlc3VsdDE7XHJcbiAgICAgICAgICBmb3IodmFyIGNhcmQgaW4gc29ydGVkQ2FyZHMpe1xyXG4gICAgICAgICAgICByZXN1bHQyICs9IHBhcnNlSW50KGNhcmQpKzEgKyAnKSAnO1xyXG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiBzb3J0ZWRDYXJkc1tjYXJkXSl7XHJcbiAgICAgICAgICAgICAgaWYoc29ydGVkQ2FyZHNbY2FyZF1ba2V5XSAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdDIgKz0ga2V5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsga2V5LnNsaWNlKDEpICsgXCI6IFwiICsgc29ydGVkQ2FyZHNbY2FyZF1ba2V5XSArICdcXG4nO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudDIuaW5uZXJUZXh0ID0gcmVzdWx0MjtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgICovXHJcbiAgICB9XHJcblxyXG4gICAgLy8g0KTRg9C90LrRhtC40Y8gZXJyb3JBbGVydCDQstGL0LLQvtC00LjRgiDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1INC+0LEg0L7RiNC40LHQutCw0YUg0LIg0LfQsNC00LDQvdC90YvRhSDQutCw0YDRgtC+0YfQutCw0YUuXHJcbiAgICBmdW5jdGlvbiBlcnJvckFsZXJ0KGVycm9yVHlwZSkge1xyXG4gICAgICAgIHN3aXRjaCAoZXJyb3JUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2ZpcnN0Q2FyZCc6IFxyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ9Ce0YjQuNCx0LrQsCDQsiDQvNCw0YDRiNGA0YPRgtC1IG9uZS13YXkuINCd0LDRh9Cw0LvRjNC90YvQuSDQuCDQutC+0L3QtdGH0L3Ri9C5INC/0YPQvdC60YIg0LzQsNGA0YjRgNGD0YLQsCDRgdC+0LLQv9Cw0LTQsNGO0YIuJyk7IFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3dyb25nQ2FyZCc6IFxyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ9Cd0LDRh9Cw0LvRjNC90YvQuSDQuCDQutC+0L3QtdGH0L3Ri9C5INC/0YPQvdC60YLRiyDQsiDQutCw0YDRgtC+0YfQutC1INGB0L7QstC/0L7QtNCw0Y7Rgi4nKTsgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbWlzc1BvaW50SW5DYXJkJzogXHJcbiAgICAgICAgICAgICAgICBhbGVydCgn0J/Rg9GB0YLQsNGPINGC0L7Rh9C60LAg0L3QsNGH0LDQu9GM0L3QvtCz0L4v0LrQvtC90LXRh9C90L7Qs9C+INC/0YPQvdC60YLQsCDQsiDQutCw0YDRgtC+0YfQutC1LicpOyBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdtaXNzQ2FyZCc6IFxyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ9Cf0YDQvtC/0YPRidC10L3QsCDQutCw0YDRgtC+0YfQutCwINCyINC80LDRgNGI0YDRg9GC0LUuJyk7IFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHNvcnRDYXJkcyhjYXJkcyxzb3J0ZWRDYXJkcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBhZGRCdXR0b24xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0RPTV9fbGlua19hZGRDbGFzcycpLFxyXG4gICAgICAgIGFkZEJ1dHRvbjIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRE9NX19saW5rX2FkZElkJyksXHJcbiAgICAgICAgYWRkQnV0dG9uMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdET01fX2xpbmtfYWRkUCcpLFxyXG4gICAgICAgIHJlbW92ZUJ1dHRvbjEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRE9NX19saW5rX3JlbW92ZUNsYXNzJyksXHJcbiAgICAgICAgcmVtb3ZlQnV0dG9uMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdET01fX2xpbmtfcmVtb3ZlSWQnKSxcclxuICAgICAgICByZW1vdmVCdXR0b24zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0RPTV9fbGlua19yZW1vdmVQJyksXHJcbiAgICAgICAgdG9nZ2xlQnV0dG9uMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdET01fX2xpbmtfdG9nZ2xlQ2xhc3MnKSxcclxuICAgICAgICB0b2dnbGVCdXR0b24yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0RPTV9fbGlua190b2dnbGVJZCcpLFxyXG4gICAgICAgIHRvZ2dsZUJ1dHRvbjMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnRE9NX19saW5rX3RvZ2dsZVAnKTtcclxuXHJcbiAgICBhZGRCdXR0b24xLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBhZGRDbGFzcyAoJ25ldycsICcuRE9NX190cmlwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhZGRCdXR0b24yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBhZGRDbGFzcyAoJ25ldycsICcjRE9NX190cmlwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhZGRCdXR0b24zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBhZGRDbGFzcyAoJ25ldycsICdwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZW1vdmVCdXR0b24xLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICByZW1vdmVDbGFzcyAoJ25ldycsICcuRE9NX190cmlwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZW1vdmVCdXR0b24yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICByZW1vdmVDbGFzcyAoJ25ldycsICcjRE9NX190cmlwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZW1vdmVCdXR0b24zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICByZW1vdmVDbGFzcyAoJ25ldycsICdwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0b2dnbGVCdXR0b24xLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0b2dnbGVDbGFzcyAoJ25ldycsICcuRE9NX190cmlwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0b2dnbGVCdXR0b24yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0b2dnbGVDbGFzcyAoJ25ldycsICcjRE9NX190cmlwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0b2dnbGVCdXR0b24zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0b2dnbGVDbGFzcyAoJ25ldycsICdwJyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLyog0KTRg9C90LrRhtC40Y8gZ2V0RWxlbWVudCDQv9C+0LvRg9GH0LDQtdGCINGB0L/QuNGB0L7QuiDQvdGD0LbQvdGL0YUg0L7QsdGK0LXQutGC0L7Qsiwg0LXRgdC70Lgg0YLQsNC60LjQtSDQtdGB0YLRjCDQvdCwINGB0YDQsNC90LjRhtC1LCDQuNC90LDRh9C1IC0gZmFsc2UgKHNlbGVjdG9yIC0g0LfQsNC00LDQstCw0LXQvNGL0Lkg0YHQtdC70LXQutGC0L7RgCkgKi9cclxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnQgKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdG9yLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbWVudDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHNlbGVjdG9yKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyog0KTRg9C90LrRhtC40Y8gcmVtb3ZlQ2xhc3Mg0YPQtNCw0LvRj9C10YIg0LrQu9Cw0YHRgSBjbGFzc05hbWUg0LjQtyDQvtCx0YrQtdC60YLQvtCyIG5hbWUg0L3QsCDRgdGC0YDQsNC90LjRhtC1IFxyXG4gICAgKG51bU9mSXRlbSAtINC/0L7RgNGP0LTQutC+0LLRi9C5INC90L7QvNC10YAg0L3Rg9C20L3QvtCz0L4g0L7QsdGK0LXQutGC0LAsINC10YHQu9C4INGF0L7RgtC40Lwg0LLQt9GP0YLRjCDRgtC+0LvRjNC60L4g0L7QtNC40L0g0Y3Qu9C10LzQtdC90YIg0YEg0YLQsNC60LjQvCDRgdC10LvQtdGC0L7RgNC+0LwsINCwINC90LUg0LLRgdC1KSovXHJcbiAgICBmdW5jdGlvbiByZW1vdmVDbGFzcyAoY2xhc3NOYW1lLCBuYW1lLCBudW1PZkl0ZW0pIHtcclxuICAgICAgICB2YXIgb2JqZWN0cyA9IGdldEVsZW1lbnQobmFtZSk7XHJcbiAgICAgICBcclxuICAgICAgICBpZiAoIShudW1PZkl0ZW0rMSkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3RzW2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iamVjdHNbbnVtT2ZJdGVtLTFdLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyog0KTRg9C90LrRhtC40Y8gYWRkQ2xhc3Mg0LTQvtCx0LDQstC70Y/QtdGCINC60LvQsNGB0YEgY2xhc3NOYW1lINC+0LHRitC10LrRgtCw0LwgbmFtZSDQvdCwINGB0YLRgNCw0L3QuNGG0LUgXHJcbiAgICAobnVtT2ZJdGVtIC0g0L/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQvdGD0LbQvdC+0LPQviDQvtCx0YrQtdC60YLQsCwg0LXRgdC70Lgg0YXQvtGC0LjQvCDQstC30Y/RgtGMINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRjdC70LXQvNC10L3RgiDRgSDRgtCw0LrQuNC8INGB0LXQu9C10YLQvtGA0L7QvCwg0LAg0L3QtSDQstGB0LUpKi9cclxuICAgIGZ1bmN0aW9uIGFkZENsYXNzIChjbGFzc05hbWUsIG5hbWUsIG51bU9mSXRlbSkge1xyXG4gICAgICAgIHZhciBvYmplY3RzID0gZ2V0RWxlbWVudChuYW1lKTtcclxuICAgICAgICBpZighKG51bU9mSXRlbSsxKSl7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBvYmplY3RzW2ldLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9iamVjdHNbbnVtT2ZJdGVtLTFdLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyog0KTRg9C90LrRhtC40Y8gdG9nZ2xlQ2xhc3Mg0L/QtdGA0LXQutC70Y7Rh9Cw0LXRgiDQutC70LDRgdGBIGNsYXNzTmFtZSDQsiDQvtCx0YrQtdC60YLQsNGFIG5hbWUgXHJcbiAgICAobnVtT2ZJdGVtIC0g0L/QvtGA0Y/QtNC60L7QstGL0Lkg0L3QvtC80LXRgCDQvdGD0LbQvdC+0LPQviDQvtCx0YrQtdC60YLQsCwg0LXRgdC70Lgg0YXQvtGC0LjQvCDQstC30Y/RgtGMINGC0L7Qu9GM0LrQviDQvtC00LjQvSDRjdC70LXQvNC10L3RgiDRgSDRgtCw0LrQuNC8INGB0LXQu9C10YLQvtGA0L7QvCwg0LAg0L3QtSDQstGB0LUpKi9cclxuICAgIGZ1bmN0aW9uIHRvZ2dsZUNsYXNzIChjbGFzc05hbWUsIG5hbWUsIG51bU9mSXRlbSkge1xyXG4gICAgICAgIHZhciBvYmplY3RzID0gZ2V0RWxlbWVudChuYW1lKTtcclxuICAgICAgICBpZighKG51bU9mSXRlbSsxKSl7IFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgb2JqZWN0c1tpXS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvYmplY3RzW251bU9mSXRlbS0xXS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTsiXX0=
