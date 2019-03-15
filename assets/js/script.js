// JS by Dan Høegh
// UCN MMD 2019

// This code is for educational purposes
// All code decision are based on the current level of the students

const showItemAmount = 5;

window.onload = function(){
    initSearchTool();
}

function getDataWiki(searchTerm){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // console.log(`readystatechange. readyState: ${this.readyState} status: ${this.status}`);
        // if we're ok, lets get the data
        if (this.readyState == 4 && this.status == 200) {
            // use try/catch to handle errors
            try {
                data = JSON.parse(this.responseText);
                outputResult(data);
            } catch (error){
                errorMessage(`Error parsing JSON: <span class="errorMsg">${error}</span>`);
            }
        }
        if (this.readyState == 4 && this.status > 400) {
            // there was an error, lets tell the user
            errorMessage("An error occured getting the data, please try again later");
        }
    };
    xhttp.open("GET", `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchTerm}`, true);
    xhttp.send();
}

function initSearchTool(){
    // add eventlistener to search button
    document.querySelector("#searchButton").addEventListener("click", function(){
        doSearch();
    });

    // add on key up listener to search input, look for ENTER
    document.querySelector("#searchInput").addEventListener("keyup", function(event){
        // console.log(event);
        if (event.keyCode == 13){
            doSearch();
        }
    });
}

function doSearch(){
    let searchTerm = document.querySelector("#searchInput").value.trim();
    if (searchTerm != ""){
        setSpinner(true);
        resultsClear();
        getDataWiki(searchTerm);
    }
}

function outputResult(data){
    setSpinner(false);
    let result = `
        <div id="resultCount">
            ${data.query.searchinfo.totalhits} articles found, 
            showing the first ${showItemAmount}
        </div>
        ${listResults(data.query.search)}
    `;
    document.querySelector("#searchResult").innerHTML = result;
}

function resultsClear(){
    document.querySelector("#searchResult").innerHTML = "";
}

function listResults(results){
    // console.log(results);
    let itemList = "";
    for (let i=0; i < results.length && i < showItemAmount; i++){
        let item = results[i];
        itemList += `
            <article>
                <h4>${item.title}</h4>
                <p>
                    ${item.snippet} <br/>
                    <a target="_blank" href="https://en.wikipedia.org/?curid=${item.pageid}">
                        Go to article
                    </a>
                </p>
            </article>
        `;
    }
    return itemList;
}

function setSpinner(active){
    const spinner = document.querySelector("#searchSpinner");
    if (active){
        spinner.classList.add("active");
    } else {
        spinner.classList.remove("active");
    }
}

function errorMessage(message){
    setSpinner(false);
    document.querySelector("#searchResult").innerHTML = `<p>${message}</p>`;
}