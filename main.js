
const btn = document.getElementById("btn");
const container = document.getElementById("items");

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
    container.innerHTML = "";
    data.forEach( function(item)  {
        const anLi = document.createElement('li');
        anLi.setAttribute('class','list-group-item');
        anLi.innerHTML = `<a class="repo-detail" href="${item.url}" target="_blank">${item.name}</a>`;
        anLi.addEventListener('click', function(linkLi) {
            linkLi.preventDefault();
            getRepoTitle(item);
            getContributors(item);
        });
        container.appendChild(anLi); 
    });
}

/*
    GetRepoTitle prints repo name and insert it in Contributors column as a repo title
*/
function getRepoTitle(repo) {
    const repoName = document.querySelector("#repo-name");
    repoName.innerHTML = repo.name;
    document.querySelector("#title-contrib").innerHTML = "Contributors";
}

/*
    GetContributors call fetchJSONData() to fetch all contributors of the selected repo
*/
function getContributors(link) {
    const contributorsLink = link.url + '/contributors'
    fetchJSONData(contributorsLink, function(contributorsList) {
        renderContributors(contributorsList);
    });
}

// set attributes of <a>
function fixA(elem, target, href ) {
    elem.setAttribute('target','_blank');
    elem.setAttribute('href', href);
}

// set attributes of <img>
function fixImg(elem, src, elemClass, width, title) {
    elem.setAttribute('src', src);
    elem.setAttribute('class', elemClass);
    elem.setAttribute('width', width);
    elem.setAttribute('title', title);
}

/*
    RenderContributors prints all contributors of the selected repo
*/
function renderContributors(cList) {
    const contributors = document.querySelector('#contributors');
    contributors.innerHTML = "";
    contributors.setAttribute('class','list-group list-group-flush');
    console.log("Contributors ", cList);
    cList.forEach( function(cItem) {
        const li = document.createElement('li');
        li.setAttribute('class','list-group-item');
        const conImg = document.createElement('img');
        fixImg(conImg, cItem.avatar_url, 'rounded mr-3', '75px', cItem.login);
        const a = document.createElement('a');
        fixA(a,"_blank", cItem.html_url);
        const contribName = document.createTextNode(cItem.login);
        a.appendChild(contribName);
        li.appendChild(conImg);
        li.appendChild(a);
        contributors.appendChild(li);
    });
}

/*  getItemsInData().
    This function gets JSON data returned by fetchJSONData() as an argument and return only items[] out of the array
*/

function getItemsInData(searchData) {
    let output = "";
    for (let items in searchData) {
        output += searchData.items;
    }
    return output; 
}






/*  validateJSONData()
    This function show error message to user if no record is found against the searched query
*/

function validateJSONData(ValData) {
    console.log("ValData Length", ValData);
    if(ValData.total_count === 0) {
        const errorMessage = '<div class="alert alert-danger" role="alert">No repository was found for this search term.</div>';
        container.innerHTML = errorMessage;

    } else {
        const searchedData = ValData.items.filter(getItemsInData);
        getRepoNames(searchedData);
        console.log("JSON DATA ", searchedData);
    };
}


/*
    Calling fetchJSONData when a user clicks search button
*/

btn.addEventListener('click', function() {
    const elemInput = document.querySelector('.user-input');
    let userInput = elemInput.value;
    const searchQuery = 'https://api.github.com/search/repositories?q=user:HackYourFuture+' + userInput;
    fetchJSONData(searchQuery, function(repoList) {
        validateJSONData(repoList);
    });  
});