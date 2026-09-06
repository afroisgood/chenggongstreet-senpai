// 活動階段與投票題目資料（固定內容，不隨活動變動）
// type: 'comment' | 'vote' | 'wordcloud'
export const STAGES = [
  {
    id: 'icebreak',
    name: '破冰時間！',
    type: 'comment',
    question: '破冰時間！',
  },
  {
    id: 'vote1',
    name: '投票一',
    type: 'vote',
    multiSelect: true,
    question: '看到今天這個標題，你心裡第一個 OS 是？',
    options: [
      { id: 'A', label: '成功街到底在哪裡？' },
      { id: 'B', label: '到底多不成功，才會取這個名字？' },
      { id: 'C', label: '直接承認還沒成功，滿誠實的。' },
      { id: 'D', label: '標題太長了，我只是來吹冷氣的。' },
    ],
  },
  {
    id: 'vote2',
    name: '投票二',
    type: 'vote',
    multiSelect: true,
    question: '你曾經去過北濱板場玩過板嗎？',
    options: [
      { id: 'A', label: '想玩但沒有滑板' },
      { id: 'B', label: '滑板仔都太酷了，沒包手不敢去' },
      { id: 'C', label: '北濱我都玩沙排' },
      { id: 'D', label: '我怕跌倒' },
      { id: 'E', label: '有阿！！！我有去啊！！！' },
      { id: 'F', label: '都是男生我不敢去' },
      { id: 'G', label: '沒想過（攤手）' },
    ],
  },
  {
    id: 'vote3',
    name: '投票三',
    type: 'vote',
    multiSelect: true,
    question: '在做自己喜歡的事情時，如果要把自己弄得髒兮兮或容易受傷，妳的接受度有多高？',
    options: [
      { id: 'A', label: '完全不行！漂亮跟乾淨是我的底線' },
      { id: 'B', label: '只有在沒人看到的時候可以接受' },
      { id: 'C', label: '為了作品或熱情，弄髒其實滿爽的' },
      { id: 'D', label: '我現在就想把制服塗滿顏料' },
      { id: 'E', label: '髒可以，受傷不可以' },
    ],
  },
  {
    id: 'vote4',
    name: '投票四',
    type: 'vote',
    multiSelect: true,
    question: '還記得大地震過後一切的變化嗎？',
    options: [
      { id: 'A', label: '地震那時候以為我要死了' },
      { id: 'B', label: '海邊都是漂流木！超扯！' },
      { id: 'C', label: '根本一切都變化的太快了' },
      { id: 'D', label: '那些拆掉的房子都去哪了？' },
      { id: 'E', label: '我是花蓮人我不怕！' },
    ],
  },
  {
    id: 'menu',
    name: '提問靈感菜單',
    type: 'comment',
    // question 由後台當場輸入，存在 Firestore config.menuQuestionText
    question: null,
  },
  {
    id: 'wordcloud',
    name: '妳現在最重視的東西是甚麼？',
    type: 'wordcloud',
    question: '妳現在最重視的東西是甚麼？',
  },
]

export const getStage = (id) => STAGES.find((s) => s.id === id)
