// Token Storage
window.obtain_token = ()=>{
    return new Promise(resolve=>{
        let session = sessionStorage.getItem("token")
        if (session != null){
            resolve(session)
        }else{
            fetch(window.api.obtain).then(response=>{
                return response.json()
            }).then(data=>{
                sessionStorage.setItem("token", data.token);
                resolve(sessionStorage.getItem("token"))
            });
        }
    });
}

window.getCookie = name => {
  if (!document.cookie) {
    return null;
  }

  const xsrfCookies = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(name + '='));

  if (xsrfCookies.length === 0) {
    return null;
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}

window.dark_theme = 'theme-dark';

window.toggle_dark_mode = (do_nothing) => {
    let theme = localStorage.getItem('theme');
    let body = document.querySelector("body");
    if(theme === null){
        if(!do_nothing){
            body.classList.add(window.dark_theme);
            localStorage.setItem('theme', window.dark_theme);
        }else{
            body.classList.remove("theme-dark");
            return 'Dark Mode';
        }
        return 'Light Mode';
    }else{
        if(!do_nothing){
            body.classList.remove("theme-dark");
            localStorage.removeItem('theme');
        }else{
            body.classList.add(window.dark_theme);
            return 'Light Mode';
        }
        return 'Dark Mode';
    }
}

window.apply_settings = ()=>{
    let toggle_button = document.querySelector("#toggle-dark-mode");

    toggle_button.innerText = window.toggle_dark_mode(true);
    toggle_button.onclick = function(e){
       e.target.innerText = window.toggle_dark_mode(false);
    }
}

apply_settings();