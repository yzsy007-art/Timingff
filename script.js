// 명언
const quotes = [ /* ← 아까 준 전체 리스트 그대로 넣으면 됨 */ ];

document.getElementById("quote").innerText =
  quotes[Math.floor(Math.random() * quotes.length)];

setTimeout(() => {
  document.getElementById("splash").style.display = "none";
  document.getElementById("main").style.display = "block";
}, 4000);

// ----------------

let currentDate = new Date();
let shownEnding = false;

function getDateKey(d){
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}

function getData(){
  return JSON.parse(localStorage.getItem("timingData")) || {};
}

function saveData(data){
  localStorage.setItem("timingData", JSON.stringify(data));
}

function render(){
  const data = getData();
  const key = getDateKey(currentDate);

  const today = new Date();
  let title = "오늘";
  if (key < getDateKey(today)) title = "어제";
  if (key > getDateKey(today)) title = "내일";

  document.getElementById("dateTitle").innerText = title;

  const duTasks = data[key]?.du || [];
  const duList = document.getElementById("duList");
  duList.innerHTML = "";

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

  const allwaysTasks = data["allways"] || [];
  const allwaysList = document.getElementById("allwaysList");
  allwaysList.innerHTML="";

  allwaysTasks.forEach((t,i)=>{
    const div=document.createElement("div");
    div.className="task "+(t.done?"done":"");
    div.innerHTML=`
      <input type="checkbox" ${t.done?"checked":""}
      onchange="toggleTask('allways',${i})">
      ${t.text}
    `;
    allwaysList.appendChild(div);
  });

  // 퍼센트
  let done = duTasks.filter(t=>t.done).length;
  let total = duTasks.length;
  let percent = total===0?0:Math.floor(done/total*100);

  document.getElementById("progressBar").style.width = percent+"%";
  document.getElementById("percentText").innerText = percent+"%";

  // 🔥 100% 엔딩
  if(percent === 100 && total > 0 && !shownEnding){
    shownEnding = true;
    const ending = document.getElementById("ending");
    ending.style.display = "flex";

    setTimeout(()=>{
      ending.style.display = "none";
    },2000);
  }

  if(percent < 100){
    shownEnding = false;
  }
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
