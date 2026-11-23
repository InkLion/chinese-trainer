// js/data/dialogues.js
export const DIALOGUES = [
  {
    id: "greetings_1",
    title: "Знакомство",
    description: "Первая встреча",
    steps: [
      {
        bot: "你好！",
        options: ["你好！", "谢谢", "再见", "不用谢"],
        correct: "你好！"
      },
      {
        bot: "你叫什么名字？",
        options: ["我叫{{username}}。", "我姓张。", "很高兴认识你。", "你多大了？"],
        correct: "我叫{{username}}。"
      },
      {
        bot: "很高兴认识你。",
        options: ["我也很高兴认识你。", "再见。", "我是俄罗斯人。", "你叫什么名字？"],
        correct: "我也很高兴认识你。"
      }
    ]
  },
  {
    id: "daily_1",
    title: "В школе",
    description: "Разговор о расписании",
    steps: [
      {
        bot: "你现在去哪儿？",
        options: ["我去学校。", "我吃早饭。", "我在家。", "我喜欢看电视。"],
        correct: "我去学校。"
      },
      {
        bot: "你几点上学？",
        options: ["我八点上学。", "我七点起床。", "我五点回家。", "我晚上十点睡觉。"],
        correct: "我八点上学。"
      },
      {
        bot: "你在学校学习什么？",
        options: ["我学习汉语。", "我学习英语。", "我学习做饭。", "我学习看电视。"],
        correct: "我学习汉语。"
      }
    ]
  },
  {
    id: "family_1",
    title: "О семье",
    description: "Рассказ о родственниках",
    steps: [
      {
        bot: "你家有几口人？",
        options: ["我家有四口人。", "我有一个哥哥。", "我是俄罗斯人。", "我家很好。"],
        correct: "我家有四口人。"
      },
      {
        bot: "你有哥哥吗？",
        options: ["我没有哥哥。", "我有姐姐。", "他是我的弟弟。", "我有一个妹妹。"],
        correct: "我没有哥哥。"
      },
      {
        bot: "这是谁？",
        options: ["这是我妹妹。", "这是我朋友。", "这是我的猫。", "这是我的杯子。"],
        correct: "这是我妹妹。"
      }
    ]
  }
];