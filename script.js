const form = document.querySelector("form");
const table = document.querySelector("table");

const titleInput = document.querySelector("#title");
const minutInput = document.querySelector("#minut");
const hourInput = document.querySelector("#hour");
const dayInput = document.querySelector("#day");
const monthInput = document.querySelector("#month");
const yearInput = document.querySelector("#year");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* -------------------- */
/* تبدیل اعداد فارسی به انگلیسی */
/* -------------------- */

function toEnglishNumber(str) {

    return String(str)
        .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
        .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

}

/* -------------------- */
/* Jalali -> Gregorian */
/* -------------------- */

function div(a, b) {
    return Math.floor(a / b);
}

function jalaliToGregorian(jy, jm, jd) {

    jy = Number(toEnglishNumber(jy));
    jm = Number(toEnglishNumber(jm));
    jd = Number(toEnglishNumber(jd));

    jy += 1595;

    let days =
        -355668 +
        (365 * jy) +
        (div(jy, 33) * 8) +
        div((jy % 33 + 3), 4) +
        jd +
        (jm < 7
            ? (jm - 1) * 31
            : ((jm - 7) * 30) + 186);

    let gy = 400 * div(days, 146097);
    days %= 146097;

    if (days > 36524) {

        gy += 100 * div(--days, 36524);
        days %= 36524;

        if (days >= 365) {
            days++;
        }

    }

    gy += 4 * div(days, 1461);
    days %= 1461;

    if (days > 365) {

        gy += div(days - 1, 365);
        days = (days - 1) % 365;

    }

    let gd = days + 1;

    const sal_a = [
        0,
        31,
        ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)
            ? 29
            : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    let gm = 0;

    while (gm < 12 && gd > sal_a[gm + 1]) {

        gm++;
        gd -= sal_a[gm];

    }

    return {
        gy,
        gm: gm + 1,
        gd
    };
}

/* -------------------- */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

function getTaskTime(task) {

    const g = jalaliToGregorian(
        task.year,
        task.month,
        task.day
    );

    return new Date(
        g.gy,
        g.gm - 1,
        g.gd,
        Number(task.hour),
        Number(task.minut)
    ).getTime();

}

function sortTasks() {

    const now = Date.now();

    tasks.sort((a, b) => {

        const diffA =
            Math.abs(getTaskTime(a) - now);

        const diffB =
            Math.abs(getTaskTime(b) - now);

        return diffA - diffB;

    });

}

function removeTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    render();

}

function render() {

    sortTasks();

    table.innerHTML = `
        <tr>
            <th>کار</th>
            <th>تاریخ</th>
            <th>ساعت</th>
            <th>وضعیت</th>
            <th>حذف</th>
        </tr>
    `;

    const now = Date.now();

    tasks.forEach((task, index) => {

        const taskTime = getTaskTime(task);

        const status =
            taskTime < now
                ? "گذشته"
                : "آینده";

        table.innerHTML += `
            <tr>

                <td>${task.title}</td>

                <td>
                    ${task.year}/${task.month}/${task.day}
                </td>

                <td>
                    ${String(task.minut).padStart(2, "0")}
                    :
                    ${String(task.hour).padStart(2, "0")}
                </td>

                <td>${status}</td>

                <td>
                    <button
                        class="red"
                        onclick="removeTask(${index})"
                    >
                        حذف
                    </button>
                </td>

            </tr>
        `;

    });

}

window.removeTask = removeTask;

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const title =
        titleInput.value.trim();

    if (!title) return;

    const minut =
        Number(toEnglishNumber(minutInput.value));

    const hour =
        Number(toEnglishNumber(hourInput.value));

    const day =
        Number(toEnglishNumber(dayInput.value));

    const month =
        Number(toEnglishNumber(monthInput.value));

    const year =
        Number(toEnglishNumber(yearInput.value));

    if (
        isNaN(minut) ||
        isNaN(hour) ||
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year)
    ) {

        alert("لطفاً تاریخ و ساعت را صحیح وارد کنید");

        return;

    }

    tasks.push({

        title,

        minut,
        hour,
        day,
        month,
        year

    });

    saveTasks();

    render();

    form.reset();

});

render();

/* بروزرسانی هر دقیقه */

setInterval(() => {

    render();

}, 60000);
