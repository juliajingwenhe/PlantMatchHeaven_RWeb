let navbar = document.querySelector('.navbar')
let menu = document.querySelector('#menu-bar');
let searchBtn = document.querySelector('#search-btn');
let searchBar = document.querySelector('.search-bar-container');
let formClose = document.querySelector('#form-close');


window.onscroll = () => {
    searchBtn.classList.remove('fa-times');
    searchBar.classList.remove('active');
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');

    if(window.scrollY > 100){
        document.querySelector('header').classList.add('active');
    }else{
        document.querySelector('header').classList.remove('active');
    }
}

menu.addEventListener('click', () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
});

searchBtn.addEventListener('click', () => {
    searchBtn.classList.toggle('fa-times');
    searchBar.classList.toggle('active');
});


document.querySelectorAll('.small-image-1').forEach(images =>{
    images.onclick = () =>{
        document.querySelector('.big-image-1').src = images.getAttribute('src');
    }
});

document.querySelectorAll('.small-image-2').forEach(images =>{
    images.onclick = () =>{
        document.querySelector('.big-image-2').src = images.getAttribute('src');
    }
});

document.querySelectorAll('.small-image-3').forEach(images =>{
    images.onclick = () =>{
        document.querySelector('.big-image-3').src = images.getAttribute('src');
    }
});


// <--filter bar-->>

// Event listeners for filter item buttons
document.querySelectorAll('.filter-item-button').forEach(button => {
    button.addEventListener('click', function () {
        let content = this.nextElementSibling;
        let isContentVisible = content.style.display === 'block';
        
        document.querySelectorAll('.filter-content').forEach(fc => {
            fc.style.display = 'none';
        });
    
        content.style.display = isContentVisible ? 'none' : 'block';
    });
});

// Function to filter plant boxes
function filterBoxes() {
    
    let filters = {};
    document.querySelectorAll('.filter-content input[type=checkbox]:checked').forEach(checkbox => {
        if (!filters[checkbox.name]) {
            filters[checkbox.name] = [];
        }
        filters[checkbox.name].push(checkbox.value);
    });

    // Filter boxes based on selected filters
    document.querySelectorAll('.box-container .box').forEach(box => {
        let isBoxVisible = Object.keys(filters).every(filter => {
            if (!filters[filter].length) return true;
            return filters[filter].some(filterValue => box.classList.contains(`${filter}-${filterValue}`));
        });
        box.style.display = isBoxVisible ? '' : 'none';
    });
}

// Attach change event listeners to checkboxes
document.querySelectorAll('.filter-content input[type=checkbox]').forEach(checkbox => {
    checkbox.addEventListener('change', filterBoxes);
});

// Clear filters function
function clearFilters() {
    
    document.querySelectorAll('.filter-content input[type=checkbox]').forEach(checkbox => {
        checkbox.checked = false;
    });
    filterBoxes(); 
}






//  <--favourite sidebar--> 

// Function to toggle the saved plants sidebar
function toggleSidebar() {
    document.getElementById('saved-plants-sidebar').classList.toggle('open');
}

// Event listener for closing sidebar
document.getElementById('close-sidebar').addEventListener('click', toggleSidebar);


// Event listener for heart icons in plant boxes
document.querySelectorAll('.fas.fa-heart').forEach(icon => {
    icon.addEventListener('click', function(event) {
        event.preventDefault();
        let plantName = this.dataset.plant;
        let savedPlantsList = document.getElementById('saved-plants-list');

        // Check if the plant is already in the list
        if (!savedPlantsList.querySelector(`[data-plant="${plantName}"]`)) {
            // Create a new list item for the plant
            let li = document.createElement('li');
            li.textContent = plantName;
            li.setAttribute('data-plant', plantName);
            savedPlantsList.appendChild(li);
        }

        // Toggle the heart icon class to indicate saved status (e.g., filled heart)
        this.classList.toggle('saved');
        


    });
    
});

// Make sure this ID matches the one you set in your HTML
document.getElementById('header-favorite-icon').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default action
    toggleSidebar(); // Function to open/close the sidebar

    });




// <--clear all button-->
document.getElementById('clear-all').addEventListener('click', function() {
    // Clear the local storage
    localStorage.removeItem('savedPlants');
    
    // Update the list
    loadSavedPlants();
});


//Save to Local Storage on Heart Icon Click//
document.querySelectorAll('.fas.fa-heart').forEach(icon => {
    icon.addEventListener('click', function(event) {
        event.preventDefault();
        let plantName = this.dataset.plant;
        let savedPlants = JSON.parse(localStorage.getItem('savedPlants')) || [];

        if (savedPlants.includes(plantName)) {
            // Remove plant from saved
            savedPlants = savedPlants.filter(p => p !== plantName);
            this.classList.remove('saved');
        } else {
            // Add plant to saved
            savedPlants.push(plantName);
            this.classList.add('saved');
        }

        localStorage.setItem('savedPlants', JSON.stringify(savedPlants));
        loadSavedPlants();
    });
});


function loadSavedPlants() {
    let savedPlants = JSON.parse(localStorage.getItem('savedPlants')) || [];
    let savedPlantsList = document.getElementById('saved-plants-list');

    savedPlantsList.innerHTML = ''; // Clear the list

    savedPlants.forEach(plantName => {
        let li = document.createElement('li');
        li.textContent = plantName;
        savedPlantsList.appendChild(li);
    });
}




// Populate sidebar with saved plants on page load
document.addEventListener('DOMContentLoaded', loadSavedPlants);



// Update the heart icons for saved plants
document.querySelectorAll('.fas.fa-heart').forEach(icon => {
    let plantName = icon.dataset.plant;
    let savedPlants = JSON.parse(localStorage.getItem('savedPlants')) || [];

    if (savedPlants.includes(plantName)) {
        icon.classList.add('saved');
    }
});


// Get the heart icon in the header
const headerHeartIcon = document.querySelector('.header .fas.fa-heart');




function removePlant(plantName) {
    // Get the current list of saved plants
    let savedPlants = JSON.parse(localStorage.getItem('savedPlants')) || [];
    
    // Filter out the plant to be removed
    savedPlants = savedPlants.filter(p => p !== plantName);
    
    // Save the updated list back to local storage
    localStorage.setItem('savedPlants', JSON.stringify(savedPlants));
    
    // Update the display list
    loadSavedPlants();
}

// Get the heart icon in the footer
const footerHeartIcon = document.querySelector('.footer .fas.fa-heart');

// Add click event listener to the heart icon in the footer
footerHeartIcon.addEventListener('click', function() {
    // Toggle the sidebar
    toggleSidebar();
});



//<---search bar--->//

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const searchTerm = document.getElementById('search-bar').value.toLowerCase().trim();
    const plantBoxes = document.querySelectorAll('.box');

    let found = false;
    plantBoxes.forEach(function(box) {
        const plantName = box.dataset.plantName.toLowerCase();
        
        if (plantName.includes(searchTerm)) {
            const plantUrl = box.dataset.plantUrl;
            window.location.href = plantUrl;
            found = true;
            return;
        }
        
    });

    if (!found) {
        alert('Plant not found. Please try another search.'); // Optionally alert the user if no match is found
    }
});

// Add input event listener to the search bar
searchBtn.addEventListener('click', function() {

    // Get the search term
    const searchTerm = searchBar.value.toLowerCase();

    // Get all plant boxes
    const plantBoxes = document.querySelectorAll('.box');

    // Loop through all plant boxes
    for (let i = 0; i < plantBoxes.length; i++) {
        // Get the plant name
        const plantName = plantBoxes[i].querySelector('.data-plant-name').innerText.toLowerCase();

        // If the plant name includes the search term, navigate to the plant URL
        if (plantName.includes(searchTerm)) {
            // Get the plant URL
            const plantURL = plantBoxes[i].querySelector('a').href;

            // Navigate to the plant URL
            window.location.href = plantURL;

            // Stop the loop
            break;
        }
    }
});






console.log("PlantMatch Haven");













