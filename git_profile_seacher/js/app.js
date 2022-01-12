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
    const response = JSON.parse(xhr.responseText);
    return response
    // console.log(response);
    // for (var i = 0; i < response.length; i++){
    //     console.log(response[i])
    // }
}

function getGitHubInfo(json_api){
    const login = json_api["items"][0]["login"]
    const profile_photo = json_api["items"][0]["avatar_url"]
    const profile_url = json_api["items"][0]["html_url"]
    const repos = getReposList(json_api["items"][0]["repos_url"])
    const info = {login: login, photo: profile_photo, url: profile_url, repos: repos}
    draw(info)
    return(info)
}

function draw(info) {
    var profile = document.querySelector(".profile")
    profile.innerHTML = ('<img src="'+ info.photo + '" alt="" class="avatar"><h1>'+ info.login +'</h1>')
    profile.href = info.url

    var repo_text = document.querySelector(".repos h3")
    repo_text.innerHTML = ('<h3>Repositories</h3>')

    var repos_elements = document.querySelector(".repos-elements")
    for (var i = 1; i < info.repos.length; i++){
        repos_elements.innerHTML += ('<a href="'+info.repos[i]["html_url"]+'" class="repo" target="_blank">' +
            '<ol><li>'+ info.repos[i]["name"]+'</li><li>'+ info.repos[i]["language"]+'</li>\n</ol>' +
            '</a>');
    }



}

