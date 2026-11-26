// js/data/words.js

export const CATEGORIES = {
  greetings: 'Приветствия',
  pronouns: 'Местоимения',
  family: 'Семья',
  time: 'Время',
  date: 'Дата',
  daily: 'Обычная жизнь',
  colors: 'Цвета'
};

export const WORDS = [
  // Приветствия
  { hanzi: "你好", pinyin: "nǐ hǎo", translation: "Привет", category: "greetings" },
  { hanzi: "您好", pinyin: "nín hǎo", translation: "Здравствуйте", category: "greetings" },
  { hanzi: "大家好", pinyin: "dà jiā hǎo", translation: "Всем привет", category: "greetings" },
  { hanzi: "早上好", pinyin: "zǎo shang hǎo", translation: "Доброе утро", category: "greetings" },
  { hanzi: "晚上好", pinyin: "wǎn shang hǎo", translation: "Добрый вечер", category: "greetings" },
  { hanzi: "再见", pinyin: "zài jiàn", translation: "До свидания", category: "greetings" },
  { hanzi: "谢谢", pinyin: "xiè xie", translation: "Спасибо", category: "greetings" },
  { hanzi: "不用谢", pinyin: "bù yòng xiè", translation: "Пожалуйста", category: "greetings" },
  { hanzi: "朋友", pinyin: "péng you", translation: "Друг", category: "greetings" },
  { hanzi: "很高兴认识你", pinyin: "hěn gāo xìng rèn shi nǐ", translation: "Приятно познакомиться", category: "greetings" },

  // Местоимения
  { hanzi: "我", pinyin: "wǒ", translation: "Я", category: "pronouns" },
  { hanzi: "你", pinyin: "nǐ", translation: "Ты", category: "pronouns" },
  { hanzi: "您", pinyin: "nín", translation: "Вы (вежл.)", category: "pronouns" },
  { hanzi: "他", pinyin: "tā", translation: "Он", category: "pronouns" },
  { hanzi: "她", pinyin: "tā", translation: "Она", category: "pronouns" },
  { hanzi: "我们", pinyin: "wǒ men", translation: "Мы", category: "pronouns" },
  { hanzi: "你们", pinyin: "nǐ men", translation: "Вы", category: "pronouns" },
  { hanzi: "他们", pinyin: "tā men", translation: "Они (м.)", category: "pronouns" },
  { hanzi: "她们", pinyin: "tā men", translation: "Они (ж.)", category: "pronouns" },

  // Семья
  { hanzi: "哥哥", pinyin: "gē ge", translation: "Старший брат", category: "family" },
  { hanzi: "弟弟", pinyin: "dì di", translation: "Младший брат", category: "family" },
  { hanzi: "姐姐", pinyin: "jiě jie", translation: "Старшая сестра", category: "family" },
  { hanzi: "妹妹", pinyin: "mèi mei", translation: "Младшая сестра", category: "family" },
  { hanzi: "宝贝", pinyin: "bǎo bèi", translation: "Ребёнок", category: "family" },

  // Время
  { hanzi: "时间", pinyin: "shí jiān", translation: "Время", category: "time" },
  { hanzi: "点", pinyin: "diǎn", translation: "Час", category: "time" },
  { hanzi: "分", pinyin: "fēn", translation: "Минута", category: "time" },
  { hanzi: "半", pinyin: "bàn", translation: "Половина", category: "time" },
  { hanzi: "刻", pinyin: "kè", translation: "Четверть", category: "time" },
  { hanzi: "现在", pinyin: "xiàn zài", translation: "Сейчас", category: "time" },
  { hanzi: "早上", pinyin: "zǎo shang", translation: "Утро", category: "time" },
  { hanzi: "中午", pinyin: "zhōng wǔ", translation: "Обед", category: "time" },
  { hanzi: "下午", pinyin: "xià wǔ", translation: "Днем", category: "time" },
  { hanzi: "晚上", pinyin: "wǎn shang", translation: "Вечер", category: "time" },

  // Дата
  { hanzi: "日期", pinyin: "rì qī", translation: "Дата", category: "date" },
  { hanzi: "年", pinyin: "nián", translation: "Год", category: "date" },
  { hanzi: "月", pinyin: "yuè", translation: "Месяц", category: "date" },
  { hanzi: "日", pinyin: "rì", translation: "День (солнце)", category: "date" },
  { hanzi: "号", pinyin: "hào", translation: "Число", category: "date" },
  { hanzi: "今天", pinyin: "jīn tiān", translation: "Сегодня", category: "date" },
  { hanzi: "昨天", pinyin: "zuó tiān", translation: "Вчера", category: "date" },
  { hanzi: "明天", pinyin: "míng tiān", translation: "Завтра", category: "date" },
  { hanzi: "星期", pinyin: "xīng qī", translation: "Неделя", category: "date" },

  // Обычная жизнь
  { hanzi: "起床", pinyin: "qǐ chuáng", translation: "Вставать", category: "daily" },
  { hanzi: "睡觉", pinyin: "shuì jiào", translation: "Спать", category: "daily" },
  { hanzi: "吃", pinyin: "chī", translation: "Есть", category: "daily" },
  { hanzi: "饭", pinyin: "fàn", translation: "Еда", category: "daily" },
  { hanzi: "吃早饭", pinyin: "chī zǎo fàn", translation: "Завтракать", category: "daily" },
  { hanzi: "做作业", pinyin: "zuò zuò yè", translation: "Делать задание", category: "daily" },
  { hanzi: "看电视", pinyin: "kàn diàn shì", translation: "Смотреть ТВ", category: "daily" },
  { hanzi: "学校", pinyin: "xué xiào", translation: "Школа", category: "daily" },
  { hanzi: "去", pinyin: "qù", translation: "Идти", category: "daily" },
  { hanzi: "在", pinyin: "zài", translation: "Находиться (в)", category: "daily" },
  { hanzi: "猫", pinyin: "māo", translation: "Кот", category: "daily" },
  { hanzi: "狗", pinyin: "gǒu", translation: "Собака", category: "daily" },
  { hanzi: "花", pinyin: "huā", translation: "Цветок", category: "daily" },
  { hanzi: "杯子", pinyin: "bēi zi", translation: "Кружка", category: "daily" },
  { hanzi: "本子", pinyin: "běn zi", translation: "Тетрадь", category: "daily" },

  // Цвета
  { hanzi: "色", pinyin: "sè", translation: "Цвет", category: "colors" },
  { hanzi: "白色", pinyin: "bái sè", translation: "Белый", category: "colors" },
  { hanzi: "灰色", pinyin: "huī sè", translation: "Серый", category: "colors" },
  { hanzi: "米色", pinyin: "mǐ sè", translation: "Бежевый", category: "colors" },
  { hanzi: "黑色", pinyin: "hēi sè", translation: "Черный", category: "colors" },
  { hanzi: "红色", pinyin: "hóng sè", translation: "Красный", category: "colors" },
  { hanzi: "粉红色", pinyin: "fěn hóng sè", translation: "Розовый", category: "colors" }
];