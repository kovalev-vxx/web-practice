const search_form = document.forms.search_form;

function submitSearchForm(event) {
    var repos_elements = document.querySelector(".repos-elements")
    repos_elements.innerHTML = ""
    event.preventDefault();
    findUser(search_form.querySelector(".search").value)
}

search_form.addEventListener("submit", submitSearchForm);

function findUser(username){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.github.com/search/users?q=" + username, false);
    xhr.send();
    const response = JSON.parse(xhr.responseText)
    getGitHubInfo(response)
    console.log(response)
    return response
}

function getReposList(link){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", link, false);
    xhr.send();
    return JSON.parse(xhr.responseText)
}

function getGitHubInfo(json_api){
    if (json_api["total_count"]===0){
        alert("User not found")
    } else {
        const login = json_api["items"][0]["login"]
        const profile_photo = json_api["items"][0]["avatar_url"]
        const profile_url = json_api["items"][0]["html_url"]
        const repos = getReposList(json_api["items"][0]["repos_url"])
        const info = {login: login, photo: profile_photo, url: profile_url, repos: repos}
        draw(info)
        return(info)
    }
}

function draw(info) {
    let profile = document.querySelector(".profile")
    profile.innerHTML = ('<img src="'+ info.photo + '" alt="" class="avatar"><h1>'+ info.login +'</h1>')
    profile.href = info.url

    let repo_text = document.querySelector(".repos h3")
    repo_text.innerHTML = ('<h3>Repositories</h3>')

    var repos_elements = document.querySelector(".repos-elements")
    let lang_list = {"C":"c","C++":"cpp", "C#":"csharp", "CSS":"css", "Go":"go", "Python":"python", "Haskell":"haskell", "HTML": "html", "Java":"java", "JavaScript":"javascript", "Kotlin":"kotlin", "Lua": "lua", "Php":"php", "R":"r", "Swift":"swift", "Jupyter Notebook": "jupyter"}
    for (var i = 1; i < info.repos.length; i++){
        let lang = info.repos[i]["language"] ?? ""
        let logoPath = "img/logos/none.png"
        if (Object.keys(lang_list).includes(lang)){
            logoPath = `img/logos/${lang_list[lang]}.png`
        }
        let name = info.repos[i]["name"]
        let url = info.repos[i]["html_url"]
        repos_elements.innerHTML += (
            `
            <a href="${url}" class="repo" target="_blank">
            <ol>
            <li>${name}</li>
            <li class="lang">${lang}</li>
            </ol>
            <img src="${logoPath}" alt="">
            </a>
            `
        )
    }
}

