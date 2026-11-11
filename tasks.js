/* =========================================================
   tasks.js — банк заданий по личным конспектам
   ========================================================= */

export const TOPICS = {
  greetings:    'Приветствия и знакомство',
  pronouns:     'Местоимения',
  family:       'Семья',
  numbers:      'Цифры',
  time:         'Время',
  date:         'Дата и дни недели',
  daily:        'Обычная жизнь',
  colors:       'Цвета',
  pinyin:       'Пиньинь и тоны'
};

export const TASKS = [

  /* ═════════════════ ЗНАКОМСТВО (ПРИВЕТСТВИЯ) ═════════════════ */
  { topic: "greetings", type: "choice", q: "Что означает 你好?", answer: "Привет", options: ["Здравствуйте", "До свидания", "Спасибо"] },
  { topic: "greetings", type: "choice", q: "Что означает 您好?", answer: "Здравствуйте", options: ["Привет", "Всем привет", "До свидания"] },
  { topic: "greetings", type: "choice", q: "Что означает 大家好?", answer: "Всем привет", options: ["Привет", "Здравствуйте", "Доброе утро"] },
  { topic: "greetings", type: "choice", q: "Что означает 早上好?", answer: "Доброе утро", options: ["Добрый вечер", "Спокойной ночи", "Всем привет"] },
  { topic: "greetings", type: "choice", q: "Что означает 晚上好?", answer: "Добрый вечер", options: ["Доброе утро", "Спокойной ночи", "Привет"] },
  { topic: "greetings", type: "choice", q: "Что означает 再见?", answer: "До свидания", options: ["Привет", "Здравствуйте", "Спасибо"] },
  { topic: "greetings", type: "choice", q: "Как тебя зовут?", answer: "你叫什么名字？", options: ["你姓什么？", "你多大了？", "你几岁？"] },
  { topic: "greetings", type: "choice", q: "Что означает 我叫?", answer: "Меня зовут", options: ["Моя фамилия", "Мне лет", "Я учусь"] },
  { topic: "greetings", type: "choice", q: "Что означает 很高兴认识你?", answer: "Приятно познакомиться", options: ["Как тебя зовут?", "До свидания", "Спасибо"] },
  { topic: "greetings", type: "choice", q: "Что означает 朋友?", answer: "Друг", options: ["Семья", "Школа", "Работа"] },
  { topic: "greetings", type: "choice", q: "Что означает 生日?", answer: "День рождения", options: ["Праздник", "Выходной", "Новый год"] },
  { topic: "greetings", type: "choice", q: "Когда твой день рождения?", answer: "你的生日是几月几号？", options: ["今天几月几号？", "你叫什么名字？", "你几岁？"] },
  { topic: "greetings", type: "choice", q: "Как твоя фамилия?", answer: "你姓什么？", options: ["你叫什么名字？", "你多大了？", "你几岁？"] },
  { topic: "greetings", type: "choice", q: "Что означает 你多大了？", answer: "Сколько тебе лет?", options: ["Как тебя зовут?", "Какая у тебя фамилия?", "Как дела?"] },
  { topic: "greetings", type: "choice", q: "Что означает 你几岁？", answer: "Сколько тебе лет?", options: ["Как тебя зовут?", "Какая у тебя фамилия?", "Который час?"] },
  { topic: "greetings", type: "fill", q: "Вставьте пропуск:<br>你<span class=\"blank\"></span>什么名字？", answers: ["叫"], placeholder: "один иероглиф" },
  { topic: "greetings", type: "fill", q: "Вставьте пропуск:<br>我<span class=\"blank\"></span>中国人。", answers: ["是"], placeholder: "один иероглиф" },
  { topic: "greetings", type: "fill", q: "Напишите иероглифами: «Приятно познакомиться»", answers: ["很高兴认识你"], placeholder: "иероглифы" },
  { topic: "greetings", type: "order", q: "Соберите: «Приятно познакомиться»", words: ["认识", "很", "你", "高兴"], answer: ["很", "高兴", "认识", "你"] },
  { topic: "greetings", type: "order", q: "Соберите: «Меня зовут...»", words: ["叫", "我"], answer: ["我", "叫"] },
  { topic: "greetings", type: "match", q: "Соедините приветствия", pairs: [["你好", "Привет"], ["您好", "Здравствуйте"], ["早上好", "Доброе утро"], ["晚上好", "Добрый вечер"]] },

  /* ═════════════════ МЕСТОИМЕНИЯ ═════════════════ */
  { topic: "pronouns", type: "choice", q: "Что означает 我?", answer: "Я", options: ["Ты", "Он", "Она"] },
  { topic: "pronouns", type: "choice", q: "Что означает 你?", answer: "Ты", options: ["Я", "Вы", "Он"] },
  { topic: "pronouns", type: "choice", q: "Что означает 您?", answer: "Вы (ед.ч., вежливо)", options: ["Ты", "Он", "Мы"] },
  { topic: "pronouns", type: "choice", q: "Что означает 他?", answer: "Он", options: ["Она", "Ты", "Я"] },
  { topic: "pronouns", type: "choice", q: "Что означает 她?", answer: "Она", options: ["Он", "Ты", "Я"] },
  { topic: "pronouns", type: "choice", q: "Как образуется множественное число?", answer: "Добавляется 们 (men)", options: ["Добавляется 的 (de)", "Добавляется 是 (shì)", "Меняется тон"] },
  { topic: "pronouns", type: "choice", q: "Что означает 我们?", answer: "Мы", options: ["Вы", "Они", "Я"] },
  { topic: "pronouns", type: "choice", q: "Что означает 你们?", answer: "Вы (мн.ч.)", options: ["Мы", "Они", "Ты"] },
  { topic: "pronouns", type: "choice", q: "Что означает 他们?", answer: "Они (мужчины)", options: ["Мы", "Вы", "Они (женщины)"] },
  { topic: "pronouns", type: "choice", q: "Что означает 她们?", answer: "Они (женщины)", options: ["Мы", "Вы", "Они (мужчины)"] },
  { topic: "pronouns", type: "fill", q: "Напишите иероглифами: «мы»", answers: ["我们"], placeholder: "иероглифы" },
  { topic: "pronouns", type: "fill", q: "Напишите пиньинь для 我们", answers: ["women"], placeholder: "пиньинь без тонов" },
  { topic: "pronouns", type: "match", q: "Соедините местоимения", pairs: [["我", "Я"], ["您", "Вы"], ["他们", "Они (м.)"], ["她们", "Они (ж.)"]] },
  { topic: "pronouns", type: "order", q: "Соберите: «Я в школе»", words: ["学校", "我", "在"], answer: ["我", "在", "学校"] },

  /* ═════════════════ СЕМЬЯ ═════════════════ */
  { topic: "family", type: "choice", q: "Что означает 哥哥?", answer: "Старший брат", options: ["Младший брат", "Старшая сестра", "Младшая сестра"] },
  { topic: "family", type: "choice", q: "Что означает 弟弟?", answer: "Младший брат", options: ["Старший брат", "Старшая сестра", "Младшая сестра"] },
  { topic: "family", type: "choice", q: "Что означает 姐姐?", answer: "Старшая сестра", options: ["Младшая сестра", "Старший брат", "Младший брат"] },
  { topic: "family", type: "choice", q: "Что означает 妹妹?", answer: "Младшая сестра", options: ["Старшая сестра", "Старший брат", "Младший брат"] },
  { topic: "family", type: "choice", q: "Что означает 宝贝?", answer: "Ребёнок", options: ["Взрослый", "Бабушка", "Дядя"] },
  { topic: "family", type: "choice", q: "Он мой старший брат", answer: "他是我的哥哥", options: ["她是我的姐姐", "他是我的弟弟", "她是我的妹妹"] },
  { topic: "family", type: "choice", q: "Она моя младшая сестра", answer: "她是我的妹妹", options: ["他是我的弟弟", "她是我的姐姐", "他是我的哥哥"] },
  { topic: "family", type: "fill", q: "Напишите иероглифами: «старший брат»", answers: ["哥哥"], placeholder: "иероглифы" },
  { topic: "family", type: "fill", q: "Напишите иероглифами: «младшая сестра»", answers: ["妹妹"], placeholder: "иероглифы" },
  { topic: "family", type: "match", q: "Соедините членов семьи", pairs: [["哥哥", "Старший брат"], ["弟弟", "Младший брат"], ["姐姐", "Старшая сестра"], ["妹妹", "Младшая сестра"]] },
  { topic: "family", type: "order", q: "Соберите: «Он мой младший брат»", words: ["弟弟", "他", "我", "是", "的"], answer: ["他", "是", "我", "的", "弟弟"] },
  { topic: "family", type: "order", q: "Соберите: «Она моя старшая сестра»", words: ["姐姐", "她", "我", "是", "的"], answer: ["她", "是", "我", "的", "姐姐"] },

  /* ═════════════════ ВРЕМЯ ═════════════════ */
  { topic: "time", type: "choice", q: "Что означает 时间?", answer: "Время", options: ["Час", "Минута", "День"] },
  { topic: "time", type: "choice", q: "Что означает 点?", answer: "Час", options: ["Минута", "Секунда", "День"] },
  { topic: "time", type: "choice", q: "Что означает 分?", answer: "Минута", options: ["Час", "Половина", "Секунда"] },
  { topic: "time", type: "choice", q: "Что означает 半?", answer: "Половина", options: ["Четверть", "Целый", "Минута"] },
  { topic: "time", type: "choice", q: "Что означает 刻?", answer: "Четверть", options: ["Половина", "Минута", "Час"] },
  { topic: "time", type: "choice", q: "Что означает 差?", answer: "Без (при указании времени)", options: ["И", "Или", "Половина"] },
  { topic: "time", type: "choice", q: "Что означает 现在?", answer: "Сейчас", options: ["Потом", "Вчера", "Завтра"] },
  { topic: "time", type: "choice", q: "Сколько сейчас времени?", answer: "现在几点", options: ["今天几月几号", "你几岁", "你叫什么名字"] },
  { topic: "time", type: "choice", q: "Как сказать «Два часа»?", answer: "两点", options: ["二点", "两时", "二时"] },
  { topic: "time", type: "choice", q: "Как сказать «1:30»?", answer: "一点半", options: ["一点一刻", "一点三刻", "一点十分"] },
  { topic: "time", type: "choice", q: "Как сказать «6:15»?", answer: "六点一刻", options: ["六点半", "六点三刻", "六点十五分"] },
  { topic: "time", type: "choice", q: "Как сказать «4:45»?", answer: "四点三刻", options: ["四点半", "四点一刻", "四点四十五分"] },
  { topic: "time", type: "choice", q: "Что означает 早上?", answer: "Утро (5:00-9:00)", options: ["До обеда (9:00-12:00)", "Обед (12:00-14:00)", "Вечер (18:00-0:00)"] },
  { topic: "time", type: "choice", q: "Что означает 上午?", answer: "До обеда (9:00-12:00)", options: ["Утро (5:00-9:00)", "Обед (12:00-14:00)", "Днем (14:00-18:00)"] },
  { topic: "time", type: "choice", q: "Что означает 中午?", answer: "Обед (12:00-14:00)", options: ["Утро (5:00-9:00)", "До обеда (9:00-12:00)", "Днем (14:00-18:00)"] },
  { topic: "time", type: "choice", q: "Что означает 下午?", answer: "Днем (14:00-18:00)", options: ["Утро (5:00-9:00)", "Обед (12:00-14:00)", "Вечер (18:00-0:00)"] },
  { topic: "time", type: "choice", q: "Что означает 晚上?", answer: "Вечер (18:00-0:00)", options: ["Днем (14:00-18:00)", "Ночь (0:00-5:00)", "Утро (5:00-9:00)"] },
  { topic: "time", type: "choice", q: "Что означает 夜里?", answer: "Ночь (0:00-5:00)", options: ["Вечер (18:00-0:00)", "Утро (5:00-9:00)", "Обед (12:00-14:00)"] },
  { topic: "time", type: "fill", q: "Напишите иероглифами: «половина»", answers: ["半"], placeholder: "иероглиф" },
  { topic: "time", type: "fill", q: "Напишите иероглифами: «четверть»", answers: ["刻"], placeholder: "иероглиф" },
  { topic: "time", type: "fill", q: "Напишите пиньинь для 时间", answers: ["shijian"], placeholder: "пиньинь без тонов" },
  { topic: "time", type: "match", q: "Соедините части суток", pairs: [["早上", "Утро"], ["中午", "Обед"], ["下午", "Днем"], ["晚上", "Вечер"]] },
  { topic: "time", type: "match", q: "Соедините время", pairs: [["一点", "1:00"], ["两点", "2:00"], ["三点", "3:00"], ["四点", "4:00"]] },
  { topic: "time", type: "order", q: "Соберите: «Сейчас сколько времени?»", words: ["点", "现在", "几"], answer: ["现在", "几", "点"] },

  /* ═════════════════ ДАТА ═════════════════ */
  { topic: "date", type: "choice", q: "Что означает 日期?", answer: "Дата", options: ["Год", "Месяц", "День"] },
  { topic: "date", type: "choice", q: "Что означает 年?", answer: "Год", options: ["Месяц", "День", "Неделя"] },
  { topic: "date", type: "choice", q: "Что означает 月?", answer: "Месяц, луна", options: ["Год", "День, солнце", "Неделя"] },
  { topic: "date", type: "choice", q: "Что означает 日?", answer: "Число, день, солнце", options: ["Месяц", "Год", "Ночь"] },
  { topic: "date", type: "choice", q: "Что означает 号?", answer: "Число", options: ["Год", "Месяц", "День недели"] },
  { topic: "date", type: "choice", q: "Что означает 天?", answer: "День", options: ["Год", "Месяц", "Час"] },
  { topic: "date", type: "choice", q: "Что означает 今天?", answer: "Сегодня", options: ["Вчера", "Завтра", "Сейчас"] },
  { topic: "date", type: "choice", q: "Что означает 昨天?", answer: "Вчера", options: ["Сегодня", "Завтра", "Потом"] },
  { topic: "date", type: "choice", q: "Что означает 明天?", answer: "Завтра", options: ["Сегодня", "Вчера", "Сейчас"] },
  { topic: "date", type: "choice", q: "Что означает 星期?", answer: "Неделя", options: ["Месяц", "Год", "День"] },
  { topic: "date", type: "choice", q: "Что означает 星期一?", answer: "Понедельник", options: ["Вторник", "Суббота", "Воскресенье"] },
  { topic: "date", type: "choice", q: "Что означает 星期六?", answer: "Суббота", options: ["Понедельник", "Воскресенье", "Пятница"] },
  { topic: "date", type: "choice", q: "Что означает 星期天 / 星期日?", answer: "Воскресенье", options: ["Суббота", "Понедельник", "Вторник"] },
  { topic: "date", type: "choice", q: "Что означает 一月?", answer: "Январь", options: ["Февраль", "Декабрь", "Март"] },
  { topic: "date", type: "choice", q: "Что означает 十二月?", answer: "Декабрь", options: ["Январь", "Ноябрь", "Октябрь"] },
  { topic: "date", type: "choice", q: "Какой сегодня месяц, день?", answer: "今天几月几号？", options: ["昨天几月几号？", "明天几月几号？", "现在几点？"] },
  { topic: "date", type: "choice", q: "Что означает 喜欢?", answer: "Нравится", options: ["Не нравится", "Любить (еду)", "Хотеть"] },
  { topic: "date", type: "choice", q: "Какой день недели тебе нравится?", answer: "你喜欢星期几？", options: ["今天几月几号？", "你叫什么名字？", "现在几点？"] },
  { topic: "date", type: "choice", q: "Мне нравится суббота", answer: "我喜欢星期六", options: ["我喜欢星期天", "我不喜欢星期六", "今天是星期六"] },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «сегодня»", answers: ["今天"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «завтра»", answers: ["明天"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «вчера»", answers: ["昨天"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «неделя»", answers: ["星期"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите пиньинь для 今天", answers: ["jintian"], placeholder: "пиньинь без тонов" },
  { topic: "date", type: "match", q: "Соедините дни", pairs: [["星期一", "Понедельник"], ["星期三", "Среда"], ["星期六", "Суббота"], ["星期天", "Воскресенье"]] },
  { topic: "date", type: "match", q: "Соедините месяцы", pairs: [["一月", "Январь"], ["六月", "Июнь"], ["十月", "Октябрь"], ["十二月", "Декабрь"]] },
  { topic: "date", type: "order", q: "Соберите: «Какое сегодня число?»", words: ["几号", "今天", "几月"], answer: ["今天", "几月", "几号"] },

  /* ═════════════════ ОБЫЧНАЯ ЖИЗНЬ ═════════════════ */
  { topic: "daily", type: "choice", q: "Что означает 日常生活?", answer: "Обычная жизнь", options: ["Выходной день", "Рабочий день", "Праздник"] },
  { topic: "daily", type: "choice", q: "Какая частица превращает существительное в прилагательное?", answer: "的 (de)", options: ["们 (men)", "是 (shì)", "在 (zài)"] },
  { topic: "daily", type: "choice", q: "Что означает 起床?", answer: "Вставать", options: ["Ложиться спать", "Завтракать", "Ужинать"] },
  { topic: "daily", type: "choice", q: "Что означает 睡觉?", answer: "Ложиться спать", options: ["Вставать", "Есть", "Работать"] },
  { topic: "daily", type: "choice", q: "Что означает 吃?", answer: "Есть, кушать", options: ["Пить", "Спать", "Идти"] },
  { topic: "daily", type: "choice", q: "Что означает 饭?", answer: "Еда", options: ["Вода", "Чай", "Хлеб"] },
  { topic: "daily", type: "choice", q: "Что означает 吃早饭?", answer: "Завтракать", options: ["Обедать", "Ужинать", "Готовить"] },
  { topic: "daily", type: "choice", q: "Что означает 吃午饭?", answer: "Обедать", options: ["Завтракать", "Ужинать", "Готовить"] },
  { topic: "daily", type: "choice", q: "Что означает 吃晚饭?", answer: "Ужинать", options: ["Завтракать", "Обедать", "Готовить"] },
  { topic: "daily", type: "choice", q: "Что означает 做?", answer: "Делать, готовить", options: ["Есть", "Спать", "Идти"] },
  { topic: "daily", type: "choice", q: "Что означает 做饭?", answer: "Готовить еду", options: ["Есть", "Мыть посуду", "Покупать еду"] },
  { topic: "daily", type: "choice", q: "Что означает 做作业?", answer: "Делать задание", options: ["Готовить", "Читать", "Писать"] },
  { topic: "daily", type: "choice", q: "Что означает 看电视?", answer: "Смотреть телевизор", options: ["Слушать музыку", "Играть", "Читать"] },
  { topic: "daily", type: "choice", q: "Что означает 上学?", answer: "Идти в школу", options: ["Идти на работу", "Идти домой", "Идти спать"] },
  { topic: "daily", type: "choice", q: "Что означает 上班?", answer: "Идти на работу", options: ["Идти в школу", "Идти домой", "Отдыхать"] },
  { topic: "daily", type: "choice", q: "Что означает 回家?", answer: "Возвращаться домой", options: ["Идти в школу", "Идти на работу", "Уезжать"] },
  { topic: "daily", type: "choice", q: "Что означает 工作?", answer: "Работать", options: ["Учиться", "Отдыхать", "Спать"] },
  { topic: "daily", type: "choice", q: "Что означает 学习?", answer: "Учить", options: ["Работать", "Отдыхать", "Играть"] },
  { topic: "daily", type: "choice", q: "Что означает 学校?", answer: "Школа", options: ["Работа", "Дом", "Магазин"] },
  { topic: "daily", type: "choice", q: "Что означает 中文 / 汉语?", answer: "Китайский язык", options: ["Английский язык", "Русский язык", "Японский язык"] },
  { topic: "daily", type: "choice", q: "Что означает 去?", answer: "Идти", options: ["Приходить", "Возвращаться", "Стоять"] },
  { topic: "daily", type: "choice", q: "Что означает 在?", answer: "В/на, где", options: ["Из", "К", "С"] },
  { topic: "daily", type: "choice", q: "Что означает 有?", answer: "Иметь", options: ["Быть", "Хотеть", "Мочь"] },
  { topic: "daily", type: "choice", q: "Что означает 和?", answer: "И", options: ["Или", "Но", "С"] },
  { topic: "daily", type: "choice", q: "Что означает 这?", answer: "Этот, это", options: ["Тот", "Какой", "Мой"] },
  { topic: "daily", type: "choice", q: "Что означает 或?", answer: "Или", options: ["И", "Но", "Тоже"] },
  { topic: "daily", type: "choice", q: "Что означает 还是?", answer: "Или (в вопросе)", options: ["И", "Но", "Тоже"] },
  { topic: "daily", type: "choice", q: "Что означает 猫?", answer: "Кот", options: ["Собака", "Цветок", "Птица"] },
  { topic: "daily", type: "choice", q: "Что означает 狗?", answer: "Собака", options: ["Кот", "Лошадь", "Рыба"] },
  { topic: "daily", type: "choice", q: "Что означает 花?", answer: "Цветок", options: ["Дерево", "Трава", "Лист"] },
  { topic: "daily", type: "choice", q: "Что означает 杯子?", answer: "Кружка, стакан", options: ["Тарелка", "Ложка", "Пиала"] },
  { topic: "daily", type: "choice", q: "Что означает 本子?", answer: "Тетрадь", options: ["Книга", "Ручка", "Альбом"] },
  { topic: "daily", type: "choice", q: "Что означает 你在做什么？", answer: "Что ты сейчас делаешь?", options: ["Куда ты идёшь?", "Как тебя зовут?", "Сколько тебе лет?"] },
  { topic: "daily", type: "choice", q: "Что означает 加油?", answer: "Давай, удачи", options: ["Извините", "Спасибо", "До свидания"] },
  { topic: "daily", type: "choice", q: "Что означает 不用谢?", answer: "Пожалуйста", options: ["Спасибо", "Извините", "Ничего страшного"] },
  { topic: "daily", type: "choice", q: "Что означает 不好意思?", answer: "Извините", options: ["Спасибо", "Пожалуйста", "Спокойной ночи"] },
  { topic: "daily", type: "choice", q: "Что означает 没事?", answer: "Ничего страшного", options: ["Извините", "Спасибо", "До свидания"] },
  { topic: "daily", type: "choice", q: "Что означает 晚安?", answer: "Спокойной ночи", options: ["Доброе утро", "Добрый вечер", "До свидания"] },
  { topic: "daily", type: "image", emoji: "🐱", q: "Что это по-китайски?", answer: "猫", options: ["狗", "花", "杯子"] },
  { topic: "daily", type: "image", emoji: "🐶", q: "Что это по-китайски?", answer: "狗", options: ["猫", "花", "本子"] },
  { topic: "daily", type: "image", emoji: "🌸", q: "Что это по-китайски?", answer: "花", options: ["猫", "狗", "杯子"] },
  { topic: "daily", type: "image", emoji: "☕", q: "Что это по-китайски?", answer: "杯子", options: ["本子", "花", "猫"] },
  { topic: "daily", type: "image", emoji: "📓", q: "Что это по-китайски?", answer: "本子", options: ["杯子", "花", "狗"] },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «школа»", answers: ["学校"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «учиться»", answers: ["学习"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «идти»", answers: ["去"], placeholder: "иероглиф" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «кушать»", answers: ["吃"], placeholder: "иероглиф" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «работать»", answers: ["工作"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «спать»", answers: ["睡觉"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «вставать»", answers: ["起床"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Вставьте пропуск:<br>我<span class=\"blank\"></span>学校。", answers: ["在"], placeholder: "один иероглиф" },
  { topic: "daily", type: "fill", q: "Вставьте пропуск:<br>我<span class=\"blank\"></span>学习中文。", answers: ["在"], placeholder: "один иероглиф" },
  { topic: "daily", type: "fill", q: "Вставьте пропуск:<br>你<span class=\"blank\"></span>做什么？", answers: ["在"], placeholder: "один иероглиф" },
  { topic: "daily", type: "match", q: "Соедините действия", pairs: [["起床", "Вставать"], ["吃饭", "Есть"], ["睡觉", "Спать"], ["工作", "Работать"]] },
  { topic: "daily", type: "match", q: "Соедините предметы", pairs: [["猫", "Кот"], ["狗", "Собака"], ["花", "Цветок"], ["杯子", "Кружка"]] },
  { topic: "daily", type: "match", q: "Соедините приёмы пищи", pairs: [["吃早饭", "Завтракать"], ["吃午饭", "Обедать"], ["吃晚饭", "Ужинать"], ["做饭", "Готовить"]] },
  { topic: "daily", type: "order", q: "Соберите: «Я в школе»", words: ["学校", "我", "在"], answer: ["我", "在", "学校"] },
  { topic: "daily", type: "order", q: "Соберите: «Я сейчас учу китайский»", words: ["中文", "我", "学习", "在"], answer: ["我", "在", "学习", "中文"] },
  { topic: "daily", type: "order", q: "Соберите: «Что ты сейчас делаешь?»", words: ["什么", "你", "做", "在"], answer: ["你", "在", "做", "什么"] },
  { topic: "daily", type: "order", q: "Соберите: «Я сейчас в...»", words: ["在", "我", "现在"], answer: ["我", "现在", "在"] },

  /* ═════════════════ ЦВЕТА ═════════════════ */
  { topic: "colors", type: "choice", q: "Что означает 色?", answer: "Цвет", options: ["Свет", "Тень", "Краска"] },
  { topic: "colors", type: "choice", q: "Что означает 白色?", answer: "Белый", options: ["Чёрный", "Серый", "Красный"] },
  { topic: "colors", type: "choice", q: "Что означает 黑色?", answer: "Чёрный", options: ["Белый", "Серый", "Красный"] },
  { topic: "colors", type: "choice", q: "Что означает 红色?", answer: "Красный", options: ["Синий", "Зелёный", "Белый"] },
  { topic: "colors", type: "choice", q: "Что означает 粉红色?", answer: "Розовый", options: ["Красный", "Белый", "Серый"] },
  { topic: "colors", type: "choice", q: "Что означает 灰色?", answer: "Серый", options: ["Белый", "Чёрный", "Красный"] },
  { topic: "colors", type: "choice", q: "Что означает 米色?", answer: "Бежевый", options: ["Белый", "Серый", "Розовый"] },
  { topic: "colors", type: "fill", q: "Напишите иероглифами: «цвет»", answers: ["色"], placeholder: "иероглиф" },
  { topic: "colors", type: "fill", q: "Напишите иероглифами: «красный»", answers: ["红色"], placeholder: "иероглифы" },
  { topic: "colors", type: "fill", q: "Напишите иероглифами: «белый»", answers: ["白色"], placeholder: "иероглифы" },
  { topic: "colors", type: "fill", q: "Напишите иероглифами: «чёрный»", answers: ["黑色"], placeholder: "иероглифы" },
  { topic: "colors", type: "fill", q: "Напишите пиньинь для 红色", answers: ["hongse"], placeholder: "пиньинь без тонов" },
  { topic: "colors", type: "match", q: "Соедините цвета", pairs: [["白色", "Белый"], ["黑色", "Чёрный"], ["红色", "Красный"], ["粉红色", "Розовый"]] },

  /* ═════════════════ ПИНЬИНЬ И ТОНЫ ═════════════════ */
  { topic: "pinyin", type: "choice", q: "Какой тон у ā?", answer: "1-й (ровный)", options: ["2-й (восходящий)", "3-й (нисходяще-восходящий)", "4-й (нисходящий)"] },
  { topic: "pinyin", type: "choice", q: "Какой тон у á?", answer: "2-й (восходящий)", options: ["1-й (ровный)", "3-й (нисходяще-восходящий)", "4-й (нисходящий)"] },
  { topic: "pinyin", type: "choice", q: "Какой тон у ǎ?", answer: "3-й (нисходяще-восходящий)", options: ["1-й (ровный)", "2-й (восходящий)", "4-й (нисходящий)"] },
  { topic: "pinyin", type: "choice", q: "Какой тон у à?", answer: "4-й (нисходящий)", options: ["1-й (ровный)", "2-й (восходящий)", "3-й (нисходяще-восходящий)"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль sh?", answer: "ш", options: ["с", "ч", "ж"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль zh?", answer: "дж", options: ["ж", "ч", "ш"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль x?", answer: "си", options: ["тси", "ши", "ди"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль q?", answer: "тси / чи", options: ["си", "ди", "тши"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль j?", answer: "ди / ти / дзи", options: ["си", "тси", "ши"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль r?", answer: "ж", options: ["р", "ш", "дж"] },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 你好", answers: ["nihao"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 朋友", answers: ["pengyou"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 时间", answers: ["shijian"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 现在", answers: ["xianzai"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 汉语", answers: ["hanyu"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "match", q: "Соедините инициали и звуки (1)", pairs: [["zh", "дж"], ["ch", "чъ / тш"], ["sh", "ш"], ["r", "ж"]] },
  { topic: "pinyin", type: "match", q: "Соедините инициали и звуки (2)", pairs: [["j", "ди / ти"], ["q", "тси / чи"], ["x", "си"], ["s", "с"]] }
];

/* =========================================================
   ГЕНЕРАТОРЫ ДИНАМИЧЕСКИХ ЗАДАНИЙ (основаны на конспектах)
   ========================================================= */

const ruMonths = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const cnDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function numToChinese(num) {
  if (num < 10) return cnDigits[num];
  if (num === 10) return '十';
  if (num < 20) return '十' + cnDigits[num % 10];
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return cnDigits[tens] + '十' + (ones === 0 ? '' : cnDigits[ones]);
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const rest = num % 100;
    let res = cnDigits[hundreds] + '百';
    if (rest > 0) {
      if (rest < 10) res += '零' + cnDigits[rest];
      else res += numToChinese(rest);
    }
    return res;
  }
  return '千'; // Ограничимся сотнями для простоты игры
}

function genNumbers() {
  const res = [];
  for (let i = 0; i < 30; i++) {
    let num = Math.floor(Math.random() * 150) + 1;
    // Добавим специфичные из конспекта (101, 110, 111, 105, 150, 115)
    const specials = [101, 110, 111, 105, 150, 115];
    if (i < 10) num = specials[i % specials.length];
    
    const cn = numToChinese(num);
    const opts = new Set([num]);
    while (opts.size < 4) {
      const off = Math.floor(Math.random() * 20) - 10;
      const w = num + off;
      if (w > 0 && w <= 1000 && w !== num) opts.add(w);
    }
    const arr = Array.from(opts).map(String);
    res.push({
      topic: "numbers",
      type: "choice",
      q: `Что означает ${cn}?`,
      answer: String(num),
      options: arr.filter(o => o !== String(num))
    });
  }
  return res;
}

function genTime() {
  const res = [];
  const mins = [0, 15, 30, 45];
  for (let i = 0; i < 30; i++) {
    const h = Math.floor(Math.random() * 12) + 1;
    const m = mins[Math.floor(Math.random() * mins.length)];
    
    let hStr = (h === 2) ? '两' : numToChinese(h);
    let cn = '';
    if (m === 0) cn = hStr + '点';
    else if (m === 15) cn = hStr + '点一刻';
    else if (m === 30) cn = hStr + '点半';
    else if (m === 45) cn = hStr + '点三刻';
    
    const timeStr = `${h}:${m.toString().padStart(2, '0')}`;
    const opts = new Set([timeStr]);
    while (opts.size < 4) {
      const wh = Math.floor(Math.random() * 12) + 1;
      const wm = mins[Math.floor(Math.random() * mins.length)];
      const wStr = `${wh}:${wm.toString().padStart(2, '0')}`;
      if (wStr !== timeStr) opts.add(wStr);
    }
    const arr = Array.from(opts);
    res.push({
      topic: "time",
      type: "choice",
      q: `Что означает ${cn}?`,
      answer: timeStr,
      options: arr.filter(o => o !== timeStr)
    });
  }
  return res;
}

function genDates() {
  const res = [];
  for (let i = 0; i < 20; i++) {
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const cnMonth = (month === 1) ? '一' : numToChinese(month);
    const cnDay = numToChinese(day);
    const cn = `${cnMonth}月${cnDay}日`;
    const dateStr = `${day} ${ruMonths[month - 1]}`;
    
    const opts = new Set([dateStr]);
    while (opts.size < 4) {
      const wm = Math.floor(Math.random() * 12) + 1;
      const wd = Math.floor(Math.random() * 28) + 1;
      const wStr = `${wd} ${ruMonths[wm - 1]}`;
      if (wStr !== dateStr) opts.add(wStr);
    }
    const arr = Array.from(opts);
    res.push({
      topic: "date",
      type: "choice",
      q: `Что означает ${cn}?`,
      answer: dateStr,
      options: arr.filter(o => o !== dateStr)
    });
  }
  return res;
}

// Добавляем сгенерированные задания в общий банк
TASKS.push(...genNumbers(), ...genTime(), ...genDates());
