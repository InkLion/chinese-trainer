/* =========================================================
   tasks.js — банк заданий по личным конспектам
   Включает статические вопросы и процедурные генераторы.
   ========================================================= */

export const TOPICS = {
  greetings:    'Приветствия и вежливость',
  acquaintance: 'Знакомство',
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

  /* ═════════════════ ПРИВЕТСТВИЯ ═════════════════ */
  { topic: "greetings", type: "choice", q: "Что означает 你好?", answer: "Привет", options: ["Спасибо", "До свидания", "Извините"] },
  { topic: "greetings", type: "choice", q: "Что означает 您好?", answer: "Здравствуйте (вежливо)", options: ["Привет", "До свидания", "Спокойной ночи"] },
  { topic: "greetings", type: "choice", q: "Что означает 再见?", answer: "До свидания", options: ["Привет", "Извините", "Спокойной ночи"] },
  { topic: "greetings", type: "choice", q: "Что означает 早上好?", answer: "Доброе утро", options: ["Добрый вечер", "Спокойной ночи", "До свидания"] },
  { topic: "greetings", type: "choice", q: "Что означает 晚上好?", answer: "Добрый вечер", options: ["Доброе утро", "Спокойной ночи", "Привет"] },
  { topic: "greetings", type: "choice", q: "Что означает 晚安?", answer: "Спокойной ночи", options: ["Доброе утро", "Добрый вечер", "До свидания"] },
  { topic: "greetings", type: "choice", q: "Что означает 大家好?", answer: "Всем привет", options: ["До свидания", "Спасибо", "Извините"] },
  { topic: "greetings", type: "choice", q: "Что означает 谢谢?", answer: "Спасибо", options: ["Пожалуйста", "Извините", "До свидания"] },
  { topic: "greetings", type: "choice", q: "Что означает 不用谢?", answer: "Пожалуйста / не за что", options: ["Спасибо", "Извините", "До свидания"] },
  { topic: "greetings", type: "choice", q: "Что означает 不好意思?", answer: "Извините", options: ["Спасибо", "Ничего страшного", "До свидания"] },
  { topic: "greetings", type: "choice", q: "Что означает 没事?", answer: "Ничего страшного", options: ["Извините", "Спасибо", "До свидания"] },
  { topic: "greetings", type: "choice", q: "Что означает 加油?", answer: "Давай / удачи", options: ["Извините", "Спасибо", "До свидания"] },
  { topic: "greetings", type: "choice", q: "Что ответить на 谢谢?", answer: "不用谢", options: ["你好", "再见", "早安"] },
  { topic: "greetings", type: "choice", q: "Как читается 你好?", answer: "nǐ hǎo", options: ["nǐ hào", "ní hǎo", "nī hǎo"] },
  { topic: "greetings", type: "choice", q: "Какой иероглиф значит «хороший»?", answer: "好", options: ["早", "晚", "见"] },
  { topic: "greetings", type: "fill", q: "Напишите иероглифами: «привет»", answers: ["你好"], placeholder: "иероглифы" },
  { topic: "greetings", type: "fill", q: "Напишите иероглифами: «здравствуйте» (вежливо)", answers: ["您好"], placeholder: "иероглифы" },
  { topic: "greetings", type: "fill", q: "Напишите иероглифами: «до свидания»", answers: ["再见"], placeholder: "иероглифы" },
  { topic: "greetings", type: "fill", q: "Напишите иероглифами: «спасибо»", answers: ["谢谢"], placeholder: "иероглифы" },
  { topic: "greetings", type: "fill", q: "Напишите иероглифами: «не за что»", answers: ["不用谢"], placeholder: "иероглифы" },
  { topic: "greetings", type: "fill", q: "Напишите пиньинь для 你好", answers: ["nihao"], placeholder: "пиньинь без тонов" },
  { topic: "greetings", type: "match", q: "Соедините приветствия и перевод",
    pairs: [["你好", "привет"], ["您好", "здравствуйте"], ["早上好", "доброе утро"], ["再见", "до свидания"]] },
  { topic: "greetings", type: "match", q: "Соедините вежливые фразы и перевод",
    pairs: [["谢谢", "спасибо"], ["不用谢", "пожалуйста"], ["不好意思", "извините"], ["没事", "ничего страшного"]] },

  /* ═════════════════ ЗНАКОМСТВО ═════════════════ */
  { topic: "acquaintance", type: "choice", q: "Что означает 你叫什么名字?", answer: "Как тебя зовут?", options: ["Сколько тебе лет?", "Откуда ты?", "Как дела?"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 我叫?", answer: "Меня зовут…", options: ["Я живу…", "Я люблю…", "Мне нравится…"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 高兴?", answer: "Радостный / приятный", options: ["Грустный", "Злой", "Усталый"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 很?", answer: "Очень", options: ["Немного", "Совсем", "Тоже"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 认识?", answer: "Познакомиться / знать", options: ["Забыть", "Видеть", "Слышать"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 很高兴认识你?", answer: "Приятно познакомиться", options: ["До свидания", "Спасибо", "Как тебя зовут?"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 生日?", answer: "День рождения", options: ["Праздник", "Новый год", "Выходной"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 朋友?", answer: "Друг", options: ["Брат", "Сосед", "Учитель"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 姓?", answer: "Фамилия", options: ["Имя", "Прозвище", "Возраст"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 你姓什么?", answer: "Какая у тебя фамилия?", options: ["Как тебя зовут?", "Сколько тебе лет?", "Где ты живёшь?"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 你几岁?", answer: "Сколько тебе лет?", options: ["Как тебя зовут?", "Который час?", "Сколько стоит?"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 你的生日是几月几号?", answer: "Когда твой день рождения?", options: ["Какой сегодня день?", "Сколько сейчас времени?", "Как тебя зовут?"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 大?", answer: "Большой", options: ["Маленький", "Высокий", "Новый"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 家?", answer: "Семья / дом", options: ["Школа", "Работа", "Улица"] },
  { topic: "acquaintance", type: "choice", q: "Что означает 我是?", answer: "Я являюсь… / я — это…", options: ["Я хочу…", "У меня есть…", "Мне нравится…"] },
  { topic: "acquaintance", type: "fill", q: "Напишите иероглифами: «друг»", answers: ["朋友"], placeholder: "иероглифы" },
  { topic: "acquaintance", type: "fill", q: "Напишите иероглифами: «день рождения»", answers: ["生日"], placeholder: "иероглифы" },
  { topic: "acquaintance", type: "fill", q: "Напишите иероглифами: «приятно познакомиться»", answers: ["很高兴认识你"], placeholder: "иероглифы" },
  { topic: "acquaintance", type: "fill", q: "Вставьте пропуск (глагол «звать»):<br>你<span class=\"blank\"></span>什么名字？", answers: ["叫"], placeholder: "один иероглиф" },
  { topic: "acquaintance", type: "fill", q: "Вставьте пропуск (фамилия):<br>你<span class=\"blank\"></span>什么？", answers: ["姓"], placeholder: "один иероглиф" },
  { topic: "acquaintance", type: "fill", q: "Напишите пиньинь для 朋友", answers: ["pengyou"], placeholder: "пиньинь без тонов" },
  { topic: "acquaintance", type: "fill", q: "Напишите пиньинь для 高兴", answers: ["gaoxing"], placeholder: "пиньинь без тонов" },
  { topic: "acquaintance", type: "order", q: "Соберите вопрос: «Как тебя зовут?»",
    words: ["名字", "你", "什么", "叫"], answer: ["你", "叫", "什么", "名字"] },
  { topic: "acquaintance", type: "order", q: "Соберите: «Приятно познакомиться»",
    words: ["认识", "很", "你", "高兴"], answer: ["很", "高兴", "认识", "你"] },
  { topic: "acquaintance", type: "order", q: "Соберите вопрос: «Какая у тебя фамилия?»",
    words: ["什么", "你", "姓"], answer: ["你", "姓", "什么"] },

  /* ═════════════════ МЕСТОИМЕНИЯ ═════════════════ */
  { topic: "pronouns", type: "choice", q: "Что означает 我?", answer: "Я", options: ["Ты", "Он", "Мы"] },
  { topic: "pronouns", type: "choice", q: "Что означает 你?", answer: "Ты", options: ["Я", "Он", "Она"] },
  { topic: "pronouns", type: "choice", q: "Что означает 您?", answer: "Вы (ед.ч., вежливо)", options: ["Ты", "Он", "Мы"] },
  { topic: "pronouns", type: "choice", q: "Что означает 他?", answer: "Он", options: ["Она", "Ты", "Я"] },
  { topic: "pronouns", type: "choice", q: "Что означает 她?", answer: "Она", options: ["Он", "Ты", "Мы"] },
  { topic: "pronouns", type: "choice", q: "Что означает 我们?", answer: "Мы", options: ["Вы", "Они", "Я"] },
  { topic: "pronouns", type: "choice", q: "Что означает 你们?", answer: "Вы (мн.ч.)", options: ["Мы", "Они", "Ты"] },
  { topic: "pronouns", type: "choice", q: "Что означает 他们?", answer: "Они (мужчины / смешанная группа)", options: ["Мы", "Вы", "Она"] },
  { topic: "pronouns", type: "choice", q: "Что означает 她们?", answer: "Они (только женщины)", options: ["Они (мужчины)", "Мы", "Вы"] },
  { topic: "pronouns", type: "choice", q: "Как образуется множественное число местоимений?", answer: "Добавляется 们", options: ["Добавляется 的", "Добавляется 是", "Меняется тон"] },
  { topic: "pronouns", type: "fill", q: "Напишите иероглифами: «я»", answers: ["我"], placeholder: "иероглифы" },
  { topic: "pronouns", type: "fill", q: "Напишите иероглифами: «ты»", answers: ["你"], placeholder: "иероглифы" },
  { topic: "pronouns", type: "fill", q: "Напишите иероглифами: «он»", answers: ["他"], placeholder: "иероглифы" },
  { topic: "pronouns", type: "fill", q: "Напишите иероглифами: «она»", answers: ["她"], placeholder: "иероглифы" },
  { topic: "pronouns", type: "fill", q: "Напишите иероглифами: «мы»", answers: ["我们"], placeholder: "иероглифы" },
  { topic: "pronouns", type: "fill", q: "Напишите пиньинь для 我", answers: ["wo"], placeholder: "пиньинь без тонов" },
  { topic: "pronouns", type: "fill", q: "Напишите пиньинь для 我们", answers: ["women"], placeholder: "пиньинь без тонов" },
  { topic: "pronouns", type: "match", q: "Соедините единственное число и перевод",
    pairs: [["我", "я"], ["你", "ты"], ["他", "он"], ["她", "она"]] },
  { topic: "pronouns", type: "match", q: "Соедините множественное число и перевод",
    pairs: [["我们", "мы"], ["你们", "вы"], ["他们", "они (м.)"], ["她们", "они (ж.)"]] },
  { topic: "pronouns", type: "order", q: "Соберите: «Я в школе»",
    words: ["学校", "我", "在"], answer: ["我", "在", "学校"] },
  { topic: "pronouns", type: "order", q: "Соберите: «Он мой старший брат»",
    words: ["哥哥", "他", "我", "是", "的"], answer: ["他", "是", "我", "的", "哥哥"] },
  { topic: "pronouns", type: "order", q: "Соберите: «Она моя младшая сестра»",
    words: ["妹妹", "她", "我", "是", "的"], answer: ["她", "是", "我", "的", "妹妹"] },

  /* ═════════════════ СЕМЬЯ ═════════════════ */
  { topic: "family", type: "choice", q: "Что означает 哥哥?", answer: "Старший брат", options: ["Младший брат", "Старшая сестра", "Младшая сестра"] },
  { topic: "family", type: "choice", q: "Что означает 弟弟?", answer: "Младший брат", options: ["Старший брат", "Старшая сестра", "Младшая сестра"] },
  { topic: "family", type: "choice", q: "Что означает 姐姐?", answer: "Старшая сестра", options: ["Младшая сестра", "Старший брат", "Младший брат"] },
  { topic: "family", type: "choice", q: "Что означает 妹妹?", answer: "Младшая сестра", options: ["Старшая сестра", "Старший брат", "Младший брат"] },
  { topic: "family", type: "choice", q: "Что означает 宝贝?", answer: "Ребёнок / малыш", options: ["Взрослый", "Бабушка", "Дядя"] },
  { topic: "family", type: "choice", q: "Что означает 他是我的哥哥?", answer: "Он мой старший брат", options: ["Он мой младший брат", "Он мой друг", "Это мой отец"] },
  { topic: "family", type: "choice", q: "Что означает 她是我的妹妹?", answer: "Она моя младшая сестра", options: ["Она моя старшая сестра", "Она моя подруга", "Это моя мама"] },
  { topic: "family", type: "choice", q: "Как сказать «старшая сестра»?", answer: "姐姐", options: ["妹妹", "哥哥", "弟弟"] },
  { topic: "family", type: "fill", q: "Напишите иероглифами: «старший брат»", answers: ["哥哥"], placeholder: "иероглифы" },
  { topic: "family", type: "fill", q: "Напишите иероглифами: «младший брат»", answers: ["弟弟"], placeholder: "иероглифы" },
  { topic: "family", type: "fill", q: "Напишите иероглифами: «старшая сестра»", answers: ["姐姐"], placeholder: "иероглифы" },
  { topic: "family", type: "fill", q: "Напишите иероглифами: «младшая сестра»", answers: ["妹妹"], placeholder: "иероглифы" },
  { topic: "family", type: "fill", q: "Напишите пиньинь для 哥哥", answers: ["gege"], placeholder: "пиньинь без тонов" },
  { topic: "family", type: "fill", q: "Напишите пиньинь для 妹妹", answers: ["meimei"], placeholder: "пиньинь без тонов" },
  { topic: "family", type: "match", q: "Соедините членов семьи и перевод",
    pairs: [["哥哥", "старший брат"], ["弟弟", "младший брат"], ["姐姐", "старшая сестра"], ["妹妹", "младшая сестра"]] },
  { topic: "family", type: "order", q: "Соберите: «Он мой старший брат»",
    words: ["哥哥", "他", "我", "是", "的"], answer: ["他", "是", "我", "的", "哥哥"] },
  { topic: "family", type: "order", q: "Соберите: «Она моя старшая сестра»",
    words: ["姐姐", "她", "我", "是", "的"], answer: ["她", "是", "我", "的", "姐姐"] },
  { topic: "family", type: "order", q: "Соберите: «Он мой младший брат»",
    words: ["弟弟", "他", "我", "是", "的"], answer: ["他", "是", "我", "的", "弟弟"] },
  { topic: "family", type: "order", q: "Соберите: «Она моя младшая сестра»",
    words: ["妹妹", "她", "我", "是", "的"], answer: ["她", "是", "我", "的", "妹妹"] },

  /* ═════════════════ ВРЕМЯ (статика) ═════════════════ */
  { topic: "time", type: "choice", q: "Что означает 时间?", answer: "Время", options: ["Час", "Минута", "День"] },
  { topic: "time", type: "choice", q: "Что означает 点?", answer: "Час (при указании времени)", options: ["Минута", "Секунда", "День"] },
  { topic: "time", type: "choice", q: "Что означает 分?", answer: "Минута", options: ["Час", "Половина", "Секунда"] },
  { topic: "time", type: "choice", q: "Что означает 半?", answer: "Половина", options: ["Четверть", "Целый", "Минута"] },
  { topic: "time", type: "choice", q: "Что означает 刻?", answer: "Четверть (часа)", options: ["Половина", "Минута", "Час"] },
  { topic: "time", type: "choice", q: "Что означает 差?", answer: "Без (при указании времени)", options: ["И", "Или", "Половина"] },
  { topic: "time", type: "choice", q: "Что означает 现在?", answer: "Сейчас", options: ["Потом", "Вчера", "Завтра"] },
  
  // Исправлены варианты, чтобы они не выделялись длиной
  { topic: "time", type: "choice", q: "Что означает 早上?", answer: "Утро (5:00–9:00)", options: ["Вечер (18:00–0:00)", "Ночь (0:00–5:00)", "Полдень (12:00–14:00)"] },
  { topic: "time", type: "choice", q: "Что означает 上午?", answer: "До обеда (9:00–12:00)", options: ["После обеда (14:00–18:00)", "Вечер (18:00–0:00)", "Ночь (0:00–5:00)"] },
  { topic: "time", type: "choice", q: "Что означает 中午?", answer: "Полдень (12:00–14:00)", options: ["Утро (5:00–9:00)", "Вечер (18:00–0:00)", "Ночь (0:00–5:00)"] },
  { topic: "time", type: "choice", q: "Что означает 下午?", answer: "После обеда (14:00–18:00)", options: ["До обеда (9:00–12:00)", "Вечер (18:00–0:00)", "Ночь (0:00–5:00)"] },
  { topic: "time", type: "choice", q: "Что означает 晚上?", answer: "Вечер (18:00–0:00)", options: ["Утро (5:00–9:00)", "Ночь (0:00–5:00)", "Полдень (12:00–14:00)"] },
  { topic: "time", type: "choice", q: "Что означает 夜里?", answer: "Ночь (0:00–5:00)", options: ["Утро (5:00–9:00)", "Вечер (18:00–0:00)", "Полдень (12:00–14:00)"] },
  
  { topic: "time", type: "choice", q: "Что означает 现在几点?", answer: "Сколько сейчас времени?", options: ["Какой сегодня день?", "Какое сегодня число?", "Сколько тебе лет?"] },
  { topic: "time", type: "choice", q: "«Два часа» по-китайски:", answer: "两点", options: ["二点", "两时", "二时"] },
  { topic: "time", type: "fill", q: "Напишите иероглифами: «час» (при указании времени)", answers: ["点"], placeholder: "иероглиф" },
  { topic: "time", type: "fill", q: "Напишите иероглифами: «минута»", answers: ["分"], placeholder: "иероглиф" },
  { topic: "time", type: "fill", q: "Напишите иероглифами: «половина»", answers: ["半"], placeholder: "иероглиф" },
  { topic: "time", type: "fill", q: "Напишите иероглифами: «сейчас»", answers: ["现在"], placeholder: "иероглифы" },
  { topic: "time", type: "fill", q: "Напишите пиньинь для 时间", answers: ["shijian"], placeholder: "пиньинь без тонов" },
  { topic: "time", type: "fill", q: "Напишите пиньинь для 现在", answers: ["xianzai"], placeholder: "пиньинь без тонов" },
  { topic: "time", type: "fill", q: "Напишите пиньинь для 几点", answers: ["jidian"], placeholder: "пиньинь без тонов" },
  { topic: "time", type: "match", q: "Соедините части суток и перевод",
    pairs: [["早上", "утро"], ["中午", "полдень"], ["下午", "после обеда"], ["晚上", "вечер"]] },
  { topic: "time", type: "match", q: "Соедините единицы времени и перевод",
    pairs: [["点", "час"], ["分", "минута"], ["半", "половина"], ["刻", "четверть"]] },
  { topic: "time", type: "order", q: "Соберите вопрос: «Сколько сейчас времени?»",
    words: ["点", "现在", "几"], answer: ["现在", "几", "点"] },

  /* ═════════════════ ДАТА (статика) ═════════════════ */
  { topic: "date", type: "choice", q: "Что означает 日期?", answer: "Дата", options: ["Год", "Месяц", "День"] },
  { topic: "date", type: "choice", q: "Что означает 年?", answer: "Год", options: ["Месяц", "День", "Неделя"] },
  { topic: "date", type: "choice", q: "Что означает 月?", answer: "Месяц / луна", options: ["Год", "День", "Неделя"] },
  { topic: "date", type: "choice", q: "Что означает 日?", answer: "День / солнце", options: ["Месяц", "Год", "Ночь"] },
  { topic: "date", type: "choice", q: "Что означает 号?", answer: "Число (месяца)", options: ["Год", "Месяц", "День недели"] },
  { topic: "date", type: "choice", q: "Что означает 天?", answer: "День", options: ["Год", "Месяц", "Час"] },
  { topic: "date", type: "choice", q: "Что означает 今天?", answer: "Сегодня", options: ["Вчера", "Завтра", "Сейчас"] },
  { topic: "date", type: "choice", q: "Что означает 昨天?", answer: "Вчера", options: ["Сегодня", "Завтра", "Потом"] },
  { topic: "date", type: "choice", q: "Что означает 明天?", answer: "Завтра", options: ["Сегодня", "Вчера", "Сейчас"] },
  { topic: "date", type: "choice", q: "Что означает 星期?", answer: "Неделя", options: ["Месяц", "Год", "День"] },
  { topic: "date", type: "choice", q: "Что означает 星期一?", answer: "Понедельник", options: ["Вторник", "Суббота", "Воскресенье"] },
  { topic: "date", type: "choice", q: "Что означает 星期三?", answer: "Среда", options: ["Вторник", "Четверг", "Пятница"] },
  { topic: "date", type: "choice", q: "Что означает 星期六?", answer: "Суббота", options: ["Понедельник", "Воскресенье", "Пятница"] },
  { topic: "date", type: "choice", q: "Что означает 星期天?", answer: "Воскресенье", options: ["Суббота", "Понедельник", "Вторник"] },
  { topic: "date", type: "choice", q: "Что означает 一月?", answer: "Январь", options: ["Февраль", "Декабрь", "Март"] },
  { topic: "date", type: "choice", q: "Что означает 十二月?", answer: "Декабрь", options: ["Январь", "Ноябрь", "Октябрь"] },
  { topic: "date", type: "choice", q: "Что означает 今天几月几号?", answer: "Какое сегодня число?", options: ["Сколько сейчас времени?", "Какой сегодня день недели?", "Когда твой день рождения?"] },
  { topic: "date", type: "choice", q: "Что означает 你喜欢星期几?", answer: "Какой день недели тебе нравится?", options: ["Какой сегодня день?", "Сколько сейчас времени?", "Когда твой день рождения?"] },
  { topic: "date", type: "choice", q: "Что означает 我喜欢星期六?", answer: "Мне нравится суббота", options: ["Мне нравится воскресенье", "Я не люблю субботу", "Сегодня суббота"] },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «сегодня»", answers: ["今天"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «завтра»", answers: ["明天"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «вчера»", answers: ["昨天"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «неделя»", answers: ["星期"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «январь»", answers: ["一月"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите иероглифами: «декабрь»", answers: ["十二月"], placeholder: "иероглифы" },
  { topic: "date", type: "fill", q: "Напишите пиньинь для 今天", answers: ["jintian"], placeholder: "пиньинь без тонов" },
  { topic: "date", type: "fill", q: "Напишите пиньинь для 明天", answers: ["mingtian"], placeholder: "пиньинь без тонов" },
  { topic: "date", type: "fill", q: "Напишите пиньинь для 昨天", answers: ["zuotian"], placeholder: "пиньинь без тонов" },
  { topic: "date", type: "fill", q: "Напишите пиньинь для 星期", answers: ["xingqi"], placeholder: "пиньинь без тонов" },
  { topic: "date", type: "match", q: "Соедините дни и перевод",
    pairs: [["星期一", "понедельник"], ["星期三", "среда"], ["星期六", "суббота"], ["星期天", "воскресенье"]] },
  { topic: "date", type: "match", q: "Соедините месяцы и перевод",
    pairs: [["一月", "январь"], ["六月", "июнь"], ["十月", "октябрь"], ["十二月", "декабрь"]] },
  { topic: "date", type: "match", q: "Соедините «когда» и перевод",
    pairs: [["今天", "сегодня"], ["明天", "завтра"], ["昨天", "вчера"], ["现在", "сейчас"]] },
  { topic: "date", type: "order", q: "Соберите вопрос: «Какое сегодня число?»",
    words: ["几号", "今天", "几月"], answer: ["今天", "几月", "几号"] },

  /* ═════════════════ ОБЫЧНАЯ ЖИЗНЬ ═════════════════ */
  { topic: "daily", type: "choice", q: "Что означает 起床?", answer: "Вставать (с кровати)", options: ["Ложиться спать", "Завтракать", "Ужинать"] },
  { topic: "daily", type: "choice", q: "Что означает 睡觉?", answer: "Ложиться спать", options: ["Вставать", "Есть", "Работать"] },
  { topic: "daily", type: "choice", q: "Что означает 吃?", answer: "Есть (кушать)", options: ["Пить", "Спать", "Идти"] },
  { topic: "daily", type: "choice", q: "Что означает 饭?", answer: "Еда / рис", options: ["Вода", "Чай", "Хлеб"] },
  { topic: "daily", type: "choice", q: "Что означает 吃早饭?", answer: "Завтракать", options: ["Обедать", "Ужинать", "Готовить"] },
  { topic: "daily", type: "choice", q: "Что означает 吃午饭?", answer: "Обедать", options: ["Завтракать", "Ужинать", "Готовить"] },
  { topic: "daily", type: "choice", q: "Что означает 吃晚饭?", answer: "Ужинать", options: ["Завтракать", "Обедать", "Готовить"] },
  { topic: "daily", type: "choice", q: "Что означает 做饭?", answer: "Готовить еду", options: ["Есть", "Мыть посуду", "Покупать еду"] },
  { topic: "daily", type: "choice", q: "Что означает 做作业?", answer: "Делать задание", options: ["Готовить", "Читать", "Писать"] },
  { topic: "daily", type: "choice", q: "Что означает 看电视?", answer: "Смотреть телевизор", options: ["Слушать музыку", "Играть", "Читать"] },
  { topic: "daily", type: "choice", q: "Что означает 上学?", answer: "Идти в школу", options: ["Идти на работу", "Идти домой", "Идти спать"] },
  { topic: "daily", type: "choice", q: "Что означает 上班?", answer: "Идти на работу", options: ["Идти в школу", "Идти домой", "Отдыхать"] },
  { topic: "daily", type: "choice", q: "Что означает 回家?", answer: "Возвращаться домой", options: ["Идти в школу", "Идти на работу", "Уезжать"] },
  { topic: "daily", type: "choice", q: "Что означает 工作?", answer: "Работать / работа", options: ["Учиться", "Отдыхать", "Спать"] },
  { topic: "daily", type: "choice", q: "Что означает 学习?", answer: "Учиться / изучать", options: ["Работать", "Отдыхать", "Играть"] },
  { topic: "daily", type: "choice", q: "Что означает 学校?", answer: "Школа", options: ["Работа", "Дом", "Магазин"] },
  { topic: "daily", type: "choice", q: "Что означает 汉语?", answer: "Китайский язык", options: ["Английский язык", "Русский язык", "Японский язык"] },
  { topic: "daily", type: "choice", q: "Что означает 中文?", answer: "Китайский язык (письменный)", options: ["Английский язык", "Русский язык", "Японский язык"] },
  { topic: "daily", type: "choice", q: "Что означает 汉语学校?", answer: "Школа китайского языка", options: ["Китайская школа", "Школа в Китае", "Китайский язык"] },
  { topic: "daily", type: "choice", q: "Что означает 去?", answer: "Идти / ехать", options: ["Приходить", "Возвращаться", "Стоять"] },
  { topic: "daily", type: "choice", q: "Что означает 在?", answer: "В / на (где)", options: ["Из", "К", "С"] },
  { topic: "daily", type: "choice", q: "Что означает 有?", answer: "Иметь", options: ["Быть", "Хотеть", "Мочь"] },
  { topic: "daily", type: "choice", q: "Что означает 和?", answer: "И", options: ["Или", "Но", "С"] },
  { topic: "daily", type: "choice", q: "Что означает 这?", answer: "Этот / это", options: ["Тот", "Какой", "Мой"] },
  { topic: "daily", type: "choice", q: "Что означает 或?", answer: "Или", options: ["И", "Но", "Тоже"] },
  { topic: "daily", type: "choice", q: "Что означает 还是?", answer: "Или (в вопросе)", options: ["И", "Но", "Тоже"] },
  { topic: "daily", type: "choice", q: "Что означает 做?", answer: "Делать", options: ["Говорить", "Идти", "Смотреть"] },
  { topic: "daily", type: "choice", q: "Что означает 猫?", answer: "Кот", options: ["Собака", "Цветок", "Птица"] },
  { topic: "daily", type: "choice", q: "Что означает 狗?", answer: "Собака", options: ["Кот", "Лошадь", "Рыба"] },
  { topic: "daily", type: "choice", q: "Что означает 花?", answer: "Цветок", options: ["Дерево", "Трава", "Лист"] },
  { topic: "daily", type: "choice", q: "Что означает 杯子?", answer: "Кружка / стакан", options: ["Тарелка", "Ложка", "Пиала"] },
  { topic: "daily", type: "choice", q: "Что означает 本子?", answer: "Тетрадь", options: ["Книга", "Ручка", "Альбом"] },
  { topic: "daily", type: "choice", q: "Что означает 你在做什么?", answer: "Что ты сейчас делаешь?", options: ["Куда ты идёшь?", "Как тебя зовут?", "Сколько тебе лет?"] },
  { topic: "daily", type: "choice", q: "Что означает 我在学习中文?", answer: "Я сейчас учу китайский", options: ["Я люблю китайский", "Я знаю китайский", "Я хочу учить китайский"] },
  { topic: "daily", type: "choice", q: "Что означает 我五点起床?", answer: "Я встаю в 5 часов", options: ["Я ложусь в 5", "Я обедаю в 5", "Я встаю в 15:00"] },
  { topic: "daily", type: "image", emoji: "🐱", q: "Что это по-китайски?", answer: "猫", options: ["狗", "花", "杯子"] },
  { topic: "daily", type: "image", emoji: "🐶", q: "Что это по-китайски?", answer: "狗", options: ["猫", "花", "本子"] },
  { topic: "daily", type: "image", emoji: "🌸", q: "Что это по-китайски?", answer: "花", options: ["猫", "狗", "杯子"] },
  { topic: "daily", type: "image", emoji: "☕", q: "Что это по-китайски?", answer: "杯子", options: ["本子", "花", "猫"] },
  { topic: "daily", type: "image", emoji: "📓", q: "Что это по-китайски?", answer: "本子", options: ["杯子", "花", "狗"] },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «школа»", answers: ["学校"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «учиться»", answers: ["学习"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «идти»", answers: ["去"], placeholder: "иероглиф" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «есть (кушать)»", answers: ["吃"], placeholder: "иероглиф" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «работать»", answers: ["工作"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «спать»", answers: ["睡觉"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «вставать»", answers: ["起床"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «кот»", answers: ["猫"], placeholder: "иероглиф" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «собака»", answers: ["狗"], placeholder: "иероглиф" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «цветок»", answers: ["花"], placeholder: "иероглиф" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «кружка»", answers: ["杯子"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «тетрадь»", answers: ["本子"], placeholder: "иероглифы" },
  { topic: "daily", type: "fill", q: "Напишите иероглифами: «еда / рис»", answers: ["饭"], placeholder: "иероглиф" },
  { topic: "daily", type: "fill", q: "Напишите пиньинь для 学校", answers: ["xuexiao"], placeholder: "пиньинь без тонов" },
  { topic: "daily", type: "fill", q: "Напишите пиньинь для 学习", answers: ["xuexi"], placeholder: "пиньинь без тонов" },
  { topic: "daily", type: "fill", q: "Напишите пиньинь для 汉语", answers: ["hanyu"], placeholder: "пиньинь без тонов" },
  { topic: "daily", type: "fill", q: "Напишите пиньинь для 中文", answers: ["zhongwen"], placeholder: "пиньинь без тонов" },
  { topic: "daily", type: "fill", q: "Напишите пиньинь для 起床", answers: ["qichuang"], placeholder: "пиньинь без тонов" },
  { topic: "daily", type: "fill", q: "Напишите пиньинь для 睡觉", answers: ["shuijiao"], placeholder: "пиньинь без тонов" },
  { topic: "daily", type: "fill", q: "Вставьте пропуск:<br>我<span class=\"blank\"></span>学校。", answers: ["在"], placeholder: "один иероглиф" },
  { topic: "daily", type: "fill", q: "Вставьте пропуск:<br>我<span class=\"blank\"></span>学习中文。", answers: ["在"], placeholder: "один иероглиф" },
  { topic: "daily", type: "fill", q: "Вставьте пропуск:<br>你<span class=\"blank\"></span>做什么？", answers: ["在"], placeholder: "один иероглиф" },
  { topic: "daily", type: "match", q: "Соедините действия и перевод",
    pairs: [["起床", "вставать"], ["吃饭", "есть"], ["睡觉", "спать"], ["工作", "работать"]] },
  { topic: "daily", type: "match", q: "Соедините предметы и перевод",
    pairs: [["猫", "кот"], ["狗", "собака"], ["花", "цветок"], ["杯子", "кружка"]] },
  { topic: "daily", type: "match", q: "Соедините приёмы пищи и перевод",
    pairs: [["吃早饭", "завтракать"], ["吃午饭", "обедать"], ["吃晚饭", "ужинать"], ["做饭", "готовить"]] },
  { topic: "daily", type: "order", q: "Соберите: «Я в школе»",
    words: ["学校", "我", "在"], answer: ["我", "在", "学校"] },
  { topic: "daily", type: "order", q: "Соберите: «Я сейчас учу китайский»",
    words: ["中文", "我", "学习", "在"], answer: ["我", "在", "学习", "中文"] },
  { topic: "daily", type: "order", q: "Соберите вопрос: «Что ты сейчас делаешь?»",
    words: ["什么", "你", "做", "在"], answer: ["你", "在", "做", "什么"] },
  { topic: "daily", type: "order", q: "Соберите вопрос: «Во сколько ты встаёшь?»",
    words: ["起床", "你", "几", "点"], answer: ["你", "几", "点", "起床"] },
  { topic: "daily", type: "order", q: "Соберите вопрос: «Во сколько ты завтракаешь?»",
    words: ["早饭", "你", "几", "点", "吃"], answer: ["你", "几", "点", "吃", "早饭"] },
  { topic: "daily", type: "order", q: "Соберите вопрос: «Во сколько ты идёшь домой?»",
    words: ["回家", "你", "几", "点"], answer: ["你", "几", "点", "回家"] },

  /* ═════════════════ ЦВЕТА ═════════════════ */
  { topic: "colors", type: "choice", q: "Что означает 色?", answer: "Цвет", options: ["Свет", "Тень", "Краска"] },
  { topic: "colors", type: "choice", q: "Что означает 白色?", answer: "Белый", options: ["Чёрный", "Серый", "Красный"] },
  { topic: "colors", type: "choice", q: "Что означает 黑色?", answer: "Чёрный", options: ["Белый", "Серый", "Красный"] },
  { topic: "colors", type: "choice", q: "Что означает 红色?", answer: "Красный", options: ["Синий", "Зелёный", "Белый"] },
  { topic: "colors", type: "choice", q: "Что означает 粉红色?", answer: "Розовый", options: ["Красный", "Белый", "Серый"] },
  { topic: "colors", type: "choice", q: "Что означает 灰色?", answer: "Серый", options: ["Белый", "Чёрный", "Красный"] },
  { topic: "colors", type: "choice", q: "Что означает 米色?", answer: "Бежевый", options: ["Белый", "Серый", "Розовый"] },
  { topic: "colors", type: "choice", q: "Какой иероглиф входит в 红色?", answer: "红 (красный)", options: ["白 (белый)", "黑 (чёрный)", "色 (цвет)"] },
  { topic: "colors", type: "choice", q: "Какой иероглиф значит «цвет»?", answer: "色", options: ["红", "白", "黑"] },
  { topic: "colors", type: "fill", q: "Напишите иероглифами: «цвет»", answers: ["色"], placeholder: "иероглиф" },
  { topic: "colors", type: "fill", q: "Напишите иероглифами: «красный»", answers: ["红色"], placeholder: "иероглифы" },
  { topic: "colors", type: "fill", q: "Напишите иероглифами: «белый»", answers: ["白色"], placeholder: "иероглифы" },
  { topic: "colors", type: "fill", q: "Напишите иероглифами: «чёрный»", answers: ["黑色"], placeholder: "иероглифы" },
  { topic: "colors", type: "fill", q: "Напишите иероглифами: «розовый»", answers: ["粉红色"], placeholder: "иероглифы" },
  { topic: "colors", type: "fill", q: "Напишите пиньинь для 红色", answers: ["hongse"], placeholder: "пиньинь без тонов" },
  { topic: "colors", type: "fill", q: "Напишите пиньинь для 白色", answers: ["baise"], placeholder: "пиньинь без тонов" },
  { topic: "colors", type: "fill", q: "Напишите пиньинь для 黑色", answers: ["heise"], placeholder: "пиньинь без тонов" },
  { topic: "colors", type: "match", q: "Соедините цвета и перевод",
    pairs: [["白色", "белый"], ["黑色", "чёрный"], ["红色", "красный"], ["粉红色", "розовый"]] },

  /* ═════════════════ ПИНЬИНЬ И ТОНЫ ═════════════════ */
  { topic: "pinyin", type: "choice", q: "Как читается 时间?", answer: "shí jiān", options: ["shí diǎn", "shí qī", "shí jiàn"] },
  { topic: "pinyin", type: "choice", q: "Как читается 现在?", answer: "xiàn zài", options: ["xiān zài", "xiàn cài", "xiǎn zài"] },
  { topic: "pinyin", type: "choice", q: "Как читается 今天?", answer: "jīn tiān", options: ["jīng tiān", "jīn diān", "qīn tiān"] },
  { topic: "pinyin", type: "choice", q: "Как читается 明天?", answer: "míng tiān", options: ["mín tiān", "mīng tiān", "míng diān"] },
  { topic: "pinyin", type: "choice", q: "Как читается 昨天?", answer: "zuó tiān", options: ["zúo tiān", "zuò tiān", "zhuó tiān"] },
  { topic: "pinyin", type: "choice", q: "Как читается 星期?", answer: "xīng qī", options: ["xīn qī", "xīng qí", "xīng jī"] },
  { topic: "pinyin", type: "choice", q: "Как читается 朋友?", answer: "péng yǒu", options: ["péng yòu", "pén yǒu", "féng yǒu"] },
  { topic: "pinyin", type: "choice", q: "Как читается 学校?", answer: "xué xiào", options: ["xué xiǎo", "xüé xiào", "xuē xiào"] },
  { topic: "pinyin", type: "choice", q: "Как читается 学习?", answer: "xué xí", options: ["xué xì", "xüé xí", "xuē xí"] },
  { topic: "pinyin", type: "choice", q: "Как читается 汉语?", answer: "hàn yǔ", options: ["hán yǔ", "hàn yù", "hǎn yǔ"] },
  { topic: "pinyin", type: "choice", q: "Как читается 中文?", answer: "zhōng wén", options: ["zōng wén", "zhōng wěn", "chōng wén"] },
  { topic: "pinyin", type: "choice", q: "Как читается 哥哥?", answer: "gē ge", options: ["gé ge", "gě ge", "kē ke"] },
  { topic: "pinyin", type: "choice", q: "Как читается 姐姐?", answer: "jiě jie", options: ["jié jie", "jiè jie", "xiě xie"] },
  { topic: "pinyin", type: "choice", q: "Как читается 妹妹?", answer: "mèi mei", options: ["méi mei", "měi mei", "mēn men"] },
  { topic: "pinyin", type: "choice", q: "Как читается 睡觉?", answer: "shuì jiào", options: ["shuì jiǎo", "shuǐ jiào", "suì jiào"] },
  { topic: "pinyin", type: "choice", q: "Как читается 起床?", answer: "qǐ chuáng", options: ["qǐ shuáng", "qí chuáng", "qì chuáng"] },
  { topic: "pinyin", type: "choice", q: "Как читается 吃饭?", answer: "chī fàn", options: ["chǐ fàn", "chī fǎn", "cī fàn"] },
  { topic: "pinyin", type: "choice", q: "Как читается 你好?", answer: "nǐ hǎo", options: ["nǐ hào", "ní hǎo", "nī hǎo"] },
  { topic: "pinyin", type: "choice", q: "Какой тон у слога mā?", answer: "1-й (ровный)", options: ["2-й (восходящий)", "3-й (нисходяще-восходящий)", "4-й (нисходящий)"] },
  { topic: "pinyin", type: "choice", q: "Какой тон у слога má?", answer: "2-й (восходящий)", options: ["1-й (ровный)", "3-й (нисходяще-восходящий)", "4-й (нисходящий)"] },
  { topic: "pinyin", type: "choice", q: "Какой тон у слога mǎ?", answer: "3-й (нисходяще-восходящий)", options: ["1-й (ровный)", "2-й (восходящий)", "4-й (нисходящий)"] },
  { topic: "pinyin", type: "choice", q: "Какой тон у слога mà?", answer: "4-й (нисходящий)", options: ["1-й (ровный)", "2-й (восходящий)", "3-й (нисходяще-восходящий)"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль sh?", answer: "ш", options: ["с", "ч", "ж"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль zh?", answer: "дж", options: ["ж", "ч", "ш"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль x?", answer: "си", options: ["тси", "ши", "ди"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль q?", answer: "тси / чи", options: ["си", "ди", "тши"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль j?", answer: "ди / ти / дзи", options: ["си", "тси", "ши"] },
  { topic: "pinyin", type: "choice", q: "Какой русский звук передаёт инициаль r?", answer: "ж", options: ["р", "ш", "дж"] },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 你好", answers: ["nihao"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 谢谢", answers: ["xiexie"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 我", answers: ["wo"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 我们", answers: ["women"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 五", answers: ["wu"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 三", answers: ["san"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 八", answers: ["ba"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 二十", answers: ["ershi"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 一百", answers: ["yibai"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 朋友", answers: ["pengyou"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 时间", answers: ["shijian"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 现在", answers: ["xianzai"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 今天", answers: ["jintian"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 学校", answers: ["xuexiao"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "fill", q: "Напишите пиньинь для 汉语", answers: ["hanyu"], placeholder: "пиньинь без тонов" },
  { topic: "pinyin", type: "match", q: "Соедините инициали и русские звуки (1)",
    pairs: [["zh", "дж"], ["ch", "чъ / тш"], ["sh", "ш"], ["r", "ж"]] },
  { topic: "pinyin", type: "match", q: "Соедините инициали и русские звуки (2)",
    pairs: [["j", "ди / ти"], ["q", "тси / чи"], ["x", "си"], ["s", "с"]] }
];

/* =========================================================
   ГЕНЕРАТОРЫ ДИНАМИЧЕСКИХ ЗАДАНИЙ
   ========================================================= */

const ruMonths = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const cnDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function numToChinese(num) {
  if (num < 10) return cnDigits[num];
  if (num === 10) return '十';
  if (num < 20) return '十' + cnDigits[num % 10];
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  return cnDigits[tens] + '十' + (ones === 0 ? '' : cnDigits[ones]);
}

function genNumbers() {
  const res = [];
  for (let i = 0; i < 40; i++) {
    const num = Math.floor(Math.random() * 99) + 1;
    const cn = numToChinese(num);
    const opts = new Set([num]);
    while (opts.size < 4) {
      const off = Math.floor(Math.random() * 20) - 10;
      const w = num + off;
      if (w > 0 && w <= 100 && w !== num) opts.add(w);
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
  for (let i = 0; i < 40; i++) {
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
  for (let i = 0; i < 40; i++) {
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