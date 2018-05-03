
let btn = document.getElementById("btn");

function fetchJSONData(url, callbackFn) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
        const data = JSON.parse(xhr.responseText);
        callbackFn(data);
    });
    xhr.open('GET', url);
    xhr.send();
}

function getRepoNames( data ) {

    const container = document.getElementById("items");
    let render_li = "";
    data.forEach( function(item)  {
        render_li += `<li class="list-group-item"><a href="${item.html_url}" target="_blank">${item.name}</a></li>`; 
    });
    container.innerHTML = render_li;
    btn.innerHTML = "JSON data loaded";

}

function getSearchedData(searchData) {
    let output = "";
    for (let items in searchData) {
        output += searchData.items;
    }
    return output; 
}

btn.addEventListener('click', function() {
    const elemInput = document.querySelector('.user-input');
    let userInput = elemInput.value;
    const searchQuery = 'https://api.github.com/search/repositories?q=user:HackYourFuture+' + userInput;
    fetchJSONData(searchQuery, function(repoList) {
        const searchedData = repoList.items.filter(getSearchedData);
        getRepoNames(searchedData);
    });  
});