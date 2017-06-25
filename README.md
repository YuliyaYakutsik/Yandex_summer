# YANDEX_TASK (Yuliya Yakutsik)

> Сборка работает на gulp версии 4.0.

## Для начала работы

1. ```clone this repo```
2. ```cd path/to/...```
3. ```npm install gulpjs/gulp-cli -g```  
> Установка последней версии Gulp CLI tools глобально (подробнее - [GitHub](https://github.com/gulpjs/gulp/blob/4.0/docs/getting-started.md) )

4. ```npm install```
6. ```run gulp```

###Задание 1. Сортирова карточек. Логика выполнения задания описана в source/blocks/cards/cards.js.
###Задание 2. Работа с DOM. Логика выполнения задания описана в source/blocks/cards/DOM.js
###Задание 3. Список achivements. В качестве входных данных (ачивок) принимается файл content.json (в нем, @image - относительный путь к картинке ачивки; @color - принимает цвет, который применяется потом для внешнего вида ачивки). В source/template/mixins/mixins.pug создается миксин, который принимает массив из файла content.json. Затем данный миксин используется для вставки списка ачивок конкретного сотрудника на страницу (в качестве примера source/blocks/achiv/achiv.pug)