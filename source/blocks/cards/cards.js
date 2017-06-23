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