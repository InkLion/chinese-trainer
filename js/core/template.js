// js/core/template.js
// Порт логики из logic.py: работа с шаблонами, китайскими числами и временем.

const CN_DIGITS = "零一二三四五六七八九";

// === 1. Конвертация чисел в китайские иероглифы ===

function toCnUnder10000(n) {
  if (n === 0) return "零";
  if (n < 10) return CN_DIGITS[n];
  if (n < 20) return "十" + (n % 10 === 0 ? "" : CN_DIGITS[n % 10]);

  let result = "";
  let zeroPending = false;
  let num = n;

  const units = [
    { val: 1000, char: "千" },
    { val: 100, char: "百" },
    { val: 10, char: "十" },
    { val: 1, char: "" }
  ];

  for (const { val, char } of units) {
    const d = Math.floor(num / val);
    if (d > 0) {
      if (zeroPending && result) result += "零";
      result += CN_DIGITS[d] + char;
      zeroPending = false;
    } else if (result) {
      zeroPending = true;
    }
    num %= val;
  }
  return result;
}

export function toCnNumber(n) {
  if (n === 0) return "零";
  if (n < 0) return "负" + toCnNumber(-n);
  if (n < 10000) return toCnUnder10000(n);
  if (n < 100000000) {
    const high = Math.floor(n / 10000);
    const low = n % 10000;
    let result = toCnUnder10000(high) + "万";
    if (low) {
      if (low < 1000) result += "零";
      result += toCnUnder10000(low);
    }
    return result;
  }
  return String(n);
}

export function toCnYear(year) {
  return String(year).split("").map(d => CN_DIGITS[parseInt(d, 10)]).join("");
}

// === 2. Время и Дата ===

function hour12(h) {
  const h12 = h % 12;
  return h12 === 0 ? 12 : h12;
}

function partOfDay(h) {
  if (h < 5) return "夜里";
  if (h < 9) return "早上";
  if (h < 12) return "上午";
  if (h < 14) return "中午";
  if (h < 18) return "下午";
  return "晚上";
}

function formatTimeCn(hour, minute, mode = "24") {
  let prefix = "";
  let h = hour;
  if (mode === "12") {
    prefix = partOfDay(hour);
    h = hour12(hour);
  }

  let s = prefix + (h === 2 ? "两" : toCnNumber(h)) + "点";
  if (minute === 0) {
    // ничего не добавляем
  } else if (minute === 30) {
    s += "半";
  } else if (minute < 10) {
    // Генерируем оба варианта: с нулем и без, разделяя их слэшем
    const mCn = toCnNumber(minute) + "分";
    s += `零${mCn}/${mCn}`; 
  } else {
    s += toCnNumber(minute) + "分";
  }
  return s;
}

function formatTimeBasic(hour, minute, mode = "24") {
  const pad = (num) => String(num).padStart(2, "0");
  if (mode === "12") {
    const h = hour12(hour);
    const ampm = hour < 12 ? "первая половина" : "вторая половина";
    return `${h}:${pad(minute)} ${ampm}`;
  }
  return `${pad(hour)}:${pad(minute)}`;
}

// === 3. Генерация случайных значений ===

function generateValue(type, params) {
  if (type === "int") {
    const m = (params || "").match(/([+-]?\d+)\s*\.\.\s*([+-]?\d+)/);
    if (m) {
      const a = parseInt(m[1], 10);
      const b = parseInt(m[2], 10);
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      return Math.floor(Math.random() * (hi - lo + 1)) + lo;
    }
    return Math.floor(Math.random() * 100) + 1;
  }
  
  if (type === "choice") {
    const opts = (params || "").split("|").map(s => s.trim()).filter(Boolean);
    if (opts.length === 0) return { ru: "", cn: "" };
    
    const selected = opts[Math.floor(Math.random() * opts.length)];
    const parts = selected.split(":");
    return { 
      ru: parts[0], 
      cn: parts[1] || parts[0] 
    };
  }
  
  if (type === "date") {
    const m = (params || "").match(/(\d{4})\s*\.\.\s*(\d{4})/);
    let lo = 2020, hi = 2030;
    if (m) {
      const a = parseInt(m[1], 10);
      const b = parseInt(m[2], 10);
      lo = Math.min(a, b);
      hi = Math.max(a, b);
    }
    const year = Math.floor(Math.random() * (hi - lo + 1)) + lo;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return { year, month, day };
  }
  
  if (type === "time") {
    return {
      hour: Math.floor(Math.random() * 24),
      minute: Math.floor(Math.random() * 60)
    };
  }
  return "";
}

// === 4. Форматирование сгенерированных значений ===

function formatValue(value, type, fmt, params) {
  if (type === "int") {
    return fmt === "cn" ? toCnNumber(value) : String(value);
  }
  
  if (type === "choice") {
    if (fmt === "cn") return value.cn;
    return value.ru;
  }
  
  if (type === "date") {
    if (fmt === "cn") {
      const y = toCnYear(value.year);
      const m = toCnNumber(value.month);
      const d = toCnNumber(value.day);
      // Возвращаем оба варианта: с "日" и с "号"
      return `${y}年${m}月${d}日/${y}年${m}月${d}号`;
    }
    if (fmt) {
      // Простая реализация strftime для JS
      return fmt
        .replace("%Y", value.year)
        .replace("%m", String(value.month).padStart(2, '0'))
        .replace("%d", String(value.day).padStart(2, '0'));
    }
    return `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
  }
  
  if (type === "time") {
    const mode = params || "24";
    if (fmt === "cn") {
      return formatTimeCn(value.hour, value.minute, mode);
    }
    if (fmt) {
      return fmt
        .replace("%H", String(value.hour).padStart(2, '0'))
        .replace("%M", String(value.minute).padStart(2, '0'));
    }
    return formatTimeBasic(value.hour, value.minute, mode);
  }
  return String(value);
}

// === 5. Движок шаблонов ===

// Регулярное выражение из logic.py
const TEMPLATE_RE = /\{\{(\w+)(?::([^}:@]*)(?::([^}@]*))?)?(?:@([^}]+))?\}\}/g;
const KNOWN_TYPES = new Set(["int", "choice", "date", "time"]);

class VarContext {
  constructor() {
    this.vars = new Map(); // name -> { value, type, params }
  }

  define(name, type, params) {
    if (this.vars.has(name)) return;
    this.vars.set(name, {
      value: generateValue(type, params),
      type,
      params: params || ""
    });
  }

  formatVar(name, fmt) {
    if (!this.vars.has(name)) return null;
    const v = this.vars.get(name);
    return formatValue(v.value, v.type, fmt, v.params);
  }
}

function parsePlaceholder(match, p1, p2, p3, p4) {
  const name = p1;
  let part2 = p2;
  let part3 = p3;
  let fmt = p4;

  if (KNOWN_TYPES.has(part2)) {
    if (part2 === "time") {
      let mode = (part3 || "").trim();
      if (mode === "cn") {
        fmt = fmt || "cn";
        mode = "";
      }
      return { name, type: part2, params: mode, fmt };
    }
    return { name, type: part2, params: part3 || "", fmt };
  }
  
  return { name, type: null, params: null, fmt: fmt || part2 || null };
}

function resolveText(text, ctx) {
  if (!text) return text;
  
  return text.replace(TEMPLATE_RE, (match, p1, p2, p3, p4) => {
    const { name, type, params, fmt } = parsePlaceholder(match, p1, p2, p3, p4);
    if (type) {
      ctx.define(name, type, params);
    }
    const val = ctx.formatVar(name, fmt);
    return val !== null ? val : match; // Если не нашли переменную, оставляем как есть
  });
}

// === 6. Главная функция, которую мы будем вызывать ===

export function resolveQuestion(q) {
  const ctx = new VarContext();
  
  // 1. Собираем все переменные (безопасно для строк и массивов)
  const sources = [q.prompt, q.hint, q.fill_text];
  if (typeof q.answer === 'string') sources.push(q.answer);
  if (Array.isArray(q.answer)) sources.push(...q.answer);
  if (Array.isArray(q.words)) sources.push(...q.words);
  if (q.options) sources.push(...q.options);
  if (q.fill_answers) sources.push(...q.fill_answers);
  if (q.pairs) q.pairs.forEach(pair => sources.push(pair[0], pair[1]));

  for (const src of sources) {
    if (!src || typeof src !== 'string') continue; // Пропускаем не-строки
    const matches = [...src.matchAll(TEMPLATE_RE)];
    for (const match of matches) {
      const { name, type, params } = parsePlaceholder(match[1], match[2], match[3], match[4]);
      if (type) ctx.define(name, type, params);
    }
  }

  // 2. Функция для разрешения текста (работает только со строками)
  const resolve = (text) => typeof text === 'string' ? resolveText(text, ctx) : text;

  // 3. Возвращаем объект, сохраняя массивы как массивы
  return {
    ...q,
    prompt: resolve(q.prompt),
    options: Array.isArray(q.options) ? q.options.map(resolve) : [],
    answer: Array.isArray(q.answer) ? q.answer.map(resolve) : resolve(q.answer),
    words: Array.isArray(q.words) ? q.words.map(resolve) : [],
    pairs: Array.isArray(q.pairs) ? q.pairs.map(p => [resolve(p[0]), resolve(p[1])]) : [],
    fill_text: resolve(q.fill_text),
    fill_answers: Array.isArray(q.fill_answers) ? q.fill_answers.map(resolve) : [],
    hint: resolve(q.hint)
  };
}

// === 7. Нормализация ответов ===

// Для сравнения ответов (без учета регистра, пробелов и тонов пиньиня)
export function normalizeAnswer(s) {
  if (!s) return "";
  // Если есть иероглифы, оставляем только их
  if (/[\u4e00-\u9fff]/.test(s)) {
    return s.replace(/[^\u4e00-\u9fff]/g, "");
  }
  // Иначе приводим к нижнему регистру и убираем ТОЛЬКО пробелы (оставляем цифры и дефисы)
  return s.toLowerCase().replace(/\s+/g, ""); 
}