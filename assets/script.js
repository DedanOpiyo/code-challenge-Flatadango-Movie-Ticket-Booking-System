// assets/script.js

document.addEventListener("DOMContentLoaded", () => {
    const confirmationDiv = document.querySelector('#confirmationDiv');
    
    const mainDivOfListOfMovies = document.querySelector('main #listOfMovies'); // Select the div with the id 'listOfMovies' inside the 'main' element
    const mainDivMoviePosterImg = document.querySelector('#posterImg');
    
    const title = document.querySelector('main #movieTitle');
    const runtime = document.querySelector('#movieRuntime');
    const description = document.querySelector('#movieDescription');
    const showtime = document.querySelector('#showTime');
    
    const remainingTickets = document.querySelector('#remainingTicketsCapacity');
    const buyTickets_Btn = document.querySelector('#buyTicketsBtn');
 
    let moviesDeleteBtn;
    console.log('moviesDeleteBtn', moviesDeleteBtn)

    // GET
    let deleteMovie;
    
    // Fetch mock data from db.json
    fetch('http://localhost:3000/films')
    .then(res => res.json()).then(filmdata => {
        for (let film of filmdata) { 
            console.log('TYPE OF FILM', film.title)
            const divListOfMovies = document.createElement('div'); // Create Film List.
            divListOfMovies.id = `${film.id}`; // assign respective Film ids to the created divs that hold them.
            
            let movieTitlesInUppercase = film.title; 
            divListOfMovies.innerText = movieTitlesInUppercase.toUpperCase() // Put title in the Film List.
            
            moviesDeleteBtn = document.createElement('button'); // Create Delete Btn for the Films.
            moviesDeleteBtn.id = `${film.id}`;
            moviesDeleteBtn.innerText = 'Delete';
            
            mainDivOfListOfMovies.appendChild(divListOfMovies);
            divListOfMovies.appendChild(moviesDeleteBtn);

            // Event to the Film List Delete Btn.
            moviesDeleteBtn.onclick = (event) => {
                confirmDeletion (film)
                deleteMovie = function deleteMovie(chosenOption) {
                    if (chosenOption == 'cancel') {
                        showFilmDetails(event, film) // Call showFilmDetails Function.
                    } else if (chosenOption == 'delete') {
                        divListOfMovies.remove()
                        deleteFromServer(event)
                        showFilmDetails(event, 'delete') // Call showFilmDetails Function.
                    }
                }
            };

            divListOfMovies.addEventListener('click', (event) => {
                event.preventDefault();         
                showFilmDetails(event, film) // Call showFilmDetails Function.
            })
        }
    })
    .catch(error => console.log(error))

 
    function confirmDeletion (film) {
        let deleteConfirmation = document.createElement('div');
        deleteConfirmation.id = 'deleteConfirmation';
        let holdConfirmationBtnsAndMessage = document.createElement('div');
        holdConfirmationBtnsAndMessage.id = 'holdConfirmationBtnsAndMessage';
        let confirmationMessage = document.createElement('div');
        confirmationMessage.id = 'confirmationMessage';
        confirmationMessage.innerText = `Are you sure you want to delete: ${film.title}`;
        let holdConfirmationBtns = document.createElement('div');
        holdConfirmationBtns.id = 'holdConfirmationBtns';
        let confirmButton = document.createElement('button');
        confirmButton.id = 'confirmButton';
        confirmButton.innerText = 'confirm';
        let cancelButton = document.createElement('button');
        cancelButton.id = 'cancelButton';
        cancelButton.innerText = 'cancel';
        
        holdConfirmationBtns.appendChild(cancelButton);
        holdConfirmationBtns.appendChild(confirmButton);

        holdConfirmationBtnsAndMessage.appendChild(confirmationMessage);
        holdConfirmationBtnsAndMessage.appendChild(holdConfirmationBtns);

        deleteConfirmation.appendChild(holdConfirmationBtnsAndMessage);

        confirmationDiv.appendChild(deleteConfirmation)

        cancelButton.onclick = () => {
            deleteMovie('cancel')
            deleteConfirmation.remove()
        }
        confirmButton.onclick = () => {
            deleteMovie('delete')
            deleteConfirmation.remove()
        }
    }

    // DELETE

    function deleteFromServer(event) {
        fetch(`http://localhost:3000/films/${event.target.id}`, {method: 'DELETE'})
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to delete movie, status: ${response.status}`);
            }
            response.json() 
        })
        .then(() => {
            alert('Film deleted from the database')
        })
        .catch(error => console.error('An error occured while deleting the movie', error))
    }

    function showFilmDetails(event, film) {
        console.log(event.target)
        console.log('SHOWDETAILS 2ND ARGUMENT:', film)

        mainDivMoviePosterImg.src = film.poster;
        
        if (film === 'delete') {
            mainDivMoviePosterImg.src = '';

            title.innerText = 'Deleted';
            runtime.innerText = 'Deleted';
            description.innerText = 'Deleted';
            showtime.innerText = 'Deleted';
            
            remainingTickets.innerText = '[Deleted]';
        }
        
        // Show Buy Ticket Interface.
        title.innerText = film.title;
        runtime.innerText = film.runtime;
        description.innerText = film.description;
        showtime.innerText = film.showtime;
        
        let ticketsRemaining = film.capacity - film.tickets_sold;
        let trackInitialTickets = ticketsRemaining // keep track of initial ticketsRemaining.
        console.log('III', ticketsRemaining)

        // before we can update the ui, terminate sold out films.
        if (availableTickets <= 0) {
            return;
        }
        document.getElementById('remainingTicketsCapacity').textContent = ticketsRemaining; // update ui

        if (ticketsRemaining <= 0) {
            buyTickets_Btn.disabled = true;
            buyTickets_Btn.textContent = "Sold Out";
            event.target.setAttribute('class', 'Sold Out')
            return;
        } else  {
            buyTickets_Btn.disabled = false;
            buyTickets_Btn.textContent = "Buy Ticket";
            buyTickets_Btn.addEventListener('click', (e) => {
                e.preventDefault();
                ticketsRemaining-=1

                if (ticketsRemaining === 0) {
                    buyTickets_Btn.disabled = true;
                    buyTickets_Btn.textContent = "Sold Out";
                    event.target.setAttribute('class', 'Sold Out') // update film list class attribute to sold out.
                } else {
                    document.getElementById('remainingTicketsCapacity').textContent = ticketsRemaining; // while waiting to persist final changes, update the ui
                }
                

                setTimeout(() => {
                    let difference = trackInitialTickets - ticketsRemaining // after 5 seconds, get the final remaining tickets which will be persisted using patch.
                    console.log('difference', difference)
                    buyTickets(event, film, difference) // call PATCH- function
                    postTicketPurchase(film, difference)   // call POST- function with The number of tickets bought.
                }, 5000); 

                console.log('BUT TICKETS BTN CLICKED:', film)      
            })
        }      
    }

    // PATCH

    function buyTickets(event, film, difference) {
        const filmTicketsSold = film.tickets_sold + difference
        let configurationObj = {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "tickets_sold": filmTicketsSold
            })
        }
        fetch(`http://localhost:3000/films/${film.id}`, configurationObj)
        .then(res => res.json())
        .then(data => {
            showFilmDetails(event, data); // Data is an object. Event is persistently passed along foe updating the ui/film list.
        })
        .catch((error) => console.error('Error Updating Film', error))
        
    }

    // POST

    // Post a ticket purchase
    async function postTicketPurchase(film, difference) {
        let configurationObj = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                film_id: film.id,
                number_of_tickets: difference 
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

