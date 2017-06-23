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