// 🔥 명언 리스트 (전체 반영)
const quotes = [
"시간은 인간이 쓸 수 있는 가장 값진 비용이다. – 테오프라스토스",
"어제를 후회하는 것은 창살 없는 감옥에 자신을 가두는 것이다. – 고사성어",
"당신은 지체할지 모르지만, 시간은 지체하지 않는다. – 벤자민 프랭크린",
"가장 바쁜 사람이 가장 많은 시간을 가진다. – 알렉산드르 비네",
"시간을 선택하는 것은 시간을 절약하는 것이다. – 베이컨",
"승자는 시간을 관리하며 살고, 패자는 시간에 끌려 다니며 산다. – J. 하비스",
"오늘이라는 날은 두 번 다시 오지 않는다는 것을 잊지 마라. – 단테",
"미래를 신뢰하지 마라, 죽은 과거는 묻어버려라, 살아있는 현재에 행동하라. – 롱펠로",
"짧은 인생은 시간의 낭비에 의해 더욱 짧아진다. – 새뮤얼 존슨",
"시간은 우정을 깊게 만들지만, 사랑은 희미하게 만든다. – 라 브뤼예르",

"우리가 어느 날 마주칠 불행은 우리가 소홀히 보낸 시간의 보복이다. – 나폴레옹",
"변명 중에서도 가장 어리석고 비열한 변명은 '시간이 없어서'라는 변명이다. – 에디슨",
"시간의 발걸음에는 세 가지가 있다. 미래는 주저하며 다가오고, 현재는 화살처럼 날아가고, 과거는 영원히 정지해 있다. – 실러",
"보통 사람은 시간을 소비하는 것에 마음을 쓰고, 재능 있는 사람은 시간을 이용하는 것에 마음을 쓴다. – 쇼펜하우어",
"시간을 지배하는 자가 인생을 지배한다. – 작자 미상",
"잃어버린 시간은 결코 찾지 못한다. – 벤자민 프랭크린",
"시간은 위대한 스승이지만, 불행하게도 자신의 모든 제자를 죽인다. – 베를리오즈",
"가장 큰 시간 낭비는 뒤를 돌아보는 것과 미래를 걱정하는 것이다. 지금 이 순간을 살아라. – 작자 미상",
"인생은 짧고, 예술은 길다. – 히포크라테스",
"시간은 만물을 흐르게 하고, 만물을 변화시킨다. – 헤라클레이토스"
];

// 🔥 랜덤 명언 출력
document.getElementById("quote").innerText =
  quotes[Math.floor(Math.random() * quotes.length)];

// 🔥 4초 후 메인 진입
setTimeout(() => {
  document.getElementById("splash").style.display = "none";
  document.getElementById("main").style.display = "block";
}, 4000);

// =========================
// 🔥 메인 기능
// =========================

let currentDate = new Date();

function getDateKey(d) {
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function getData() {
  return JSON.parse(localStorage.getItem("timingData")) || {};
}

function saveData(data) {
  localStorage.setItem("timingData", JSON.stringify(data));
}

function render() {
  const data = getData();
  const key = getDateKey(currentDate);

  const today = new Date();
  let title = "오늘";
  if (key < getDateKey(today)) title = "어제";
  if (key > getDateKey(today)) title = "내일";

  document.getElementById("dateTitle").innerText = title;

  // 🔥 du
  const duList = document.getElementById("duList");
  duList.innerHTML = "";
  const duTasks = data[key]?.du || [];

  duTasks.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "task " + (t.done ? "done" : "");

    div.innerHTML = `
      <input type="checkbox" ${t.done ? "checked":""}
      onchange="toggleTask('du',${i})">
      ${t.text}
    `;
    duList.appendChild(div);
  });

  // 🔥 allways
  const allwaysList = document.getElementById("allwaysList");
  allwaysList.innerHTML = "";
  const allwaysTasks = data["allways"] || [];

  allwaysTasks.forEach((t,i)=>{
    const div = document.createElement("div");
    div.className = "task " + (t.done ? "done":"");

    div.innerHTML = `
      <input type="checkbox" ${t.done ? "checked":""}
      onchange="toggleTask('allways',${i})">
      ${t.text}
    `;
    allwaysList.appendChild(div);
  });

  // 🔥 퍼센트 계산
  let done = duTasks.filter(t=>t.done).length;
  let total = duTasks.length;
  let percent = total===0?0:Math.floor(done/total*100);

  document.getElementById("progressBar").style.width = percent+"%";
  document.getElementById("percentText").innerText = percent+"%";
}

function addTask(type){
  const input=document.getElementById(type+"Input");
  if(!input.value) return;

  const data=getData();
  const key=getDateKey(currentDate);

  if(type==="du"){
    if(!data[key]) data[key]={du:[]};
    data[key].du.push({text:input.value,done:false});
  } else {
    if(!data["allways"]) data["allways"]=[];
    data["allways"].push({text:input.value,done:false});
  }

  saveData(data);
  input.value="";
  render();
}

function toggleTask(type,i){
  const data=getData();
  const key=getDateKey(currentDate);

  if(type==="du"){
    data[key].du[i].done=!data[key].du[i].done;
  } else {
    data["allways"][i].done=!data["allways"][i].done;
  }

  saveData(data);
  render();
}

function changeDay(o){
  currentDate.setDate(currentDate.getDate()+o);
  render();
}

render();