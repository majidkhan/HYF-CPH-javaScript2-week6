
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
            getContributors(item);
        });
        container.appendChild(anLi); 
    });
    btn.innerHTML = "JSON data loaded";
}


function getContributors(link) {
    const contributorsLink = link.url + '/contributors'
    fetchJSONData(contributorsLink, function(contributorsList) {
        renderContributors(contributorsList);
    });
}

function renderContributors(rcb) {
    const contributors = document.querySelector('#contributors');
    contributors.innerHTML = "";
    contributors.setAttribute('class','list-group list-group-flush');
    const h2 = document.createElement('h2');
    const textH2 = document.createTextNode('Contributors');
    h2.appendChild(textH2);
    h2.setAttribute('class', 'mt-3');
    contributors.before(h2);
    console.log("RCB ", rcb);
    rcb.forEach( function(item) {
        const li = document.createElement('li');
        li.setAttribute('class','list-group-item');
        const conImg = document.createElement('img');
        conImg.src = item.avatar_url;
        conImg.setAttribute('class','rounded mr-3');
        conImg.setAttribute('width','75px');
        conImg.setAttribute('title',item.login);
        const span = document.createElement('span');
        const contribName = document.createTextNode(item.login);
        span.appendChild(contribName);
        li.appendChild(conImg);
        li.appendChild(span);
        contributors.appendChild(li);
    });
}

/*  validateJSONData().

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
//        const errorMessage = '<li class="text-danger">No repository was found for this search term.</li>';
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