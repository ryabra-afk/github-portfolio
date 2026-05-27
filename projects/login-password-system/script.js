function switchScreen(screen){

    let loginScreen = document.getElementById("loginScreen");
    let dashboardScreen = document.getElementById("dashboardScreen");

    if(screen === "login"){
        loginScreen.style.display = "flex"; //show login screen using flexbox layout
        dashboardScreen.style.display = "none"; //hide dashboard screen
    }

    else if(screen === "dashboard"){
        loginScreen.style.display = "none"; //hide login screen
        dashboardScreen.style.display = "block"; //show dashboard screen by restoring normal div rendering (no flexbox here)
    }
}


let emailInput = document.getElementById("email")
let passwordInput = document.getElementById("password")
let exams = JSON.parse(localStorage.getItem("exams")) || []; //stores all exam objects
//.parse turns string to array to SAVE data so .js can use it again
let sessions = JSON.parse(localStorage.getItem("sessions")) || []; //stores all revision session objects
let editingSessionIndex = null; //stores index of session currently being edited

function handlePassword(action){
    let email = emailInput.value; //.value retrieves data inside emailInput element
    let password = passwordInput.value;

    //boolean OR not a single input field is left empty
    if (email === "" || password === "") { 
        alert("Please fill in all fields");
        return;
    }

    if (action === "create") {
        if (localStorage.getItem(email)) {
            alert("Account Already Exists - Please Sign In");
        } else {
            localStorage.setItem(email, password); //.setItem stores password using email as the key
            alert("Account Created Successfully");
        }
    }

    
    
    else if (action === "signin") {
        let details = localStorage.getItem(email); //retrieve stored details

        if(!details){ //if nothing found from this email
            alert("Account Does Not Exist")
        }

        else if(details === password){
            alert("Sign In Successful")
            switchScreen("dashboard"); //switch to dashboard screen if login successfull
            displayExams(); //renders saved exams immediately on login
            loadSubjectOptions(); //refresh revision subject dropdown
        }

        else{
            alert("Incorrect Password")
        }
    }
}

function addExam(){
    //retrieve values entered by user
    let subject = document.getElementById("subject").value
    let examDate = document.getElementById("examDate").value;
    let subjectColor = document.getElementById("subjectColor").value;

    //validation check
    if(subject === "" || examDate === ""){
        alert("Please Complete All Fields");
        return; //stops function from running if fields not complete
    }

    //if validation passes create new exam object
    let exam = {
        subject: subject,
        date: examDate,
        color: subjectColor,
    };
    exams.push(exam) //add exam object into exams array
    localStorage.setItem("exams", JSON.stringify(exams)); //.stringify converts array into string so it can be saved in localStorage to LOAD data
    displayExams(); //update dahsboard visually
}

function displayExams(){
    let examContainer = document.getElementById("examContainer")

    examContainer.innerHTML = ""; //clear old rendered exams before re-rendering

    for(let i=0; i<exams.length; i++){
        let exam = exams[i]; //gets one object from array so can access its .subject .date .color

        let examCard = document.createElement("div"); //creates new div element in memory
        examCard.classList.add("examCard") //adds CSS class styling
        examCard.style.borderLeft = `10px solid ${exam.color}` //left border color matches subject color
        
        //dynamic content generation to display exam card
        //{i} later becomes id="countdown-0/1/2" in updateCountdowns()
        //.toLocaleString makes a more readable format
        examCard.innerHTML = `
            <h2>${exam.subject}</h2>
            <p>${new Date(exam.date).toLocaleString()}</p> 
            <p id="countdown-${i}">Loading countdown...</p> 
        `;

        examContainer.appendChild(examCard); //adds completed card into webpage
        updateCountdowns(); //immediately calculate countdown after rendering card
    }
}

function updateCountdowns(){
    let currentTime = new Date().getTime() //get current time in millisecs

    for(let i=0; i<exams.length; i++){ //LOOP through exams

        let examTime = new Date(exams[i].date).getTime() //get date of current exam and convert it into millisecs using exams[i].date
        let difference = examTime - currentTime //calc difference between now and exam
        let countdownElement = document.getElementById(`countdown-${i}`) //e.g. "countdown-1"
        
        //if countdown paragraph doesnt exist for this exam card
        if(!countdownElement){
            continue; //skip THIS loop cycle, instead of using return to exit function
        }

        //if exam time has already passed
        if(difference <=0){
            countdownElement.innerText = "Exam Started";
            continue;
        }

        
        let days = Math.floor( difference / (1000*60*60*24) ); //total remaining full days
        let hours = Math.floor( (difference / (1000*60*60)) % 24 ); //remaining hours after days removed
        let minutes = Math.floor( (difference / (1000*60)) % 60 ); //remaining minutes after hours removed
        let seconds = Math.floor( (difference / 1000) % 60 ); //remaining seconds after minutes removed

        countdownElement.innerText =  `${days}d ${hours}h ${minutes}m ${seconds}s`; //update paragraph text with live countdown
    }

}
setInterval(updateCountdowns, 1000); // runs countdown system every 1 second to update timer continuosly