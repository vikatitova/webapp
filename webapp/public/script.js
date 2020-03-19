const resetBtn = document.getElementById("reset");
const form = document.querySelector("form");

async function getUsers() {

    const response = await fetch("/api/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });

    let users = await response.json();
    let rows = "";

    for (const user of users) {
        rows += row(user);
    }

    tbody = document.querySelector("tbody");
    tbody.insertAdjacentHTML("afterbegin", rows);
}

async function getUser(id) {

    const response = await fetch("/api/users/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });

    let user = await response.json();

    let form = document.forms["userForm"];
    form.elements["id"].value = user.id;
    form.elements["name"].value = user.name;
    form.elements["age"].value = user.age;

}

async function createUser(userName, userAge) {

    let response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            name: userName,
            age: userAge
        })
    });

    let user = await response.json();
    user.name = userName;
    user.age = userAge;

    reset();

    let tbody = document.querySelector("tbody");
    tbody.insertAdjacentHTML("beforeend", row(user));

}

async function editUser(userId, userName, userAge) {

    let response = await fetch("/api/users", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            id: userId,
            name: userName,
            age: userAge
        })
    });

    let user = await response.json();

    reset();

    let tr = document.querySelector(`tr[data-rowid="${user.id}"]`);
    tr.insertAdjacentHTML("beforebegin", row(user));
    tr.remove();
}

async function deleteUser(id) {

    let response = await fetch("/api/users/" + id, {
        method: "DELETE",
        header: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });

    let user = await response.json();

    let tr = document.querySelector(`tr[data-rowid="${user.id}"]`);
    tr.remove();
}


function reset() {

    let form = document.forms["userForm"];
    form.reset();
    form.elements["id"].value = 0;
}

function row(user) {

    return `
        <tr data-rowid="${user.id}">
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.age}</td>
            <td>
            <a class="editLink" data-id="${user.id}">Change</a> |
            <a class="removeLink" data-id="${user.id}">Remove</a>
            </td>
        </tr>
    `;
}


resetBtn.addEventListener("click", function(event) {

    event.preventDefault();
    reset();
});


form.addEventListener("submit", function(event) {

    event.preventDefault();
    let id = this.elements["id"].value;
    let name = this.elements["name"].value;
    let age = this.elements["age"].value;

    if (id == 0) {
        createUser(name, age);
    } else {
        editUser(id, name, age);
    }
});

document.body.addEventListener("click", function(event) {

    if (event.target.className == "editLink") {
        const id = event.target.dataset.id;
        getUser(id);
    };

    if (event.target.className == "removeLink") {
        const id = event.target.dataset.id;
        deleteUser(id);
    };
    
});

getUsers();