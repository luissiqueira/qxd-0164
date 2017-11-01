var activeGroup = undefined;

function createGroup(name, id) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var group = JSON.parse(this.responseText);
            printGroup(group);
            showMessages(id);
            document.querySelector('.talks-container .header').textContent = name;
            document.querySelector('#create-group-container').style.display = 'none';
        }
    };
    var username = localStorage.getItem('username');
    request.open('POST', 'http://rest.learncode.academy/api/' + username + '/groups/', true);
    var group =  { groupName: name, groupId: id };
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(group));
}

function startLogin() {
    document.querySelector('#login-container').style.display = 'block';
    document.querySelector('#main-container').style.display = 'none';
    document.querySelector('.btn-create-group').style.display = 'none';
}

function startup() {
    document.querySelector('#login-container').style.display = 'none';
    document.querySelector('#main-container').style.display = 'block';

    if (localStorage.getItem('username')) {
        document.querySelector('#btn-logged-user').textContent = '(' + localStorage.getItem('username') + ')';
        document.querySelector('#btn-login').style.display = 'none';
        document.querySelector('.btn-create-group').style.display = 'block';
        clearGroups();
        fetchGroups();
    } else {
        document.querySelector('#btn-logged-user').style.display = 'none';
        document.querySelector('#btn-logout').style.display = 'none';
        document.querySelector('#btn-login').style.display = 'inline-block';
        document.querySelector('.btn-create-group').style.display = 'none';
    }

    document.querySelector('#message-to-send').addEventListener('keypress', function () {
        if (event.which === 13) {
            event.preventDefault();
            var content = document.querySelector('#message-to-send').value;
            sendMessage(activeGroup, content);
            document.querySelector('#message-to-send').value = '';
        }
    });

    document.querySelector('#username-to-register').addEventListener('keypress', function () {
        if (event.which === 13) {
            event.preventDefault();
            var username = document.querySelector('#username-to-register').value;
            registerUser(username);
            document.querySelector('#username-to-register').value = '';
        }
    });

    document.querySelector('#submit-to-register').addEventListener('click', function () {
        var username = document.querySelector('#username-to-register').value;
        registerUser(username);
        document.querySelector('#username-to-register').value = '';
    });

    document.querySelector('#login-container').addEventListener('click', function () {
        closeLogin();
    });

    document.querySelector('#login-container .box-login').addEventListener('click', function () {
        event.stopPropagation();
    });

    document.querySelector('#create-group-container').addEventListener('click', function () {
        document.querySelector('#create-group-container').style.display = 'none';
    });

    document.querySelector('#create-group-container .box-group').addEventListener('click', function () {
        event.stopPropagation();
    });

    document.querySelector('.btn-create-group').addEventListener('click', function () {
        document.querySelector('#create-group-container').style.display = 'block';
    });

    document.querySelector('#btn-logout').addEventListener('click', function () {
        localStorage.removeItem('username');
        document.querySelector('#btn-login').style.display = 'inline-block';
        document.querySelector('#btn-logged-user').style.display = 'none';
        document.querySelector('#btn-logout').style.display = 'none';
        document.querySelector('.btn-create-group').style.display = 'none';
        clearGroups();
        hideMessages();
    });

    document.querySelector('#btn-login').addEventListener('click', function () {
        startLogin();
    });

    document.querySelector('#submit-group').addEventListener('click', function () {
        var nameInput = document.querySelector('#group-name');
        var idInput = document.querySelector('#group-id');

        if (nameInput.value && idInput.value) {
            createGroup(nameInput.value, idInput.value);

            nameInput.value = '';
            idInput.value = '';
        }
    });
}

function showMessages(groupId) {
    document.querySelector('.empty-messages').style.display = 'none';
    activeGroup = groupId;
    fetchMessages(groupId);
    document.querySelector('#message-to-send').focus();
}

function hideMessages() {
    document.querySelector('.empty-messages').style.display = 'block';
}

function fetchGroups() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var groups = JSON.parse(this.responseText);
            groups.forEach(printGroup);
        }
    };
    var username = localStorage.getItem('username');
    request.open('GET', 'http://rest.learncode.academy/api/' + username + '/groups', true);
    request.send();
}

function fetchMessages(groupId) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var messages = JSON.parse(this.responseText);
            messages.forEach(printMessage);
        }
    };
    var username = localStorage.getItem('username');
    request.open('GET', 'http://rest.learncode.academy/api/' + username + '/' + groupId, true);
    request.send();
}

function clearGroups() {
    document.querySelector('.contact-list').textContent = '';
}

function clearMessages() {
    document.querySelector('.messages-container').textContent = '';
}

function sendMessage(groupId, content) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var message = JSON.parse(this.responseText);
            printMessage(message);
        }
    };
    var username = localStorage.getItem('username');
    request.open('POST', 'http://rest.learncode.academy/api/' + username + '/' + groupId, true);
    var message = { userName: username, message: content };
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(message));
}

function printMessage(message) {
    var username = message.userName;
    var content = message.message;

    var wrapperMessage = document.createElement('div');
    wrapperMessage.classList.add('message');
    wrapperMessage.classList.add(username === localStorage.getItem('username') ? 'send' : 'received');

    var spanName = document.createElement('span');
    spanName.classList.add('contact-name');
    spanName.textContent = username;

    var pContent = document.createElement('p');
    pContent.classList.add('contact-message');
    pContent.textContent = content;

    if (username !== localStorage.getItem('username')) {
        wrapperMessage.appendChild(spanName);
    }

    wrapperMessage.appendChild(pContent);

    document.querySelector('.messages-container').appendChild(wrapperMessage);
}

function printGroup(group) {
    var name = group.groupName;
    var groupId = group.groupId;

    var wrapperGroup = document.createElement('li');
    wrapperGroup.classList.add('contact');

    var imgGroup = document.createElement('img');
    imgGroup.classList.add('contact-image');
    imgGroup.src = 'imgs/person-1824147_640.png';

    var infoPanel = document.createElement('div');
    infoPanel.classList.add('contact-info');

    var titleName = document.createElement('h4');
    titleName.classList.add('contact-name');
    titleName.textContent = name;

    wrapperGroup.appendChild(imgGroup);
    wrapperGroup.appendChild(infoPanel);

    infoPanel.appendChild(titleName);

    wrapperGroup.addEventListener('click', function () {
        document.querySelector('.talks-container .header').textContent = name;
        clearMessages();
        showMessages(groupId);
    });

    document.querySelector('.contact-list').appendChild(wrapperGroup);
}

function closeLogin() {
    document.querySelector('#login-container').style.display = 'none';
    document.querySelector('#main-container').style.display = 'block';
}

function registerUser(username) {
    localStorage.setItem('username', username);

    document.querySelector('#btn-logged-user').textContent = '(' + username + ')';
    document.querySelector('#btn-logged-user').style.display = 'inline-block';
    document.querySelector('#btn-login').style.display = 'none';
    document.querySelector('#btn-logout').style.display = 'inline-block';
    document.querySelector('.btn-create-group').style.display = 'block';

    closeLogin();
    clearGroups();
    fetchGroups();
    hideMessages()
}

window.onload = startup;