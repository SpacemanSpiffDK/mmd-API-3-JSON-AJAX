// JS by Dan Høegh
// UCN MMD 2021

// This code is for educational purposes
// All code decision are based on the current level of the students

// Wiki URL
// https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=

let showItemAmount = 5; // global variable!

initSearchTool(); // call initSearchTool()

function initSearchTool(){
    // add eventlistener to search button, look for CLICK on the button
    document.querySelector("#searchButton").addEventListener("click", function(){
        doSearch();
    });

    // add on key up listener to search input, look for ENTER (keyCode 13) in the input field
    document.querySelector("#searchInput").addEventListener("keyup", function(event){
        // console.log(event); // output the event to log to see what you can do with it
        if (event.keyCode == 13){
            doSearch();
        }
    });

    // add eventlistener to search result amount select, look for any CHANGE in the dropdown
    document.querySelector("#resultAmountSelector").addEventListener("change", function(){
        showItemAmount = this.value; // assign a new value to showItemAmount, take value from the selected option in the dropdown
        doSearch();
    });
}

function doSearch(){
    const searchTerm = document.querySelector("#searchInput").value.trim(); // Get search term from input
    // check if searchterm is empty or just spaces
    if (searchTerm != ""){
        setSpinner(true); // Turn on the spinner: call setSpinner with the parameter - true - so we're revealing the spinner
        resultsClear(); // clear the results div
        getDataWiki(searchTerm); // call the getDataWiki function, add searchTerm as parameter
    }
}

// spinner function, activate if parameter is true, deactivate if parameter is false
function setSpinner(isActive){
	const spinner = document.querySelector("#searchSpinner"); // find the HTML element in DOM and assign that value to spinner
	if (isActive){
		// if parameter true, activate spinner
		spinner.classList.add("active");
	} else {
		// if parameter false (actually "if parameter is not true"), deactivate spinner
		spinner.classList.remove("active");
	}
}

function resultsClear(){
	// delete all content in the #searchResults div
	document.querySelector("#searchResult").innerHTML = "";
}

function getDataWiki(searchTerm){
    fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=${showItemAmount}&srsearch=${searchTerm}`) 
        .then(response => {
            if (!response.ok) { // test error handling by using the url: "http://httpstat.us/500" in fetch() above
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => outputResult(data))
        .catch(error => {
            errorMessage(`<span class="errorMsg">${error}</span>`); // If there's an error, the user is notified
        });
}

// turn off spinner and output a nice error message in search result div
function errorMessage(message){
    setSpinner(false); // call setSpinner with the parameter - false - so we're hiding the spinner
    document.querySelector("#searchResult").innerHTML = `<p class="errorMsg">${message}</p>`; // replace innerHTML of search result div with the error message
}

function outputResult(data){
    setSpinner(false); // call setSpinner with the parameter - false - so we're hiding the spinner
    // template result count information and the result list

    // console.log("outputResult - data: ");                // uncomment this line to see what's inside the data object
	// console.log(data);                                   // uncomment this line to see what's inside the data object
    // console.log("outputResult - data.query.search: ");   // uncomment this line to see what's inside the data.query.search object
    // console.log(data.query.search);                      // uncomment this line to see what's inside the data.query.search object

    const result = `
        <div id="resultCount">
            ${data.query.searchinfo.totalhits} articles found, 
            showing the first ${showItemAmount}
        </div>
        ${listResults(data.query.search)}
    `;
    document.querySelector("#searchResult").innerHTML = result; // write the template in the HTML DOM
}

function listResults(results){
    // console.log(results); // log results to console if you want to see what the JSON object looks like
    let itemList = ""; // initialize an empty itemList string
    // loop through results array in the JSON object
    for (let i=0; i < results.length; i++){
        let item = results[i]; // assign current item object to the item variable
		itemList += 
		`<a class="article" target="_blank" href="https://en.wikipedia.org/?curid=${item.pageid}">
                <h4>${item.title} (#${i+1})</h4>
                <p>
                    ${item.snippet} <br/>
                </p>
            </a>`;
    }
    return itemList; // return the finished itemList string
}