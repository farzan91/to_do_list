let locali = JSON.parse(localStorage.getItem("to-do-thing")) || [];
let tabel = document.getElementsByTagName("table")[0];
let form = document.getElementsByTagName("form")[0];
let titlee = document.getElementById("title");
let timee = document.getElementById("time");

function maketh(title, time, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${title}</td>
        <td>${time}</td>
        <td><button class="red" data-index="${index}">حذف</button></td>
    `;
    tabel.appendChild(row);
}

function render() {
    sortTodos()
    tabel.innerHTML = "";
    locali.forEach((item, index) => {
        maketh(item[0], item[1], index);
    });
}

function saveLocal(title, time) {
    locali.push([title, time]);
    localStorage.setItem("to-do-thing", JSON.stringify(locali));
}

function deleteTodo(index) {
    locali.splice(index, 1);  // حذف از آرایه
    localStorage.setItem("to-do-thing", JSON.stringify(locali));  // آپدیت localStorage
    render();  // دوباره رندر کن
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titlee.value.trim();
    const time = timee.value.trim();
    
    if (!title || !time) return;  // جلوگیری از ورودی خالی
    
    saveLocal(title, time);
    render();
    titlee.value = "";
    timee.value = "";
});

// Event delegation برای دکمه‌های حذف
tabel.addEventListener("click", (event) => {
    if (event.target.classList.contains("red")) {
        const index = Number(event.target.dataset.index);
        deleteTodo(index);
    }
});
function sortTodos() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    locali.sort((a, b) => {
        const [ha, ma] = a[1].split(":").map(Number);
        const [hb, mb] = b[1].split(":").map(Number);

        const timeA = ha * 60 + ma;
        const timeB = hb * 60 + mb;

        return  Math.abs(timeB - currentMinutes)-Math.abs(timeA - currentMinutes)
               
    });
}

// رندر اولیه
render();