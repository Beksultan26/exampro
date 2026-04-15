/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const subjects = [
  {
    title: "Java программирование",
    slug: "java-programming",
    description: "Основы синтаксиса Java, классы, объекты, коллекции и исключения.",
    icon: "☕",
    color: "#f59e0b",
    group: "basic",
    topics: [
      {
        title: "Основы синтаксиса Java",
        slug: "java-syntax-basics",
        order: 1,
        content: `Java — это объектно-ориентированный язык программирования, который широко применяется для разработки серверных приложений, настольных программ и Android-приложений. Программа на Java состоит из классов, методов и инструкций. Выполнение программы обычно начинается с метода main.

В Java используется строгая типизация, поэтому каждая переменная должна иметь определённый тип: int, double, boolean, char, String и другие. Это помогает компилятору находить ошибки ещё до запуска программы.

Язык поддерживает основные управляющие конструкции: условные операторы if и switch, циклы for, while, do-while, а также операторы break и continue. Для вывода данных часто используется System.out.println(), а для ввода — Scanner.

Синтаксис Java отличается обязательным использованием фигурных скобок для блоков кода и точек с запятой в конце инструкций. Понимание базового синтаксиса Java является фундаментом для дальнейшего изучения языка.`,
      },
      {
        title: "Классы и объекты в Java",
        slug: "java-classes-objects",
        order: 2,
        content: `Класс в Java — это шаблон, по которому создаются объекты. В классе описываются поля, которые хранят состояние объекта, и методы, которые определяют его поведение. Объект — это конкретный экземпляр класса.

Объекты создаются с помощью оператора new. Java поддерживает конструкторы — специальные методы, которые вызываются при создании объекта и помогают задать начальные значения полей.

Инкапсуляция реализуется через модификаторы доступа public, private и protected. Хорошей практикой считается делать поля private и предоставлять доступ к ним через методы get и set.`,
      },
      {
        title: "Коллекции и исключения",
        slug: "java-collections-exceptions",
        order: 3,
        content: `Коллекции в Java используются для хранения групп объектов. Наиболее известные интерфейсы коллекций — List, Set и Map. Они помогают удобно добавлять, искать, удалять и изменять элементы.

Исключения — это механизм обработки ошибок во время выполнения программы. Для работы с ними используются блоки try, catch и finally. Такой подход помогает делать программы более устойчивыми к ошибкам.

Грамотное использование коллекций и обработки исключений делает код более гибким, понятным и надёжным.`,
      },
    ],
    questions: [
      {
        questionText: "Какой метод является точкой входа в программу Java?",
        explanation: "Выполнение Java-программы начинается с метода main.",
        options: [
          { optionText: "start()", isCorrect: false },
          { optionText: "main()", isCorrect: true },
          { optionText: "run()", isCorrect: false },
          { optionText: "init()", isCorrect: false },
        ],
      },
      {
        questionText: "Какой тип данных хранит целые числа в Java?",
        explanation: "Тип int используется для хранения целых чисел.",
        options: [
          { optionText: "String", isCorrect: false },
          { optionText: "boolean", isCorrect: false },
          { optionText: "int", isCorrect: true },
          { optionText: "double", isCorrect: false },
        ],
      },
      {
        questionText: "Что создаёт оператор new?",
        explanation: "Оператор new создаёт объект — экземпляр класса.",
        options: [
          { optionText: "Метод", isCorrect: false },
          { optionText: "Пакет", isCorrect: false },
          { optionText: "Объект", isCorrect: true },
          { optionText: "Цикл", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое класс в Java?",
        explanation: "Класс — это шаблон для создания объектов.",
        options: [
          { optionText: "Случайный набор переменных", isCorrect: false },
          { optionText: "Шаблон для объектов", isCorrect: true },
          { optionText: "Только функция", isCorrect: false },
          { optionText: "Только массив", isCorrect: false },
        ],
      },
      {
        questionText: "Какой модификатор ограничивает доступ к полю только внутри класса?",
        explanation: "private ограничивает доступ к полю пределами класса.",
        options: [
          { optionText: "public", isCorrect: false },
          { optionText: "static", isCorrect: false },
          { optionText: "private", isCorrect: true },
          { optionText: "final", isCorrect: false },
        ],
      },
      {
        questionText: "Какая коллекция не допускает повторов элементов?",
        explanation: "Set хранит только уникальные элементы.",
        options: [
          { optionText: "List", isCorrect: false },
          { optionText: "Set", isCorrect: true },
          { optionText: "String", isCorrect: false },
          { optionText: "Array", isCorrect: false },
        ],
      },
      {
        questionText: "Какая коллекция хранит пары ключ-значение?",
        explanation: "Map предназначен для хранения пар ключ-значение.",
        options: [
          { optionText: "List", isCorrect: false },
          { optionText: "Set", isCorrect: false },
          { optionText: "Map", isCorrect: true },
          { optionText: "Queue", isCorrect: false },
        ],
      },
      {
        questionText: "Для обработки ошибок во время выполнения используется...",
        explanation: "Исключения в Java обрабатываются через try/catch.",
        options: [
          { optionText: "if/else", isCorrect: false },
          { optionText: "for/while", isCorrect: false },
          { optionText: "try/catch", isCorrect: true },
          { optionText: "class/object", isCorrect: false },
        ],
      },
      {
        questionText: "Какой блок выполняется всегда после try/catch?",
        explanation: "Блок finally выполняется независимо от наличия исключения.",
        options: [
          { optionText: "throw", isCorrect: false },
          { optionText: "finally", isCorrect: true },
          { optionText: "switch", isCorrect: false },
          { optionText: "return", isCorrect: false },
        ],
      },
      {
        questionText: "Что считается хорошей практикой при работе с полями класса?",
        explanation: "Поля обычно делают private для инкапсуляции.",
        options: [
          { optionText: "Делать все поля public", isCorrect: false },
          { optionText: "Не использовать типы данных", isCorrect: false },
          { optionText: "Делать поля private", isCorrect: true },
          { optionText: "Хранить всё в одном методе", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Алгоритмы и структуры данных",
    slug: "algorithms-data-structures",
    description: "Алгоритмы, массивы, списки, стеки, очереди, поиск и сортировка.",
    icon: "🧠",
    color: "#8b5cf6",
    group: "basic",
    topics: [
      {
        title: "Понятие алгоритма и его свойства",
        slug: "algorithms-basics",
        order: 1,
        content: `Алгоритм — это точная последовательность действий, приводящая к решению задачи. Он должен обладать дискретностью, определённостью, конечностью, результативностью и массовостью.

Алгоритмы лежат в основе любой программы. Их можно представить в виде текста, блок-схемы, псевдокода или готового кода на языке программирования.

Основные алгоритмические структуры — следование, ветвление и цикл. Понимание алгоритмов позволяет строить корректные и эффективные решения.`,
      },
      {
        title: "Массивы, списки, стеки и очереди",
        slug: "data-structures-overview",
        order: 2,
        content: `Структуры данных определяют способ хранения информации в памяти компьютера. Массив хранит элементы одного типа и позволяет быстро получать доступ по индексу.

Список может изменять размер, стек работает по принципу LIFO, а очередь — по принципу FIFO. Каждая структура данных подходит для определённого набора задач.

Правильный выбор структуры данных влияет на скорость работы программы и удобство реализации алгоритма.`,
      },
      {
        title: "Поиск и сортировка данных",
        slug: "search-and-sorting",
        order: 3,
        content: `Поиск нужен для нахождения элемента в наборе данных. Линейный поиск прост, но медленный при больших объёмах данных. Бинарный поиск работает быстрее, но требует предварительной сортировки массива.

Сортировка упорядочивает элементы массива. К простым алгоритмам относятся сортировка пузырьком, выбором и вставками. Они полезны для обучения и понимания принципов работы.

Выбор алгоритма поиска и сортировки зависит от задачи, объёма данных и требований к производительности.`,
      },
    ],
    questions: [
      {
        questionText: "Что такое алгоритм?",
        explanation: "Алгоритм — это последовательность действий для решения задачи.",
        options: [
          { optionText: "Набор случайных символов", isCorrect: false },
          { optionText: "Последовательность действий для решения задачи", isCorrect: true },
          { optionText: "Операционная система", isCorrect: false },
          { optionText: "Тип памяти", isCorrect: false },
        ],
      },
      {
        questionText: "Какое свойство алгоритма означает завершение за конечное число шагов?",
        explanation: "Это свойство называется конечностью.",
        options: [
          { optionText: "Массовость", isCorrect: false },
          { optionText: "Конечность", isCorrect: true },
          { optionText: "Дискретность", isCorrect: false },
          { optionText: "Определённость", isCorrect: false },
        ],
      },
      {
        questionText: "Какая структура данных удобна для быстрого доступа по индексу?",
        explanation: "Массив позволяет быстро получать элемент по индексу.",
        options: [
          { optionText: "Стек", isCorrect: false },
          { optionText: "Очередь", isCorrect: false },
          { optionText: "Массив", isCorrect: true },
          { optionText: "Граф", isCorrect: false },
        ],
      },
      {
        questionText: "По какому принципу работает стек?",
        explanation: "Стек работает по принципу LIFO — последним пришёл, первым вышел.",
        options: [
          { optionText: "FIFO", isCorrect: false },
          { optionText: "LIFO", isCorrect: true },
          { optionText: "По индексу", isCorrect: false },
          { optionText: "Случайно", isCorrect: false },
        ],
      },
      {
        questionText: "По какому принципу работает очередь?",
        explanation: "Очередь работает по принципу FIFO — первым пришёл, первым вышел.",
        options: [
          { optionText: "LIFO", isCorrect: false },
          { optionText: "FIFO", isCorrect: true },
          { optionText: "Сначала последний", isCorrect: false },
          { optionText: "Без порядка", isCorrect: false },
        ],
      },
      {
        questionText: "Какой поиск работает только в отсортированном массиве?",
        explanation: "Бинарный поиск требует отсортированного массива.",
        options: [
          { optionText: "Линейный", isCorrect: false },
          { optionText: "Бинарный", isCorrect: true },
          { optionText: "Случайный", isCorrect: false },
          { optionText: "Прямой", isCorrect: false },
        ],
      },
      {
        questionText: "Какой алгоритм сортировки сравнивает соседние элементы?",
        explanation: "Пузырьковая сортировка сравнивает соседние элементы и меняет их местами.",
        options: [
          { optionText: "Быстрая сортировка", isCorrect: false },
          { optionText: "Сортировка пузырьком", isCorrect: true },
          { optionText: "Бинарный поиск", isCorrect: false },
          { optionText: "Сортировка графом", isCorrect: false },
        ],
      },
      {
        questionText: "Какая структура используется для повторения действий в алгоритме?",
        explanation: "Для повторения действий используется цикл.",
        options: [
          { optionText: "Условие", isCorrect: false },
          { optionText: "Цикл", isCorrect: true },
          { optionText: "Массив", isCorrect: false },
          { optionText: "Функция", isCorrect: false },
        ],
      },
      {
        questionText: "Что делает сортировка данных?",
        explanation: "Сортировка упорядочивает элементы по определённому правилу.",
        options: [
          { optionText: "Удаляет элементы", isCorrect: false },
          { optionText: "Упорядочивает элементы", isCorrect: true },
          { optionText: "Шифрует данные", isCorrect: false },
          { optionText: "Печатает результат", isCorrect: false },
        ],
      },
      {
        questionText: "Что влияет на выбор структуры данных?",
        explanation: "Выбор зависит от задачи и требуемой производительности.",
        options: [
          { optionText: "Только цвет интерфейса", isCorrect: false },
          { optionText: "Задача и производительность", isCorrect: true },
          { optionText: "Только длина кода", isCorrect: false },
          { optionText: "Только размер шрифта", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Объектно-ориентированное программирование",
    slug: "oop",
    description: "Инкапсуляция, наследование, полиморфизм и абстракция.",
    icon: "🧩",
    color: "#10b981",
    group: "basic",
    topics: [
      {
        title: "Основные принципы ООП",
        slug: "oop-principles",
        order: 1,
        content: `Объектно-ориентированное программирование — это подход, при котором программа строится на основе объектов. Основными принципами ООП являются инкапсуляция, наследование, полиморфизм и абстракция.

ООП помогает моделировать реальные объекты предметной области и строить гибкие, расширяемые системы. Этот подход используется во многих современных языках программирования.`,
      },
      {
        title: "Инкапсуляция и наследование",
        slug: "encapsulation-and-inheritance",
        order: 2,
        content: `Инкапсуляция объединяет данные и методы их обработки внутри одного класса и ограничивает прямой доступ к внутреннему состоянию объекта. Обычно поля делают private.

Наследование позволяет создавать новый класс на основе уже существующего. Это уменьшает дублирование кода и упрощает повторное использование решений.`,
      },
      {
        title: "Полиморфизм и абстракция",
        slug: "polymorphism-and-abstraction",
        order: 3,
        content: `Полиморфизм позволяет использовать общий интерфейс для разных реализаций. Например, один и тот же метод может вести себя по-разному в зависимости от объекта.

Абстракция выделяет главные характеристики объекта и скрывает детали реализации. Для этого применяются интерфейсы и абстрактные классы.`,
      },
    ],
    questions: [
      {
        questionText: "Что означает ООП?",
        explanation: "ООП — объектно-ориентированное программирование.",
        options: [
          { optionText: "Объектно-ориентированное программирование", isCorrect: true },
          { optionText: "Общий оператор памяти", isCorrect: false },
          { optionText: "Обработка общих параметров", isCorrect: false },
          { optionText: "Объём оперативной памяти", isCorrect: false },
        ],
      },
      {
        questionText: "Какой принцип ООП скрывает внутренние данные объекта?",
        explanation: "Инкапсуляция ограничивает прямой доступ к данным объекта.",
        options: [
          { optionText: "Полиморфизм", isCorrect: false },
          { optionText: "Инкапсуляция", isCorrect: true },
          { optionText: "Абстракция", isCorrect: false },
          { optionText: "Наследование", isCorrect: false },
        ],
      },
      {
        questionText: "Что позволяет наследование?",
        explanation: "Наследование позволяет создавать новый класс на основе существующего.",
        options: [
          { optionText: "Удалять типы данных", isCorrect: false },
          { optionText: "Создавать класс на основе другого", isCorrect: true },
          { optionText: "Запрещать методы", isCorrect: false },
          { optionText: "Создавать только массивы", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое полиморфизм?",
        explanation: "Полиморфизм — единый интерфейс для разных реализаций.",
        options: [
          { optionText: "Хранение данных в списке", isCorrect: false },
          { optionText: "Единый интерфейс для разных реализаций", isCorrect: true },
          { optionText: "Создание случайных объектов", isCorrect: false },
          { optionText: "Работа только с файлами", isCorrect: false },
        ],
      },
      {
        questionText: "Что позволяет абстракция?",
        explanation: "Абстракция выделяет только важные свойства объекта.",
        options: [
          { optionText: "Скрывать несущественные детали", isCorrect: true },
          { optionText: "Удалять компилятор", isCorrect: false },
          { optionText: "Увеличивать память", isCorrect: false },
          { optionText: "Делать все поля public", isCorrect: false },
        ],
      },
      {
        questionText: "Как обычно оформляют поля при инкапсуляции?",
        explanation: "Поля обычно делают private.",
        options: [
          { optionText: "private", isCorrect: true },
          { optionText: "random", isCorrect: false },
          { optionText: "void", isCorrect: false },
          { optionText: "loop", isCorrect: false },
        ],
      },
      {
        questionText: "Какое отношение лучше всего подходит для наследования?",
        explanation: "Наследование отражает отношение «является» (is-a).",
        options: [
          { optionText: "has-a", isCorrect: false },
          { optionText: "is-a", isCorrect: true },
          { optionText: "looks-like", isCorrect: false },
          { optionText: "runs-with", isCorrect: false },
        ],
      },
      {
        questionText: "Что часто используют для абстракции?",
        explanation: "Для абстракции часто применяются интерфейсы и абстрактные классы.",
        options: [
          { optionText: "Только циклы", isCorrect: false },
          { optionText: "Интерфейсы и абстрактные классы", isCorrect: true },
          { optionText: "Только массивы", isCorrect: false },
          { optionText: "Только строки", isCorrect: false },
        ],
      },
      {
        questionText: "Какое преимущество даёт ООП?",
        explanation: "ООП повышает модульность и расширяемость программы.",
        options: [
          { optionText: "Снижает читаемость", isCorrect: false },
          { optionText: "Повышает модульность и расширяемость", isCorrect: true },
          { optionText: "Убирает алгоритмы", isCorrect: false },
          { optionText: "Запрещает повторное использование", isCorrect: false },
        ],
      },
      {
        questionText: "Какой принцип позволяет одному методу работать по-разному у разных объектов?",
        explanation: "Это полиморфизм.",
        options: [
          { optionText: "Инкапсуляция", isCorrect: false },
          { optionText: "Полиморфизм", isCorrect: true },
          { optionText: "Наследование", isCorrect: false },
          { optionText: "Типизация", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Базы данных",
    slug: "databases",
    description: "Реляционные базы данных, SQL, нормализация и связи таблиц.",
    icon: "🗄️",
    color: "#14b8a6",
    group: "professional",
    topics: [
      {
        title: "Понятие базы данных и СУБД",
        slug: "dbms-basics",
        order: 1,
        content: `База данных — это организованная совокупность взаимосвязанных данных. Для управления базами данных используются СУБД — системы управления базами данных.

СУБД позволяют создавать таблицы, выполнять запросы, обеспечивать целостность информации и управлять доступом пользователей. К популярным СУБД относятся PostgreSQL, MySQL, Oracle и SQL Server.`,
      },
      {
        title: "SQL и основные операции",
        slug: "sql-basics",
        order: 2,
        content: `SQL — язык запросов для работы с реляционными базами данных. Он используется для создания структуры базы и управления данными.

Основные команды SQL: SELECT, INSERT, UPDATE и DELETE. Также часто используются WHERE, ORDER BY, GROUP BY и JOIN для фильтрации, сортировки, группировки и объединения данных из нескольких таблиц.`,
      },
      {
        title: "Нормализация и связи таблиц",
        slug: "database-normalization",
        order: 3,
        content: `Нормализация — это процесс организации структуры базы данных для уменьшения избыточности и предотвращения аномалий.

Связи между таблицами бывают один-к-одному, один-ко-многим и многие-ко-многим. Для их реализации применяются первичные и внешние ключи.`,
      },
    ],
    questions: [
      {
        questionText: "Что такое база данных?",
        explanation: "База данных — это организованная совокупность данных.",
        options: [
          { optionText: "Графический редактор", isCorrect: false },
          { optionText: "Организованная совокупность данных", isCorrect: true },
          { optionText: "Только текстовый файл", isCorrect: false },
          { optionText: "Антивирус", isCorrect: false },
        ],
      },
      {
        questionText: "Что означает СУБД?",
        explanation: "СУБД — система управления базами данных.",
        options: [
          { optionText: "Система управления базами данных", isCorrect: true },
          { optionText: "Служба удаления больших данных", isCorrect: false },
          { optionText: "Стандарт управления бизнесом", isCorrect: false },
          { optionText: "Система ускорения браузера", isCorrect: false },
        ],
      },
      {
        questionText: "Какая команда SQL используется для выборки данных?",
        explanation: "SELECT используется для получения данных из таблицы.",
        options: [
          { optionText: "INSERT", isCorrect: false },
          { optionText: "SELECT", isCorrect: true },
          { optionText: "DELETE", isCorrect: false },
          { optionText: "DROP", isCorrect: false },
        ],
      },
      {
        questionText: "Какая команда SQL добавляет запись?",
        explanation: "INSERT добавляет строки в таблицу.",
        options: [
          { optionText: "UPDATE", isCorrect: false },
          { optionText: "INSERT", isCorrect: true },
          { optionText: "WHERE", isCorrect: false },
          { optionText: "SELECT", isCorrect: false },
        ],
      },
      {
        questionText: "Для чего используется WHERE?",
        explanation: "WHERE задаёт условие отбора данных.",
        options: [
          { optionText: "Для фильтрации", isCorrect: true },
          { optionText: "Для удаления сервера", isCorrect: false },
          { optionText: "Для шифрования", isCorrect: false },
          { optionText: "Для печати отчёта", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое первичный ключ?",
        explanation: "Первичный ключ уникально идентифицирует запись.",
        options: [
          { optionText: "Описание таблицы", isCorrect: false },
          { optionText: "Уникальный идентификатор записи", isCorrect: true },
          { optionText: "Имя базы данных", isCorrect: false },
          { optionText: "Любой текст", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое внешний ключ?",
        explanation: "Внешний ключ связывает одну таблицу с другой.",
        options: [
          { optionText: "Поле связи между таблицами", isCorrect: true },
          { optionText: "Только название столбца", isCorrect: false },
          { optionText: "Команда SQL", isCorrect: false },
          { optionText: "Тип индекса", isCorrect: false },
        ],
      },
      {
        questionText: "Для чего нужна нормализация?",
        explanation: "Нормализация уменьшает избыточность данных.",
        options: [
          { optionText: "Для шифрования", isCorrect: false },
          { optionText: "Для уменьшения избыточности", isCorrect: true },
          { optionText: "Для запуска браузера", isCorrect: false },
          { optionText: "Для смены пароля", isCorrect: false },
        ],
      },
      {
        questionText: "Что делает JOIN?",
        explanation: "JOIN объединяет данные из нескольких таблиц.",
        options: [
          { optionText: "Удаляет таблицы", isCorrect: false },
          { optionText: "Объединяет данные из таблиц", isCorrect: true },
          { optionText: "Меняет пароль", isCorrect: false },
          { optionText: "Шифрует строки", isCorrect: false },
        ],
      },
      {
        questionText: "Какая команда SQL изменяет существующие данные?",
        explanation: "UPDATE используется для изменения записей.",
        options: [
          { optionText: "UPDATE", isCorrect: true },
          { optionText: "SELECT", isCorrect: false },
          { optionText: "WHERE", isCorrect: false },
          { optionText: "GROUP", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Информационная безопасность",
    slug: "information-security",
    description: "Угрозы, методы защиты, криптография и политика безопасности.",
    icon: "🔐",
    color: "#ef4444",
    group: "professional",
    topics: [
      {
        title: "Основные угрозы информационной безопасности",
        slug: "security-threats",
        order: 1,
        content: `Информационная безопасность — это состояние защищённости данных, систем и сетей. К угрозам относятся вредоносные программы, фишинг, подбор паролей, утечки данных и социальная инженерия.

Угрозы бывают внешними и внутренними. Для построения защиты важно понимать, какие активы нужно защищать и какие уязвимости существуют в системе.`,
      },
      {
        title: "Методы защиты информации",
        slug: "security-protection-methods",
        order: 2,
        content: `Методы защиты включают аутентификацию, авторизацию, резервное копирование, шифрование, антивирусную защиту, межсетевые экраны и контроль доступа.

Пароли должны храниться в хэшированном виде. Для усиления защиты применяют двухфакторную аутентификацию и ограничение попыток входа.`,
      },
      {
        title: "Криптография и политика безопасности",
        slug: "cryptography-and-policy",
        order: 3,
        content: `Криптография используется для защиты конфиденциальности, целостности и подлинности данных. Важную роль играют шифрование и хэширование.

Политика безопасности задаёт правила доступа, обработки и хранения данных, а также меры реагирования на инциденты.`,
      },
    ],
    questions: [
      {
        questionText: "Что относится к угрозам информационной безопасности?",
        explanation: "Фишинг относится к угрозам информационной безопасности.",
        options: [
          { optionText: "Фишинг", isCorrect: true },
          { optionText: "Только цвет сайта", isCorrect: false },
          { optionText: "Только шрифт интерфейса", isCorrect: false },
          { optionText: "Только версия браузера", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое двухфакторная аутентификация?",
        explanation: "Это подтверждение личности с помощью двух независимых факторов.",
        options: [
          { optionText: "Использование двух логинов", isCorrect: false },
          { optionText: "Проверка двумя факторами", isCorrect: true },
          { optionText: "Два одинаковых пароля", isCorrect: false },
          { optionText: "Вход без email", isCorrect: false },
        ],
      },
      {
        questionText: "Как должны храниться пароли?",
        explanation: "Пароли нужно хранить в виде хэшей.",
        options: [
          { optionText: "В открытом виде", isCorrect: false },
          { optionText: "В виде хэшей", isCorrect: true },
          { optionText: "В скриншоте", isCorrect: false },
          { optionText: "В названии файла", isCorrect: false },
        ],
      },
      {
        questionText: "Для чего используется шифрование?",
        explanation: "Шифрование защищает конфиденциальность информации.",
        options: [
          { optionText: "Для удаления данных", isCorrect: false },
          { optionText: "Для защиты конфиденциальности", isCorrect: true },
          { optionText: "Для сортировки", isCorrect: false },
          { optionText: "Для печати", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое фишинг?",
        explanation: "Фишинг — это обман с целью получить конфиденциальные данные.",
        options: [
          { optionText: "Метод резервного копирования", isCorrect: false },
          { optionText: "Обман для получения данных", isCorrect: true },
          { optionText: "Алгоритм сортировки", isCorrect: false },
          { optionText: "Тип базы данных", isCorrect: false },
        ],
      },
      {
        questionText: "Что помогает снизить риск подбора пароля?",
        explanation: "Ограничение количества попыток входа снижает риск подбора.",
        options: [
          { optionText: "Публикация паролей", isCorrect: false },
          { optionText: "Rate limit", isCorrect: true },
          { optionText: "Отключение авторизации", isCorrect: false },
          { optionText: "Удаление логов", isCorrect: false },
        ],
      },
      {
        questionText: "Что определяет политика безопасности?",
        explanation: "Политика безопасности задаёт правила защиты информации.",
        options: [
          { optionText: "Только цвет логотипа", isCorrect: false },
          { optionText: "Правила защиты информации", isCorrect: true },
          { optionText: "Только структуру шрифтов", isCorrect: false },
          { optionText: "Только скорость интернета", isCorrect: false },
        ],
      },
      {
        questionText: "Что используется для проверки сохранённого пароля без раскрытия исходного текста?",
        explanation: "Для этого используется хэширование.",
        options: [
          { optionText: "Хэширование", isCorrect: true },
          { optionText: "Печать в лог", isCorrect: false },
          { optionText: "Сжатие zip", isCorrect: false },
          { optionText: "Сортировка", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое внутренняя угроза?",
        explanation: "Это угроза со стороны сотрудников или внутренних пользователей.",
        options: [
          { optionText: "Только атака из интернета", isCorrect: false },
          { optionText: "Угроза от внутренних пользователей", isCorrect: true },
          { optionText: "Только ошибка браузера", isCorrect: false },
          { optionText: "Только поломка клавиатуры", isCorrect: false },
        ],
      },
      {
        questionText: "Что относится к мерам защиты данных?",
        explanation: "Резервное копирование — важная мера защиты информации.",
        options: [
          { optionText: "Резервное копирование", isCorrect: true },
          { optionText: "Удаление шифрования", isCorrect: false },
          { optionText: "Публикация базы", isCorrect: false },
          { optionText: "Хранение паролей в txt", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Информационные системы",
    slug: "information-systems",
    description: "Классификация ИС, архитектура и жизненный цикл системы.",
    icon: "💻",
    color: "#0ea5e9",
    group: "professional",
    topics: [
      {
        title: "Понятие и классификация информационных систем",
        slug: "is-classification",
        order: 1,
        content: `Информационная система — это совокупность программных, технических, организационных и информационных средств для сбора, хранения, обработки и передачи данных.

Информационные системы могут быть обучающими, управленческими, аналитическими, корпоративными и справочными. Они используются в образовании, бизнесе, медицине, финансах и других сферах.`,
      },
      {
        title: "Архитектура и компоненты ИС",
        slug: "is-architecture",
        order: 2,
        content: `В состав информационной системы входят программное обеспечение, база данных, пользователи, оборудование, сеть и правила работы.

Для веб-приложений характерна клиент-серверная архитектура, где фронтенд отвечает за интерфейс, бэкенд — за бизнес-логику, а база данных — за хранение информации.`,
      },
      {
        title: "Жизненный цикл информационной системы",
        slug: "is-lifecycle",
        order: 3,
        content: `Жизненный цикл ИС включает анализ требований, проектирование, разработку, тестирование, внедрение и сопровождение.

На этапе анализа определяются цели системы, на проектировании выбирается архитектура, на разработке создаётся программный продукт, а сопровождение обеспечивает его дальнейшее развитие.`,
      },
    ],
    questions: [
      {
        questionText: "Что такое информационная система?",
        explanation: "Это совокупность средств для работы с информацией.",
        options: [
          { optionText: "Только база данных", isCorrect: false },
          { optionText: "Совокупность средств для работы с информацией", isCorrect: true },
          { optionText: "Только браузер", isCorrect: false },
          { optionText: "Только процессор", isCorrect: false },
        ],
      },
      {
        questionText: "Что входит в состав информационной системы?",
        explanation: "ИС включает ПО, данные, оборудование, пользователей и правила.",
        options: [
          { optionText: "Только код", isCorrect: false },
          { optionText: "ПО, данные, оборудование и пользователи", isCorrect: true },
          { optionText: "Только интерфейс", isCorrect: false },
          { optionText: "Только сеть", isCorrect: false },
        ],
      },
      {
        questionText: "Какая архитектура часто используется в веб-системах?",
        explanation: "В веб-приложениях часто применяется клиент-серверная архитектура.",
        options: [
          { optionText: "Линейная", isCorrect: false },
          { optionText: "Клиент-серверная", isCorrect: true },
          { optionText: "Случайная", isCorrect: false },
          { optionText: "Печатная", isCorrect: false },
        ],
      },
      {
        questionText: "Какой этап жизненного цикла идёт после разработки?",
        explanation: "После разработки обычно проводится тестирование.",
        options: [
          { optionText: "Тестирование", isCorrect: true },
          { optionText: "Удаление", isCorrect: false },
          { optionText: "Скрытие данных", isCorrect: false },
          { optionText: "Шифрование", isCorrect: false },
        ],
      },
      {
        questionText: "Для чего нужна информационная система?",
        explanation: "Она автоматизирует процессы и помогает работать с данными.",
        options: [
          { optionText: "Только для игр", isCorrect: false },
          { optionText: "Для автоматизации и обработки информации", isCorrect: true },
          { optionText: "Только для музыки", isCorrect: false },
          { optionText: "Только для печати", isCorrect: false },
        ],
      },
      {
        questionText: "Что делает бэкенд?",
        explanation: "Бэкенд реализует логику приложения и работает с данными.",
        options: [
          { optionText: "Только меняет цвет сайта", isCorrect: false },
          { optionText: "Обрабатывает запросы и бизнес-логику", isCorrect: true },
          { optionText: "Только рисует кнопки", isCorrect: false },
          { optionText: "Только хранит фото", isCorrect: false },
        ],
      },
      {
        questionText: "Что делает фронтенд?",
        explanation: "Фронтенд отвечает за интерфейс пользователя.",
        options: [
          { optionText: "Отвечает за интерфейс", isCorrect: true },
          { optionText: "Только запускает сервер", isCorrect: false },
          { optionText: "Только создаёт БД", isCorrect: false },
          { optionText: "Только шифрует данные", isCorrect: false },
        ],
      },
      {
        questionText: "Что происходит на этапе анализа требований?",
        explanation: "На этом этапе определяются цели и требования к системе.",
        options: [
          { optionText: "Сразу деплой", isCorrect: false },
          { optionText: "Определение требований", isCorrect: true },
          { optionText: "Удаление данных", isCorrect: false },
          { optionText: "Только оформление дизайна", isCorrect: false },
        ],
      },
      {
        questionText: "Что включает сопровождение системы?",
        explanation: "Сопровождение — это исправление ошибок и развитие системы.",
        options: [
          { optionText: "Поддержка и обновление системы", isCorrect: true },
          { optionText: "Только печать документации", isCorrect: false },
          { optionText: "Удаление всех модулей", isCorrect: false },
          { optionText: "Только цветовые изменения", isCorrect: false },
        ],
      },
      {
        questionText: "Какое качество важно для архитектуры ИС?",
        explanation: "Архитектура должна быть масштабируемой и надёжной.",
        options: [
          { optionText: "Случайность", isCorrect: false },
          { optionText: "Масштабируемость", isCorrect: true },
          { optionText: "Только размер текста", isCorrect: false },
          { optionText: "Отсутствие базы", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Компьютерные сети",
    slug: "computer-networks",
    description: "Модель OSI, TCP/IP, IP-адресация, маршрутизация и протоколы.",
    icon: "🌐",
    color: "#3b82f6",
    group: "professional",
    topics: [
      {
        title: "Модель OSI и стек TCP/IP",
        slug: "osi-and-tcpip",
        order: 1,
        content: `Компьютерные сети обеспечивают обмен данными между устройствами. Для понимания их работы используются модели OSI и TCP/IP.

Модель OSI состоит из семи уровней, а стек TCP/IP включает более практичную структуру, используемую в интернете. Эти модели помогают объяснить прохождение данных от отправителя к получателю.`,
      },
      {
        title: "IP-адресация и маршрутизация",
        slug: "ip-addressing-routing",
        order: 2,
        content: `IP-адрес нужен для идентификации устройства в сети. Существуют IPv4 и IPv6. Важными понятиями являются маска подсети, шлюз и DNS.

Маршрутизация — это процесс выбора пути передачи пакетов между сетями. Маршрутизаторы используют таблицы маршрутизации для определения оптимального маршрута.`,
      },
      {
        title: "Сетевые топологии и протоколы",
        slug: "network-topologies-protocols",
        order: 3,
        content: `Топология описывает способ соединения устройств. Часто используются шина, звезда, кольцо и дерево. На практике наиболее распространена топология звезда.

Протоколы определяют правила обмена данными. TCP гарантирует доставку, UDP обеспечивает скорость, HTTP и HTTPS используются в вебе, DNS — для преобразования доменных имён.`,
      },
    ],
    questions: [
      {
        questionText: "Сколько уровней содержит модель OSI?",
        explanation: "Модель OSI состоит из 7 уровней.",
        options: [
          { optionText: "4", isCorrect: false },
          { optionText: "5", isCorrect: false },
          { optionText: "7", isCorrect: true },
          { optionText: "8", isCorrect: false },
        ],
      },
      {
        questionText: "Какой протокол обеспечивает надёжную доставку данных?",
        explanation: "TCP обеспечивает надёжную доставку и контроль порядка пакетов.",
        options: [
          { optionText: "UDP", isCorrect: false },
          { optionText: "TCP", isCorrect: true },
          { optionText: "DNS", isCorrect: false },
          { optionText: "IPX", isCorrect: false },
        ],
      },
      {
        questionText: "Что делает маршрутизатор?",
        explanation: "Маршрутизатор выбирает путь передачи пакетов между сетями.",
        options: [
          { optionText: "Хранит пароли", isCorrect: false },
          { optionText: "Выбирает путь передачи пакетов", isCorrect: true },
          { optionText: "Печатает документы", isCorrect: false },
          { optionText: "Создаёт HTML", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое IPv4?",
        explanation: "IPv4 — это адрес устройства в сети в формате из четырёх чисел.",
        options: [
          { optionText: "Пароль сервера", isCorrect: false },
          { optionText: "Адрес устройства в сети", isCorrect: true },
          { optionText: "Имя домена", isCorrect: false },
          { optionText: "Тип базы данных", isCorrect: false },
        ],
      },
      {
        questionText: "Какая топология чаще всего используется в локальных сетях?",
        explanation: "На практике часто используется топология звезда.",
        options: [
          { optionText: "Кольцо", isCorrect: false },
          { optionText: "Шина", isCorrect: false },
          { optionText: "Звезда", isCorrect: true },
          { optionText: "Случайная", isCorrect: false },
        ],
      },
      {
        questionText: "Какой протокол используется для веб-страниц?",
        explanation: "HTTP используется для передачи веб-страниц.",
        options: [
          { optionText: "SMTP", isCorrect: false },
          { optionText: "HTTP", isCorrect: true },
          { optionText: "FTP", isCorrect: false },
          { optionText: "ARP", isCorrect: false },
        ],
      },
      {
        questionText: "Что делает DNS?",
        explanation: "DNS преобразует доменные имена в IP-адреса.",
        options: [
          { optionText: "Шифрует трафик", isCorrect: false },
          { optionText: "Преобразует доменное имя в IP", isCorrect: true },
          { optionText: "Удаляет вирусы", isCorrect: false },
          { optionText: "Меняет MAC-адрес", isCorrect: false },
        ],
      },
      {
        questionText: "Чем отличается UDP от TCP?",
        explanation: "UDP быстрее, но не гарантирует доставку.",
        options: [
          { optionText: "UDP всегда надёжнее TCP", isCorrect: false },
          { optionText: "UDP не гарантирует доставку", isCorrect: true },
          { optionText: "Между ними нет разницы", isCorrect: false },
          { optionText: "UDP нужен только для БД", isCorrect: false },
        ],
      },
      {
        questionText: "Для чего нужна маска подсети?",
        explanation: "Маска помогает разделить IP-адрес на сеть и узел.",
        options: [
          { optionText: "Для разделения адреса на сеть и узел", isCorrect: true },
          { optionText: "Для шифрования трафика", isCorrect: false },
          { optionText: "Для печати сетевой карты", isCorrect: false },
          { optionText: "Для смены пароля", isCorrect: false },
        ],
      },
      {
        questionText: "Какая модель наиболее практична в интернете?",
        explanation: "В интернете наиболее широко используется TCP/IP.",
        options: [
          { optionText: "OSI", isCorrect: false },
          { optionText: "TCP/IP", isCorrect: true },
          { optionText: "SQL", isCorrect: false },
          { optionText: "HTML", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Веб-разработка",
    slug: "web-development",
    description: "HTML, CSS, JavaScript, frontend и backend.",
    icon: "🌍",
    color: "#06b6d4",
    group: "applied",
    topics: [
      {
        title: "HTML и структура веб-страницы",
        slug: "html-basics",
        order: 1,
        content: `HTML — это язык разметки, который определяет структуру веб-страницы. С его помощью создаются заголовки, абзацы, ссылки, изображения, списки, формы и другие элементы.

HTML формирует логический каркас страницы. Семантические теги помогают улучшить читаемость кода и доступность сайта для пользователей и поисковых систем.`,
      },
      {
        title: "CSS и оформление интерфейса",
        slug: "css-basics",
        order: 2,
        content: `CSS используется для оформления веб-страниц. С его помощью задают цвета, шрифты, отступы, границы, размеры, анимации и адаптивное поведение интерфейса.

CSS помогает превратить простую HTML-структуру в красивый и удобный интерфейс. Также он важен для адаптации под мобильные устройства.`,
      },
      {
        title: "JavaScript и логика веб-приложений",
        slug: "javascript-basics",
        order: 3,
        content: `JavaScript отвечает за интерактивность веб-страниц. Он позволяет реагировать на действия пользователя, изменять DOM, отправлять запросы на сервер и обрабатывать данные.

Современные веб-приложения используют JavaScript как на клиенте, так и на сервере. Он играет ключевую роль в создании динамических пользовательских интерфейсов.`,
      },
    ],
    questions: [
      {
        questionText: "Для чего используется HTML?",
        explanation: "HTML отвечает за структуру веб-страницы.",
        options: [
          { optionText: "Для структуры страницы", isCorrect: true },
          { optionText: "Для стилизации", isCorrect: false },
          { optionText: "Для шифрования", isCorrect: false },
          { optionText: "Для настройки БД", isCorrect: false },
        ],
      },
      {
        questionText: "Для чего используется CSS?",
        explanation: "CSS отвечает за оформление интерфейса.",
        options: [
          { optionText: "Для логики приложения", isCorrect: false },
          { optionText: "Для оформления страницы", isCorrect: true },
          { optionText: "Для SQL-запросов", isCorrect: false },
          { optionText: "Для компиляции Java", isCorrect: false },
        ],
      },
      {
        questionText: "Для чего используется JavaScript?",
        explanation: "JavaScript добавляет интерактивность и логику на страницу.",
        options: [
          { optionText: "Для хранения таблиц", isCorrect: false },
          { optionText: "Для интерактивности страницы", isCorrect: true },
          { optionText: "Для замены операционной системы", isCorrect: false },
          { optionText: "Для создания архивов", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое DOM?",
        explanation: "DOM — это объектная модель документа HTML.",
        options: [
          { optionText: "База данных", isCorrect: false },
          { optionText: "Объектная модель документа", isCorrect: true },
          { optionText: "Тип шифрования", isCorrect: false },
          { optionText: "Сетевой протокол", isCorrect: false },
        ],
      },
      {
        questionText: "Какой тег создаёт ссылку в HTML?",
        explanation: "Тег a используется для ссылок.",
        options: [
          { optionText: "img", isCorrect: false },
          { optionText: "a", isCorrect: true },
          { optionText: "div", isCorrect: false },
          { optionText: "p", isCorrect: false },
        ],
      },
      {
        questionText: "Какое свойство CSS задаёт цвет текста?",
        explanation: "Свойство color задаёт цвет текста.",
        options: [
          { optionText: "background", isCorrect: false },
          { optionText: "font-size", isCorrect: false },
          { optionText: "color", isCorrect: true },
          { optionText: "border", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое frontend?",
        explanation: "Frontend — это клиентская часть приложения, видимая пользователю.",
        options: [
          { optionText: "Часть интерфейса, видимая пользователю", isCorrect: true },
          { optionText: "Только база данных", isCorrect: false },
          { optionText: "Только серверная почта", isCorrect: false },
          { optionText: "Системный BIOS", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое backend?",
        explanation: "Backend отвечает за серверную логику и работу с данными.",
        options: [
          { optionText: "Серверная часть приложения", isCorrect: true },
          { optionText: "Только CSS", isCorrect: false },
          { optionText: "Только HTML", isCorrect: false },
          { optionText: "Список шрифтов", isCorrect: false },
        ],
      },
      {
        questionText: "Что позволяет сделать JavaScript в браузере?",
        explanation: "Он позволяет изменять DOM и реагировать на события.",
        options: [
          { optionText: "Только печатать текст", isCorrect: false },
          { optionText: "Изменять страницу и обрабатывать события", isCorrect: true },
          { optionText: "Создавать таблицы БД без сервера", isCorrect: false },
          { optionText: "Настраивать роутер", isCorrect: false },
        ],
      },
      {
        questionText: "Что важно для современного веб-интерфейса?",
        explanation: "Важны адаптивность, удобство и понятный интерфейс.",
        options: [
          { optionText: "Только размер логотипа", isCorrect: false },
          { optionText: "Адаптивность и удобство", isCorrect: true },
          { optionText: "Только одна кнопка", isCorrect: false },
          { optionText: "Полное отсутствие стилей", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Мобильная разработка",
    slug: "mobile-development",
    description: "Android, жизненный цикл приложения, UI и архитектура.",
    icon: "📱",
    color: "#22c55e",
    group: "applied",
    topics: [
      {
        title: "Основы мобильной разработки",
        slug: "mobile-basics",
        order: 1,
        content: `Мобильная разработка — это создание приложений для смартфонов и планшетов. Одним из популярных направлений является Android-разработка.

Мобильные приложения должны учитывать особенности экранов, производительности, пользовательского опыта и работы с сетью. Важную роль играет адаптация интерфейса под разные устройства.`,
      },
      {
        title: "Жизненный цикл Android-приложения",
        slug: "android-lifecycle",
        order: 2,
        content: `Android-приложение состоит из экранов и компонентов, жизненный цикл которых контролируется системой. Для Activity существуют методы onCreate, onStart, onResume, onPause, onStop и onDestroy.

Понимание жизненного цикла помогает корректно сохранять состояние, освобождать ресурсы и избегать ошибок.`,
      },
      {
        title: "Интерфейс и архитектура мобильного приложения",
        slug: "mobile-ui-architecture",
        order: 3,
        content: `При создании мобильного приложения важны структура интерфейса и архитектура проекта. Для организации кода часто используется MVVM.

Современные Android-приложения нередко строятся с помощью Jetpack Compose, ViewModel, Navigation и локального или облачного хранения данных.`,
      },
    ],
    questions: [
      {
        questionText: "Что такое мобильная разработка?",
        explanation: "Это создание приложений для мобильных устройств.",
        options: [
          { optionText: "Разработка BIOS", isCorrect: false },
          { optionText: "Создание приложений для смартфонов и планшетов", isCorrect: true },
          { optionText: "Только настройка Wi-Fi", isCorrect: false },
          { optionText: "Только создание сайтов", isCorrect: false },
        ],
      },
      {
        questionText: "Для какой платформы часто разрабатывают на Kotlin?",
        explanation: "Kotlin широко используется в Android-разработке.",
        options: [
          { optionText: "Android", isCorrect: true },
          { optionText: "Только Windows BIOS", isCorrect: false },
          { optionText: "Только SQL Server", isCorrect: false },
          { optionText: "Только FTP-серверы", isCorrect: false },
        ],
      },
      {
        questionText: "Какой метод Activity вызывается первым при создании экрана?",
        explanation: "Обычно жизненный цикл Activity начинается с onCreate.",
        options: [
          { optionText: "onDestroy", isCorrect: false },
          { optionText: "onCreate", isCorrect: true },
          { optionText: "onStop", isCorrect: false },
          { optionText: "onPause", isCorrect: false },
        ],
      },
      {
        questionText: "Зачем нужен жизненный цикл Activity?",
        explanation: "Он помогает правильно управлять состоянием и ресурсами экрана.",
        options: [
          { optionText: "Для смены цвета фона", isCorrect: false },
          { optionText: "Для управления состоянием и ресурсами", isCorrect: true },
          { optionText: "Для сортировки массивов", isCorrect: false },
          { optionText: "Для настройки SQL", isCorrect: false },
        ],
      },
      {
        questionText: "Что означает MVVM?",
        explanation: "MVVM — Model, View, ViewModel.",
        options: [
          { optionText: "Model View ViewModel", isCorrect: true },
          { optionText: "Main Visual Virtual Machine", isCorrect: false },
          { optionText: "Mobile View Version Module", isCorrect: false },
          { optionText: "Map Value View Method", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое Jetpack Compose?",
        explanation: "Jetpack Compose — современный инструмент для построения UI в Android.",
        options: [
          { optionText: "СУБД", isCorrect: false },
          { optionText: "Инструмент для создания UI", isCorrect: true },
          { optionText: "Антивирус", isCorrect: false },
          { optionText: "Формат архива", isCorrect: false },
        ],
      },
      {
        questionText: "Почему важна адаптация интерфейса под разные экраны?",
        explanation: "Чтобы приложение было удобно использовать на разных устройствах.",
        options: [
          { optionText: "Для работы принтера", isCorrect: false },
          { optionText: "Для удобства на разных устройствах", isCorrect: true },
          { optionText: "Для запуска Java в BIOS", isCorrect: false },
          { optionText: "Для смены MAC-адреса", isCorrect: false },
        ],
      },
      {
        questionText: "Что делает ViewModel в архитектуре MVVM?",
        explanation: "ViewModel хранит состояние и помогает отделить UI от логики.",
        options: [
          { optionText: "Только рисует кнопки", isCorrect: false },
          { optionText: "Хранит состояние и связывает UI с логикой", isCorrect: true },
          { optionText: "Только хранит картинки", isCorrect: false },
          { optionText: "Создаёт SQL индексы", isCorrect: false },
        ],
      },
      {
        questionText: "Что важно для мобильного приложения кроме логики?",
        explanation: "Важно учитывать UX, производительность и работу на разных экранах.",
        options: [
          { optionText: "Только название приложения", isCorrect: false },
          { optionText: "UX и производительность", isCorrect: true },
          { optionText: "Только иконка", isCorrect: false },
          { optionText: "Только один экран", isCorrect: false },
        ],
      },
      {
        questionText: "Что часто используют для хранения данных в мобильном приложении?",
        explanation: "Часто используют локальные базы, API и облачные сервисы.",
        options: [
          { optionText: "Только Paint", isCorrect: false },
          { optionText: "Локальную базу или облачный сервис", isCorrect: true },
          { optionText: "Только BIOS", isCorrect: false },
          { optionText: "Только ZIP-архивы", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Тестирование программного обеспечения",
    slug: "software-testing",
    description: "Виды тестирования, тест-кейсы, дефекты и качество ПО.",
    icon: "✅",
    color: "#f97316",
    group: "applied",
    topics: [
      {
        title: "Основные понятия тестирования",
        slug: "testing-basics",
        order: 1,
        content: `Тестирование программного обеспечения — это процесс проверки программы с целью выявления ошибок и оценки соответствия требованиям.

Оно помогает убедиться, что система работает корректно, удобно для пользователя и соответствует ожидаемому поведению. Тестирование проводится на разных этапах жизненного цикла разработки.`,
      },
      {
        title: "Виды тестирования",
        slug: "testing-types",
        order: 2,
        content: `Существуют функциональное и нефункциональное тестирование. Также применяются модульное, интеграционное, системное, регрессионное, нагрузочное и приёмочное тестирование.

Каждый вид тестирования проверяет систему с определённой стороны. Совмещение разных подходов позволяет повысить качество продукта.`,
      },
      {
        title: "Тест-кейсы и отчёты об ошибках",
        slug: "test-cases-and-bugs",
        order: 3,
        content: `Тест-кейс — это описанный сценарий проверки, включающий шаги, входные данные и ожидаемый результат. Он помогает выполнять проверки последовательно и воспроизводимо.

Если обнаружена ошибка, оформляется баг-репорт. В нём указываются шаги воспроизведения, фактический результат, ожидаемое поведение и приоритет дефекта.`,
      },
    ],
    questions: [
      {
        questionText: "Что такое тестирование ПО?",
        explanation: "Это проверка программы для поиска ошибок и оценки качества.",
        options: [
          { optionText: "Украшение интерфейса", isCorrect: false },
          { optionText: "Проверка программы для поиска ошибок", isCorrect: true },
          { optionText: "Только написание кода", isCorrect: false },
          { optionText: "Только установка базы данных", isCorrect: false },
        ],
      },
      {
        questionText: "Что проверяет функциональное тестирование?",
        explanation: "Функциональное тестирование проверяет работу функций согласно требованиям.",
        options: [
          { optionText: "Только цвет кнопок", isCorrect: false },
          { optionText: "Функции системы", isCorrect: true },
          { optionText: "Только температуру процессора", isCorrect: false },
          { optionText: "Только размер шрифта", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое регрессионное тестирование?",
        explanation: "Оно проверяет, не сломались ли старые функции после изменений.",
        options: [
          { optionText: "Проверка старых функций после изменений", isCorrect: true },
          { optionText: "Только тестирование скорости интернета", isCorrect: false },
          { optionText: "Только удаление багов", isCorrect: false },
          { optionText: "Только настройка сервера", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое тест-кейс?",
        explanation: "Тест-кейс — это сценарий проверки с шагами и ожидаемым результатом.",
        options: [
          { optionText: "Сценарий проверки", isCorrect: true },
          { optionText: "Случайный баг", isCorrect: false },
          { optionText: "Файл шрифта", isCorrect: false },
          { optionText: "Сетевой пакет", isCorrect: false },
        ],
      },
      {
        questionText: "Что указывается в баг-репорте?",
        explanation: "В баг-репорте описываются шаги воспроизведения и результаты.",
        options: [
          { optionText: "Только имя проекта", isCorrect: false },
          { optionText: "Шаги воспроизведения и результаты", isCorrect: true },
          { optionText: "Только логотип", isCorrect: false },
          { optionText: "Только пароль пользователя", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое модульное тестирование?",
        explanation: "Это проверка отдельных частей программы.",
        options: [
          { optionText: "Проверка отдельных модулей", isCorrect: true },
          { optionText: "Проверка всей сети", isCorrect: false },
          { optionText: "Только ручное тестирование", isCorrect: false },
          { optionText: "Только тестирование интерфейса", isCorrect: false },
        ],
      },
      {
        questionText: "Что проверяет нагрузочное тестирование?",
        explanation: "Оно оценивает работу системы при высокой нагрузке.",
        options: [
          { optionText: "Поведение при нагрузке", isCorrect: true },
          { optionText: "Только цвета страницы", isCorrect: false },
          { optionText: "Только грамматику текста", isCorrect: false },
          { optionText: "Только наличие иконок", isCorrect: false },
        ],
      },
      {
        questionText: "Почему тестирование важно?",
        explanation: "Оно помогает выявлять ошибки и повышать качество ПО.",
        options: [
          { optionText: "Потому что без него больше шрифтов", isCorrect: false },
          { optionText: "Оно помогает находить ошибки", isCorrect: true },
          { optionText: "Оно заменяет разработку", isCorrect: false },
          { optionText: "Оно нужно только для презентации", isCorrect: false },
        ],
      },
      {
        questionText: "Что такое ожидаемый результат в тест-кейсе?",
        explanation: "Это то, как система должна работать при корректном поведении.",
        options: [
          { optionText: "Как должна работать система", isCorrect: true },
          { optionText: "Случайный результат", isCorrect: false },
          { optionText: "Только время запуска", isCorrect: false },
          { optionText: "Имя тестировщика", isCorrect: false },
        ],
      },
      {
        questionText: "Что означает дефект в ПО?",
        explanation: "Дефект — это ошибка или несоответствие требованиям.",
        options: [
          { optionText: "Ошибка или несоответствие требованиям", isCorrect: true },
          { optionText: "Только обновление системы", isCorrect: false },
          { optionText: "Новый дизайн", isCorrect: false },
          { optionText: "Тип коллекции Java", isCorrect: false },
        ],
      },
    ],
  },

    {
    title: "Программная инженерия",
    slug: "software-engineering",
    description: "Жизненный цикл ПО, требования, проектирование и сопровождение.",
    icon: "🛠️",
    color: "#a855f7",
    group: "applied",
    topics: [
      {
        title: "Жизненный цикл программного обеспечения",
        slug: "software-lifecycle",
        order: 1,
        content: `Программная инженерия изучает методы систематической разработки программного обеспечения. Важной частью является жизненный цикл ПО.

Он включает анализ требований, проектирование, разработку, тестирование, внедрение и сопровождение. Каждый этап влияет на качество конечного продукта.`,
      },
      {
        title: "Сбор требований и проектирование",
        slug: "requirements-and-design",
        order: 2,
        content: `На этапе требований определяется, что должна делать система, какие функции нужны пользователям и какие ограничения существуют.

На этапе проектирования формируется архитектура, структура модулей, модель данных и взаимодействие компонентов. Ошибки на этих этапах могут дорого стоить на дальнейшей разработке.`,
      },
      {
        title: "Поддержка и развитие программных систем",
        slug: "maintenance-and-evolution",
        order: 3,
        content: `После внедрения система требует сопровождения. Это включает исправление дефектов, улучшение производительности, адаптацию к новым условиям и добавление нового функционала.

Хорошая архитектура и документация упрощают развитие проекта. Именно поэтому программная инженерия делает акцент не только на коде, но и на процессе разработки.`,
      },
    ],
    questions: [
      {
        questionText: "Что изучает программная инженерия?",
        explanation: "Она изучает методы систематической разработки программного обеспечения.",
        options: [
          { optionText: "Только сборку компьютеров", isCorrect: false },
          { optionText: "Методы разработки программного обеспечения", isCorrect: true },
          { optionText: "Только сетевые кабели", isCorrect: false },
          { optionText: "Только шифрование", isCorrect: false },
        ],
      },
      {
        questionText: "Что входит в жизненный цикл ПО?",
        explanation: "Жизненный цикл включает анализ, проектирование, разработку, тестирование, внедрение и сопровождение.",
        options: [
          { optionText: "Только дизайн логотипа", isCorrect: false },
          { optionText: "Анализ, проектирование, разработка, тестирование и сопровождение", isCorrect: true },
          { optionText: "Только установка ОС", isCorrect: false },
          { optionText: "Только публикация сайта", isCorrect: false },
        ],
      },
      {
        questionText: "Что делается на этапе сбора требований?",
        explanation: "На этом этапе определяют, что должна делать система.",
        options: [
          { optionText: "Удаляются таблицы базы", isCorrect: false },
          { optionText: "Определяются цели и функции системы", isCorrect: true },
          { optionText: "Только меняется цвет кнопок", isCorrect: false },
          { optionText: "Только пишется README", isCorrect: false },
        ],
      },
      {
        questionText: "Что формируется на этапе проектирования?",
        explanation: "На этом этапе создаются архитектура и структура системы.",
        options: [
          { optionText: "Архитектура и структура системы", isCorrect: true },
          { optionText: "Только почта для OTP", isCorrect: false },
          { optionText: "Только один SQL-запрос", isCorrect: false },
          { optionText: "Только обложка проекта", isCorrect: false },
        ],
      },
      {
        questionText: "Почему важна архитектура системы?",
        explanation: "Она влияет на удобство сопровождения, расширяемость и качество проекта.",
        options: [
          { optionText: "Потому что меняет пароль", isCorrect: false },
          { optionText: "Она влияет на поддержку и развитие системы", isCorrect: true },
          { optionText: "Потому что убирает тестирование", isCorrect: false },
          { optionText: "Потому что заменяет frontend", isCorrect: false },
        ],
      },
      {
        questionText: "Что включает сопровождение системы?",
        explanation: "Сопровождение включает исправление ошибок и развитие функциональности.",
        options: [
          { optionText: "Исправление ошибок и развитие системы", isCorrect: true },
          { optionText: "Только смену иконки", isCorrect: false },
          { optionText: "Только удаление пользователей", isCorrect: false },
          { optionText: "Только изменение шрифтов", isCorrect: false },
        ],
      },
      {
        questionText: "Что происходит после внедрения программной системы?",
        explanation: "После внедрения начинается этап сопровождения.",
        options: [
          { optionText: "Система больше не изменяется", isCorrect: false },
          { optionText: "Начинается сопровождение", isCorrect: true },
          { optionText: "Удаляется база данных", isCorrect: false },
          { optionText: "Останавливается вся работа", isCorrect: false },
        ],
      },
      {
        questionText: "Почему ошибки на этапе требований опасны?",
        explanation: "Они приводят к неверной реализации всей системы.",
        options: [
          { optionText: "Потому что меняется фон страницы", isCorrect: false },
          { optionText: "Они влияют на дальнейшую разработку", isCorrect: true },
          { optionText: "Потому что ломают монитор", isCorrect: false },
          { optionText: "Потому что удаляют все файлы автоматически", isCorrect: false },
        ],
      },
      {
        questionText: "Что помогает развивать проект после релиза?",
        explanation: "Хорошая архитектура и документация облегчают сопровождение.",
        options: [
          { optionText: "Отсутствие структуры", isCorrect: false },
          { optionText: "Хорошая архитектура и документация", isCorrect: true },
          { optionText: "Только длинные названия файлов", isCorrect: false },
          { optionText: "Отсутствие тестов", isCorrect: false },
        ],
      },
      {
        questionText: "На каком этапе проверяют корректность работы системы?",
        explanation: "Это делается на этапе тестирования.",
        options: [
          { optionText: "На этапе тестирования", isCorrect: true },
          { optionText: "Только после удаления базы", isCorrect: false },
          { optionText: "На этапе выключения компьютера", isCorrect: false },
          { optionText: "На этапе выбора шрифта", isCorrect: false },
        ],
      },
    ],
  },

  {
    title: "Общий экзамен",
    slug: "general-exam",
    description: "Общий экзаменационный режим по всем дисциплинам.",
    icon: "🎯",
    color: "#ec4899",
    group: "applied",
    topics: [
      {
        title: "Общий экзаменационный режим",
        slug: "general-exam-mode",
        order: 1,
        content: "Этот раздел используется для итогового междисциплинарного экзамена.",
      },
    ],
    questions: [],
  },
];

async function clearDatabase() {
  console.log("🧹 Clearing old data...");

  await prisma.quizAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.theoryTopic.deleteMany();
  await prisma.subject.deleteMany();
}

async function seedSubjects() {
  console.log("🌱 Seeding subjects, topics and questions...");

  for (const subjectData of subjects) {
    const subject = await prisma.subject.create({
      data: {
        title: subjectData.title,
        slug: subjectData.slug,
        description: subjectData.description,
        icon: subjectData.icon,
        color: subjectData.color,
        group: subjectData.group,
      },
    });

    for (const topic of subjectData.topics) {
      await prisma.theoryTopic.create({
        data: {
          subjectId: subject.id,
          title: topic.title,
          slug: topic.slug,
          content: topic.content,
          order: topic.order,
        },
      });
    }

    for (let i = 0; i < subjectData.questions.length; i++) {
      const q = subjectData.questions[i];

      await prisma.question.create({
        data: {
          subjectId: subject.id,
          questionText: q.questionText,
          explanation: q.explanation,
          order: i + 1,
          options: {
            create: q.options,
          },
        },
      });
    }

    console.log(`✅ Added subject: ${subject.title}`);
  }
}

async function main() {
  await clearDatabase();
  await seedSubjects();
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });