const search_form = document.forms.search_form;
const lang_list = {"C":"c","C++":"cpp", "C#":"csharp", "CSS":"css", "Go":"go", "Python":"python", "Haskell":"haskell", "HTML": "html", "Java":"java", "JavaScript":"javascript", "Kotlin":"kotlin", "Lua": "lua", "PHP":"php", "R":"r", "Swift":"swift", "Jupyter Notebook": "jupyter", "Ruby":"ruby", "TypeScript": "typescript", "Scala":"scala"}

function request(link){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", link, false);
    xhr.send();
    return JSON.parse(xhr.responseText)
}

function submitSearchForm(event) {
    let repos_elements = document.querySelector(".repos-elements")
    repos_elements.innerHTML = ""
    event.preventDefault();
    getGitHubInfo(search_form.querySelector(".search").value)
}

search_form.addEventListener("submit", submitSearchForm);

function getGitHubInfo(username){
    const response = request(`https://api.github.com/search/users?q=${username}`)
    if (response["total_count"]===0){
        alert("User not found")
    } else {
        const login = response["items"][0]["login"]
        const profile_photo = response["items"][0]["avatar_url"]
        const profile_url = response["items"][0]["html_url"]
        const repos = request(response["items"][0]["repos_url"])
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
    repo_text.innerHTML = ('Repositories')

    let repos_elements = document.querySelector(".repos-elements")
    for (let i = 1; i < info.repos.length; i++){
        let lang = info.repos[i]["language"] ?? Object.keys(request(info.repos[i]["languages_url"]))[0] ?? ""
        let logoPath = "img/logos/none.png"
        if (Object.keys(lang_list).includes(lang)){
            logoPath = `img/logos/${lang_list[lang]}.png`
        }
        let name = info.repos[i]["name"]
        let url = info.repos[i]["html_url"]
        repos_elements.innerHTML += (
            `
            <a href="${url}" class="repo" target="_blank">
            <img src="${logoPath}" alt="">
            <ol>
            <li>${name}</li>
            <li class="lang">${lang}</li>
            </ol>
            </a>
            `
        )
    }
}