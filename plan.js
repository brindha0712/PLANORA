let currentDiaryDate = "";
const showScreen = (id) => {
    document
    .querySelectorAll(".screen")
    .forEach(screen => {
        screen.classList.remove("active");
    });
    document
    .getElementById(id)
    .classList.add("active");
};
const login = () => {
    const email =
    document.getElementById("email").value;
    const password =
    document.getElementById("password").value;
    if(
        email.includes("@")
        &&
        password.length >= 4
    ){
        const username =
        email.split("@")[0];
        document.getElementById(
            "welcomeUser"
        ).innerText =
        `Hi, ${username}`;
        showScreen("home-screen");
    }else{
        alert("Invalid Details");
    }
};
const addTask = () => {
    const task =
    prompt("Enter Task");
    if(!task || task.trim()==="") return;
    const category =
    prompt(
        "Category: study / work / shopping"
    ) || "study";
    const priority =
    prompt(
        "Priority: high / medium / low"
    ) || "low";
    const dueDate =
    prompt(
        "Enter Due Date & Time\nExample: 2026-05-20 18:00"
    ) || "No Date";
    const list =
    document.getElementById("todo-list");
    const div =
    document.createElement("div");
    div.className = "todo-card";
    div.innerHTML = `
        <input type="checkbox" class="check">
        <div class="task-info">
            <span>${task}</span>
            <div class="small-text">
                📂 ${category}
                <br>
                ⏰ ${dueDate}
            </div>
        </div>
        <div class="priority ${priority}">
            ${priority}
        </div>
        <button class="icon-btn editBtn">
            <i class="fa-solid fa-pen"></i>
        </button>
        <button class="icon-btn deleteBtn">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    list.appendChild(div);
    attachEvents(div);
    saveTasks();
    updateStats();
    checkReminder(task,dueDate);
};
const attachEvents = (div) => {
    const checkbox =
    div.querySelector(".check");
    const span =
    div.querySelector("span");
    checkbox.addEventListener(
        "change",
        () => {
            span.classList.toggle(
                "completed"
            );
            saveTasks();
            updateStats();
        }
    );
    div.querySelector(".deleteBtn")
    .addEventListener("click",() => {
        div.remove();
        saveTasks();
        updateStats();
    });
    div.querySelector(".editBtn")
    .addEventListener("click",() => {
        const newTask =
        prompt(
            "Edit Task",
            span.innerText
        );
        if(newTask){
            span.innerText =
            newTask;
            saveTasks();
        }
    });
};
const updateStats = () => {
    const tasks =
    document.querySelectorAll(".todo-card");
    const completed =
    document.querySelectorAll(
        ".completed"
    );
    document.getElementById(
        "totalTasks"
    ).innerText =
    tasks.length;
    document.getElementById(
        "completedTasks"
    ).innerText =
    completed.length;
    let percent = 0;
    if(tasks.length > 0){
        percent =
        (completed.length/tasks.length)*100;

    }
    document.getElementById(
        "progressBar"
    ).style.width =
    percent + "%";
};
const searchTasks = () => {
    const value =
    document.getElementById(
        "searchTask"
    ).value.toLowerCase();
    document
    .querySelectorAll(".todo-card")
    .forEach(task => {
        task.style.display =
        task.innerText
        .toLowerCase()
        .includes(value)
        ? "flex"
        : "none";
    });
};
const saveTasks = () => {
    const tasks = [];
    document
    .querySelectorAll(".todo-card")
    .forEach(card => {
        tasks.push({
            text:
            card.querySelector("span")
            .innerText,
            category:
            card.querySelector(".small-text")
            .innerText
            .split("📂 ")[1]
            .split("⏰")[0]
            .trim(),
            due:
            card.querySelector(".small-text")
            .innerText
            .split("⏰ ")[1]
            .trim(),
            priority:
            card.querySelector(".priority")
            .innerText,
            completed:
            card.querySelector(".check")
            .checked
        });
    });
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
};
const loadTasks = () => {
    const savedTasks =
    JSON.parse(
        localStorage.getItem("tasks")
        || "[]"
    );
    const list =
    document.getElementById(
        "todo-list"
    );
    list.innerHTML = "";
    savedTasks.forEach(task => {
        const div =
        document.createElement("div");
        div.className = "todo-card";
        div.innerHTML = `
            <input type="checkbox"
            class="check"
            ${task.completed ? "checked" : ""}>
            <div class="task-info">
                <span class="
                ${task.completed ? "completed" : ""}
                ">
                ${task.text}
                </span>
                <div class="small-text">
                    📂 ${task.category}
                    <br>
                    ⏰ ${task.due}
                </div>
            </div>
            <div class="priority ${task.priority}">
                ${task.priority}
            </div>
            <button class="icon-btn editBtn">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="icon-btn deleteBtn">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        list.appendChild(div);
        attachEvents(div);
    });
    updateStats();
};
const checkReminder = (task,dueDate) => {
    if(
        Notification.permission !==
        "granted"
    ){
        Notification.requestPermission();
    }
    const due =
    new Date(dueDate).getTime();
    const now =
    new Date().getTime();
    const delay =
    due - now;
    if(delay > 0){
        setTimeout(() => {
            new Notification(
                "⏰ Task Reminder",
                {
                    body:
                    `Task: ${task}`
                }
            );
        },delay);
    }
};
const updateClock = () => {
    const now =
    new Date();
    document.getElementById(
        "clock"
    ).innerText =
    now.toLocaleTimeString();
};
setInterval(updateClock,1000);
const getWeather = async () => {
    try{
        const response =
        await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=13.08&longitude=80.27&current_weather=true"
        );
        const data =
        await response.json();
        document.getElementById(
            "weather"
        ).innerHTML = `
            <h4>🌤 Current Weather</h4>
            <p>
            Temperature:
            ${data.current_weather.temperature}°C
            </p>
        `;
    }catch(error){
        document.getElementById(
            "weather"
        ).innerHTML =
        "Unable to fetch weather";
    }
};
getWeather();
const getQuote = async () => {
    try{
        const response =
        await fetch(
        "https://api.quotable.io/random"
        );
        const data =
        await response.json();
        document.getElementById(
            "quote"
        ).innerHTML = `
            "${data.content}"
            <br><br>
            — ${data.author}
        `;
    }catch(error){
        document.getElementById(
            "quote"
        ).innerText =
        "Stay positive and keep moving.";
    }
};
getQuote();
const toggleTheme = () => {
    const body =
    document.body;
    body.style.filter =
    body.style.filter === "invert(1)"
    ? "invert(0)"
    : "invert(1)";
};
const setDiaryPassword = () => {
    const pass =
    prompt("Set Diary Password");
    if(pass){
        localStorage.setItem(
            "diaryPass",
            pass
        );
        alert("Password Saved");
    }
};
const openDiary = () => {
    const saved =
    localStorage.getItem(
        "diaryPass"
    );
    if(!saved){
        setDiaryPassword();
        return;
    }
    const entered =
    prompt("Enter Password");
    if(entered === saved){
        renderDiaryList();
        showScreen("diary-screen");
    }else{
        alert("Wrong Password");
    }
};
const renderDiaryList = () => {
    const list =
    document.getElementById(
        "diary-list"
    );
    list.innerHTML = "";
    const diaries =
    JSON.parse(
        localStorage.getItem(
            "diaries"
        ) || "{}"
    );
    const keys =
    Object.keys(diaries);
    if(keys.length===0){
        list.innerHTML =
        "<p>No Diary Entries</p>";
    }
    keys.reverse().forEach(date => {
        const div =
        document.createElement("div");
        div.className =
        "diary-entry";
        div.innerHTML = `
            <h4>${date}</h4>
        `;
        div.onclick =
        () => editDiary(date);
        list.appendChild(div);
    });
};
const newDiaryEntry = () => {
    const today =
    new Date()
    .toISOString()
    .split("T")[0];
    editDiary(today);
};
const editDiary = (date) => {
    currentDiaryDate = date;
    document.getElementById(
        "editorDate"
    ).innerText =
    date;
    const diaries =
    JSON.parse(
        localStorage.getItem(
            "diaries"
        ) || "{}"
    );
    document.getElementById(
        "diaryText"
    ).value =
    diaries[date] || "";
    showScreen("editor-screen");
};
const saveDiary = () => {
    const text =
    document.getElementById(
        "diaryText"
    ).value;
    const diaries =
    JSON.parse(
        localStorage.getItem(
            "diaries"
        ) || "{}"
    );
    diaries[currentDiaryDate] =
    text;
    localStorage.setItem(
        "diaries",
        JSON.stringify(diaries)
    );
    alert("Diary Saved");
    renderDiaryList();
    showScreen("diary-screen");
};
loadTasks();