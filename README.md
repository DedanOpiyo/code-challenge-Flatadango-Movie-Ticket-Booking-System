# Flatadango

This is a project that mimics a movie ticket booking application.

### Pjoject Goals
The primary goal of this project is to demonstrate ability to:

**Handle events**: Implement interactive features such as purchasing tickets and deleting films.

**Manipulate the DOM**: Dynamically display film details and update the UI in response to user interactions.

**Communicate with the server**: Use HTTP requests (GET, POST, PATCH, DELETE) to interact with the server and persist data such as ticket purchases and film deletions.

## File Structure
```
/code-challenge-Flatadango-Movie-Ticket-Booking-System
  ├── README.md             # Project description and instructions
  ├── index.html            # Main HTML file
  ├── /assets               # Folder to hold static files
      ├── script.js         # JavaScript file
      ├── style.css         # CSS file
  └── /data                 # Folder to hold mock data
      └── db.json           # Mock server data

```

- `index.html`: Main HTML structure
- `assets/script.js`: JavaScript file for app functionality
- `assets/style.css`: Styles for the app
- `data/db.json`: Mock data for the app

## Project Setup

1. Clone the repository. 
    Click the green Code button, and select SSH.
    Copy the SSH URL (it looks something like so: git@github.com:username/repository.git).
    Open your terminal and run the following command to clone the repository:

```bash
git clone git@github.com:username/repository.git
```
    Confirm that: username/repository -in the SSH URL conforms to your actual repository path.
2. Navigate to the project folder. By default it is `code-challenge-Flatadango-Movie-Ticket-Booking-System`, unless you changed the name while cloning the repository.
    To navigate run the command:
```bash
cd code-challenge-Flatadango-Movie-Ticket-Booking-System
```
3. Open `index.html` in a web browser to run the app.
    Run (`open index.html` for Mac, `explorer.exe index.html` for WSL).
    Once open, go back to the terminal. run `code .` to open the project files in Vs Code. If using a different editor open the files as you would other code files.
3. Now that you have opened index.html in your browser, and pjoject files in your text editor, we can run the JSON server. If not installed already, follow this short simple step to set it up:
   -Install JSON Server Globally:
    To install JSON Server, run the following command in your terminal:
```bash
npm install -g json-server
```
    This will install json-server globally, making it available anywhere on your system.

   -Ensure the Database File Exists:
    Ensure you have a db.json file in exist in the project directory: `data/db.json`. You can check this in the Text Editor or Vs Code we opened earlier. This file will holds the data that the JSON server will serve. the file can be found [here](#https://docs.google.com/document/d/1KKqnHX4woJXQD1DSARTOcFD66uniLy0qwJFoHmmQDbA/edit?tab=t.0). 
    Copy the data and paste in data folder. name the file db.json 

   -Run JSON Server:
    In the terminal, navigate to the folder containing db.json. run `code db.json` in your terminal. If it does not open, run `ls` to check if it exists in the current folder you are in.
    Now run the command below to start the server;
```bash
    json-server --watch db.json
```
    The server will start running on http://localhost:3000, and you will be able to access your resources like http://localhost:3000/films.
    Copy http://localhost:3000/films and paste it in a different tab in your browser to view the API data.

    Leave the server running. You can operate from the terminal in your Visual Studio Code. 
    `Ctrl + ~` (The tilde key, which is usually located just below the Esc key) will open the terminal. If you are operating from one terminal then you would need to ocassionally start the server, especially when you come across NETWORK ERROR in your browser. 

3. The app makes API calls using `script.js` and styles with `style.css`.

## Core Features 
#### As a user, You can:
View Movie Details: On page load, see details of the first movie, including its poster, title, runtime, showtime, and available tickets.

    GET request to /films/1 to fetch data.

View Movie List: Display a list of all movies on the left side of the page.

    GET request to /films to fetch all films.

Purchase Tickets: Buy a ticket for a movie, reducing the available tickets count on the frontend and updating the backend.

    PATCH request to /films/:id to update tickets_sold.

    POST request to /tickets to log the purchase.

Delete Movies: Remove a movie from both the UI and the server when the "Delete" button is clicked.

    DELETE request to /films/:id.

Sold Out Status: Mark films as sold out by changing the button text to "Sold Out" when there are no tickets remaining, and updating the film list with a sold-out class.


## **Technologies Used**
- **HTML**: Structure and layout of the page.
- **CSS**: Styling for a modern and responsive design.
- **JavaScript**: Logic for handling events, DOM manipulation, and server communication.
- **JSON**: Mock data for films and ticket purchases.

## **API Endpoints**
- **GET /films**: Retrieve a list of all films.
- **GET /films/:id**: Retrieve details for a single film.
- **PATCH /films/:id**: Update tickets sold for a specific film.
- **POST /tickets**: Log a new ticket purchase.
- **DELETE /films/:id**: Delete a film from the server.

**Reminder**: Incase of clogs, restart the server. Run: `json-server --watch db.json`
