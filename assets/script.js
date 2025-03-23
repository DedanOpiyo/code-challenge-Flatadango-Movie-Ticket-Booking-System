// assets/script.js

document.addEventListener("DOMContentLoaded", () => {
    console.log("Welcome to Flatadango!");
  
    //const documentBody = document.body;
    const mainDiv = document.querySelector('main');
    const confirmationDiv = document.querySelector('#confirmationDiv');
    
    const mainDivOfListOfMovies = document.querySelector('main #listOfMovies'); // Select the div with the id 'listOfMovies' inside the 'main' element
    const mainDivMoviePosterImg = document.querySelector('#posterImg');
    
    const title = document.querySelector('main #movieTitle');
    const runtime = document.querySelector('#movieRuntime');
    const description = document.querySelector('#movieDescription');
    const showtime = document.querySelector('#showTime');
    const remainingTickets = document.querySelector('#remainingTicketsCapacity');
    //const movieDescriptionHolder = document.querySelector('main #availableTickets');
    const buyTickets_Btn = document.querySelector('#buyTicketsBtn');
    
    let divListOfMoviesData = []; 
    //let StoreRemainingTickets;
    let newNumberOfTicketsSold;
    let moviesDeleteBtn;
    console.log('moviesDeleteBtn', moviesDeleteBtn)

    // GET
    
    // Fetch mock data from db.json
    fetch('http://localhost:3000/films')
    .then(res => res.json()).then(filmdata => {
        console.log('filmdata', filmdata)
        holdIteratedMemberOf_FetchedFilmdata = filmdata // update holdIteratedMemberOf_FetchedFilmdata with iterated member, and use it to call deleteMovieBothFromListandFromServer function.
        doSomethingWithFilmdataFromBacken(filmdata)
    })
    .catch(error => console.log(error))

    function doSomethingWithFilmdataFromBacken(filmdata) {
        // iterate over filmdata from the backend.
        for (let member of filmdata) { 
            console.log(member.title)
            const divListOfMovies = document.createElement('div'); // create div for each of the movies.
            divListOfMovies.id = `${member.id}`; // assign respective movie ids to the created divs that hold them.
            let movieTitlesInUppercase = member.title; // store in the variable to make it possible to change to uppercase.
            divListOfMovies.innerText = movieTitlesInUppercase.toUpperCase()
            console.log(divListOfMovies)
            divListOfMoviesData.push(divListOfMovies);
            
            moviesDeleteBtn = document.createElement('button');
            moviesDeleteBtn.id = `${member.id}`;
            moviesDeleteBtn.innerText = 'Delete';
            moviesDeleteBtn.onclick = (event) => { // since we are not able to add 'click' event directly to moviesDeleteBtn outside this scope, lets add the oncklick attribute and call our delete function.
                // call deleteMovieBothFromListandFromServer and immediately call confirmDeletion.
                const confirmDeletion = deleteMovieBothFromListandFromServer(event, moviesDeleteBtn.id) // pass event listener and button id to our delete function.
                confirmDeletion('start')
                //mainDiv.style.display =  'none';
                //RmainDiv.style.opacity =  '20%';
            };

            mainDivOfListOfMovies.appendChild(divListOfMovies);
            divListOfMovies.appendChild(moviesDeleteBtn);
            
            // const moviePosterFunctionHolder = (function createClosureForMember(member) {
            //     return function workOnMoviePoster(member) {
            // }) (member)

            // return moviePosterFunctionHolder;
            function createClosureForMember(member) {
                divListOfMovies.addEventListener('click', (event) => {
                    event.preventDefault();

                    console.log('list member clicked:', member.poster)
 
                    let memberURL = member.poster;
                    mainDivMoviePosterImg.src = memberURL;
                    //mainDivMoviePosterImg.style.display = 'block';

                    title.innerText = member.title;
                    runtime.innerText = member.runtime;
                    description.innerText = member.description;
                    showtime.innerText = member.showtime;
                    let StoreRemainingTickets = member.capacity - member.tickets_sold;
                    console.log('AT GET', member.capacity)
                    console.log('AT GET', member.tickets_sold)
                    if (StoreRemainingTickets >= 0) {
                        remainingTickets.innerText = StoreRemainingTickets;
                    } else {
                        console.log('AT GET, remainingTickets CANNOT BE LESS THAN O');
                    }

                    reflectRemainingTickets(member, StoreRemainingTickets); // Try other solutions/alternatives to this approach


                })
            }
            createClosureForMember(member)
        }
    }

    // DELETE
    
    // The function below returns a function, that creates CONFIRMATION buttons which when clicked, calls the returned function with parameters that determine whether 
    // the user really meant to delete the movie or not.
    function deleteMovieBothFromListandFromServer(event, moviesDeleteBtnId) { // deleteMovieBothFromListandFromServer is called from moviesDeleteBtn, a button placed besides list of movies.
        //event.preventDefault(); // not strictly necessary in this case.
        function confirmDeletion (clickedChoice) {
            let deleteConfirmation = document.createElement('div');
            deleteConfirmation.id = 'deleteConfirmation';
            let holdConfirmationBtnsAndMessage = document.createElement('div');
            holdConfirmationBtnsAndMessage.id = 'holdConfirmationBtnsAndMessage';
            let confirmationMessage = document.createElement('div');
            confirmationMessage.id = 'confirmationMessage';
            confirmationMessage.innerText = 'Are you sure you want to delete';
            let holdConfirmationBtns = document.createElement('div');
            holdConfirmationBtns.id = 'holdConfirmationBtns';
            let confirmButton = document.createElement('button');
            confirmButton.id = 'confirmButton';
            confirmButton.innerText = 'confirm';
            let cancelButton = document.createElement('button');
            cancelButton.id = 'cancelButton';
            cancelButton.innerText = 'cancel';
            cancelButton.onclick = () => {
                confirmDeletion('cancelit')
                //RmainDiv.style.display =  'flex';
            }

            confirmButton.onclick = () => {
                confirmDeletion('deleteit')
                //RmainDiv.style.display =  'flex';
            }

            holdConfirmationBtns.appendChild(cancelButton);
            holdConfirmationBtns.appendChild(confirmButton);

            holdConfirmationBtnsAndMessage.appendChild(confirmationMessage);
            holdConfirmationBtnsAndMessage.appendChild(holdConfirmationBtns);

            deleteConfirmation.appendChild(holdConfirmationBtnsAndMessage);

            confirmationDiv.appendChild(deleteConfirmation)
            
            if (clickedChoice === 'cancelit') {
                console.log(`The 2nd button (cancelButton), has been clicked.`)
                alert('You canceled Deletion');
                const hideDeleteConfirmation = document.getElementById('deleteConfirmation')
                hideDeleteConfirmation.style.display = 'none'
                return;
            } else if (clickedChoice === 'deleteit') {
                console.log(`The 2nd button (cancelButton), has been clicked.`)
                continueExecution(event, moviesDeleteBtnId)
            } else {
                
                console.log(`The 1st button (confirmButton), has been clicked.`)
                console.log(`Any applicable logic can be added here following different clickedChoice's parameter value in this fumction`)
            }
        }

        return confirmDeletion
    }
    
    // After Confirmation, CONTINUE with the deletion process.
    function continueExecution(event, moviesDeleteBtnId) { // continueExecution function is called in confirmDeletion, a function returned from deleteMovieBothFromListandFromServer. 
        console.log('event.target:-', event.target)
        console.log('event.target.id:', event.target.id)
        console.log('button id passed during creation:-', moviesDeleteBtnId)
        console.log('id of divListOfMovies(buttons parent), created simultanously to the button:-', moviesDeleteBtnId)
        console.log('divListOfMovies data', divListOfMoviesData)
        console.log(`div#${event.target.id}`)
        
        // Iterate over divListOfMoviesData, comparing the id's of existing movie list divs to that of clicked button. If there is a match, send Delete request. Remove movie list from the DOM.
        divListOfMoviesData.forEach((divList) => {
            let eventTargetId = event.target.id
            console.log('eventTargetId:-', eventTargetId)
            console.log('Iterated divList.id:-', divList.id)
            if (eventTargetId === divList.id) {
                console.log(`sending delete request to http://localhost:3000/films/${event.target.id}`)
                
                fetch(`http://localhost:3000/films/${event.target.id}`, {method: 'DELETE'})
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to delete movie, status: ${response.status}`);
                    }
                    response.json() //
                    //  return response.json()? parse the response.
                })
                .then(data => {
                    console.log('movie deleted succesfully', data)
                    //alert(`${data.title}, successfully deleted from the server.`)
                })
                .catch(error => console.error('An error occured while deleting the movie', error))

                let eventTargetParget = event.target.parentElement // Get the parent of the button(moviesDeleteBtn).
                console.log('eventTargetParent:-', eventTargetParget)
                eventTargetParget.remove() // Delete the parent element. This will also delete moviesDeleteBtn.
            }
        })
    }


    // PATCH

    function reflectRemainingTickets(member, remainingTickets) { // whwn called from divListOfMovies click event, StoreRemainingTickets passed and will be accessible through remainingTickets
        let StoreRemainingTickets = remainingTickets // we translate the StoreRemainingTickets again in this scope. Its the difference of member.capacity and member.tickets_sold.
        
        //Rconsole.log('AT PATCH', StoreRemainingTickets)
        if (StoreRemainingTickets >= 0) {
            remainingTickets.innerText = StoreRemainingTickets;
        } else {
            console.log('AT GET, remainingTickets CANNOT BE LESS THAN O');
        }

        //remainingTickets.innerText = StoreRemainingTickets; // lets optionally reflect the remaining tickets from this function for a second time, before click event.
        
        if (StoreRemainingTickets === 0) {
            buyTickets_Btn.innerText = 'Sold Out';
            return;
        } else {
            buyTickets_Btn.innerText = 'Buy Ticket'; 
        }

        // Again, lets unpack our StoreRemainingTickets:
        //Rconst unchangedNumberOfTicketsSold = member.tickets_sold;
        newNumberOfTicketsSold = member.tickets_sold; // Reflect the newNumberOfTicketsSold before the click event.
        console.log('AT PATCH BEFORE NUY BTN newNumberOfTicketsSold ', newNumberOfTicketsSold)
        
        buyTickets_Btn.addEventListener('click', () => {
            //e.preventDefault();
            
            newNumberOfTicketsSold += 1; // Increase the newNumberOfTicketsSold by 1 if buyTickets_Btn is clicked.
            console.log('AT PATCH AFTER BUY BTN', newNumberOfTicketsSold)
            
            //RStoreRemainingTickets = newNumberOfTicketsSold - unchangedNumberOfTicketsSold; //
            //RremainingTickets.innerText = StoreRemainingTickets; // lets update remaining tickets for the last time, each time buyTickets_Btn is clicked.

            console.log(member.id)
            if (StoreRemainingTickets === 0) {
                console.log('Sorry, No more tickets available!');
                alert(`All the ${member.title} tickets are sold out! Check another movie instead.`);
                return;
            }
            let configurationObj = {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "tickets_sold": newNumberOfTicketsSold // Use the current newNumberOfTicketsSold to make update request. 
                })
            }
            fetch(`http://localhost:3000/films/${member.id}`, configurationObj)
            .then(res => res.json())
            .then(data => {
                console.log('data from server after patch:', data)
                if (member.id === data.id) { // no need of comparing id's in this update approach.
                    //StoreRemainingTickets = data.capacity - data.tickets_sold;
                    //remainingTickets.innerText = StoreRemainingTickets;
                    if (StoreRemainingTickets >= 0) {
                        const StoreRemainingTickets_final = data.capacity - data.tickets_sold; // UPDATE StoreRemainingTickets LAST TIME, with details from server.
                        remainingTickets.innerText = StoreRemainingTickets_final;
                        console.log('DEBUG PATCH remainingTickets.innerText', StoreRemainingTickets_final)
    
                        postTicketPurchase(data, newNumberOfTicketsSold); // Pass newNumberOfTicketsSold alongside member when calling postTicketPurchase function.
                    } else {
                        console.log('AT PATCH, remainingTickets CANNOT BE LESS THAN O');
                    }
                } else {
                    console.log('It seems movie id from closure does not match that of the current movie in display.')
                }
                console.log('DEBUG PATCH', data)
                console.log('DEBUG PATCH', typeof data)
                console.log('DEBUG PATCH', data.tickets_sold)
            })
            .catch((error) => console.error('Error Updating Film', error))

            postTicketPurchase(member, newNumberOfTicketsSold); // Pass newNumberOfTicketsSold alongside member when calling postTicketPurchase function.
        })
    }

    
    // POST

    // Post a ticket purchase
    async function postTicketPurchase(member, newNumberOfTicketsSold) {
        const filmId = member.id;
        const numberOfTickets = newNumberOfTicketsSold - member.tickets_sold;
        let configurationObj = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                film_id: filmId,
                number_of_tickets: numberOfTickets 
            })
        }

        fetch(`http://localhost:3000/tickets`, configurationObj)
        .then(res => res.json())
        .then(data => {
            console.log('data from server after Post:', data)
        })
        .catch((error) => console.error('Error Posting Ticket Purchase', error))
    }
});


