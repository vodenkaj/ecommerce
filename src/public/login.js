const email = document.getElementById('email');
const password = document.getElementById('password');
const isLogin = document.getElementById('login') != null;

let lastChange = 0;
let focused = false;
let checked = false;
let isValid = false;

if (!isLogin) {
    email.onkeyup = (e => {
        lastChange = performance.now();
        checked = false;
    })
    
    email.onfocus = e => {
        focused = true;
        checkEmail();
    }
    email.onblur = e => focused = false;
}

function checkEmail() {
    if (performance.now() - lastChange > 1000 && !checked) {
        $.ajax({
            method: 'POST',
            url: '/api/check_email',
            data: {value: email.value},
            success: res => {
                isValid = true
                email.classList.remove('wrong-credentials');
            },
            error: res => {
                isValid = false
                if (!email.classList.contains('wrong-credentials'))
                    email.classList.add('wrong-credentials');
            }
        })
        checked = true;
    }
    if (focused) setTimeout(checkEmail, 1000)
}

$('#auth').submit(() => {
	if (isLogin)
		$.ajax({
			method: 'POST',
			url: '/account/login',
			data: {email: email.value, password: password.value},
			success: res => window.location.href = res,
			error: document.getElementById('login-invalid').style.visibility = 'visible'
		})
	else if(isValid)
		$.ajax({
			method: 'POST',
			url: '/account/register',
			data: {first_name: first_name.value, last_name: last_name.value, email: email.value, password: password.value},
			success: res => window.location.href = res,
			error: console.log('worng')
		});
	return false;
})