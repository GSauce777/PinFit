//Handles user name (localStorage) and the first-visit name prompt

const USER_NAME_KEY = 'pinfit_user_name';

function getUserName(){
    return localStorage.getItem(USER_NAME_KEY);
}

function setUserName(name){
    localStorage.setItem(USER_NAME_KEY, name);
    renderProfileInitial();
}

function renderProfileInitial(){
    const circle = document.getElementById('profileCircle');
    if(!circle) return;
    const name = getUserName();
    circle.textContent = name ? name.charAt(0).toUpperCase() : '';
    circle.title = name || '';
}

function showNameModal(){
    const modal = document.getElementById('nameModal');
    if(modal) modal.style.display = 'block';
    const input = document.getElementById('nameInput');
    if(input) input.focus();
}

function hideNameModal(){
    const modal = document.getElementById('nameModal');
    if(modal) modal.style.display = 'none';
}

function submitName(){
    const input = document.getElementById('nameInput');
    if(!input) return;
    const name = input.value.trim();
    if(!name) return;
    setUserName(name);
    hideNameModal();
}

document.addEventListener('DOMContentLoaded', () => {
    renderProfileInitial();

    if(!getUserName()){
        showNameModal();
    }

    const submitBtn = document.getElementById('nameSubmitBtn');
    if(submitBtn) submitBtn.addEventListener('click', submitName);

    const input = document.getElementById('nameInput');
    if(input){
        input.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') submitName();
        });
    }
});