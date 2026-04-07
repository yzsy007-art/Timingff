// 🔥 명언 리스트 (전체 넣어도 됨)
const quotes = [
"시간은 인간이 쓸 수 있는 가장 값진 비용이다. – 테오프라스토스",
"어제를 후회하는 것은 창살 없는 감옥에 자신을 가두는 것이다. – 고사성어",
"당신은 지체할지 모르지만, 시간은 지체하지 않는다. – 벤자민 프랭크린",
"오늘이라는 날은 두 번 다시 오지 않는다는 것을 잊지 마라. – 단테",
"시간을 지배하는 자가 인생을 지배한다. – 작자 미상"
];

document.getElementById("quote").innerText =
  quotes[Math.floor(Math.random() * quotes.length)];

setTimeout(()=>{
  document.getElementById("splash").style.display="none";
  document.getElementById("main").style.display="block";
},4000);

// ----------------

let currentDate = new Date();

// 🔥 날짜 자동 갱신 (자정 대응)
setInterval(()=>{
  const now = new Date();
  if(now.getDate() !== currentDate.getDate()){
    currentDate = new Date();
    render();
  }
},60000);

// ----------------

function getDateKey(d){
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function getData(){
  return JSON.parse(localStorage.getItem("timingData")) || {};
}

function saveData(d){
  localStorage.setItem("timingData",JSON.stringify(d));
}

let shownEnding=false;

function render(){
  const data=getData();
  const key=getDateKey(currentDate);

  const today=new Date();
  let title="오늘";
  if(key<getDateKey(today)) title="어제";
  if(key>getDateKey(today)) title="내일";

  document.getElementById("dateTitle").innerText=title;

  const duTasks=data[key]?.du||[];

  const duList=document.getElementById("duList");
  duList.innerHTML="";
  duTasks.forEach((t,i)=>{
    const div=document.createElement("div");
    div.className="task "+(t.done?"done":"");
    div.innerHTML=`
      <input type="checkbox" ${t.done?"checked":""}
      onchange="toggleTask('du',${i})">
      ${t.text}
    `;
    duList.appendChild(div);
  });

  // 퍼센트
  let done=duTasks.filter(t=>t.done).length;
  let total=duTasks.length;
  let percent=total===0?0:Math.floor(done/total*100);

  document.getElementById("progressBar").style.width=percent+"%";
  document.getElementById("percentText").innerText=percent+"%";

  // 🔥 엔딩 애니메이션
  if(percent===100 && total>0 && !shownEnding){
    shownEnding=true;
    const ending=document.getElementById("ending");
    ending.classList.add("show-ending");

    setTimeout(()=>{
      ending.classList.remove("show-ending");
    },2000);
  }

  if(percent<100) shownEnding=false;
}

function addTask(type){
  const input=document.getElementById(type+"Input");
  if(!input.value) return;

  const data=getData();
  const key=getDateKey(currentDate);

  if(type==="du"){
    if(!data[key]) data[key]={du:[]};
    data[key].du.push({text:input.value,done:false});
  }

  saveData(data);
  input.value="";
  render();
}

function toggleTask(type,i){
  const data=getData();
  const key=getDateKey(currentDate);

  data[key].du[i].done=!data[key].du[i].done;

  saveData(data);
  render();
}

function changeDay(o){
  currentDate.setDate(currentDate.getDate()+o);
  render();
}

render();
