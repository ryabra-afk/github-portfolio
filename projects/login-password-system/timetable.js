let currentWeekDate = new Date(); //current displayed calendar week
let today = new Date(); //today's date

//called when user presses previous or next week buttons
function changeWeek(days){

    // move displayed week backwards or forwards
    currentWeekDate.setDate(currentWeekDate.getDate() + days); //.getDate() returns day of month
    
    // rebuild timetable and update heading
    generateTimetable();
    renderSessions();
    updateWeekLabel();
}

//update text showing currently viewed week
function updateWeekLabel(){
    let weekLabel = document.getElementById("weekLabel");
    weekLabel.innerText = currentWeekDate.toDateString(); //convert date into string to display
}

function generateTimetable(){

    let timetable = document.getElementById("timetable"); 
    timetable.innerHTML = ""; //clear old tt before regerating

    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    // create copy of current displayed date
    let startOfWeek = new Date(currentWeekDate);
    // move copied date backwards to Monday
    startOfWeek.setDate(currentWeekDate.getDate() - currentWeekDate.getDay() + 1); //getDay() returns 0-6 for Sun-Sat, so +1 to move to Monday

    // create empty top-left corner cell
    let emptyCell = document.createElement("div");
    emptyCell.classList.add("timeCell");
    timetable.appendChild(emptyCell);


    // create weekday labels across top row
    for(let i = 0; i < days.length; i++){
        let dayCell = document.createElement("div"); //create weekday cell
        dayCell.classList.add("timeCell"); //add timetable CSS styling
        
        //create real calendar date for current column
        let currentDay = new Date(startOfWeek);
        //move forwards across week columns
        currentDay.setDate(startOfWeek.getDate() + i);
        //highlight today's real date
        if(currentDay.toDateString() === today.toDateString()){
            dayCell.classList.add("currentDay");
        }
        //display weekday name and date number
        dayCell.innerText = `${days[i]} ${currentDay.getDate()}`;
            timetable.appendChild(dayCell); //add weekday cell into timetable
        }

    //ROWS containing hours
    for(let hour =0; hour<24; hour++){
        let timeLabel = document.createElement("div")
        timeLabel.classList.add("timeCell")
        timeLabel.innerText = `${hour.toString().padStart(2, "0")}:00`; //format 00:00
        timetable.appendChild(timeLabel);


        //fill in table with cells for each hour in each day
        for(let day = 0; day < 7; day++){
            let slot = document.createElement("div"); //create timetable slot
            slot.classList.add("slot"); //add timetable slot styling
            let slotDate = new Date(startOfWeek); //real date for monday of current week
            slotDate.setDate(startOfWeek.getDate() + day);  //move across week columns
            slot.dataset.date = slotDate.toDateString(); // store real date in slot
            slot.dataset.hour = hour; //store hour inside slot dataset
            timetable.appendChild(slot); //add slot into timetable grid
        }
    }

}

function loadSubjectOptions(){
    let subjectDropdown = document.getElementById("sessionSubject")
    subjectDropdown.innerHTML = ""; //clear old drop down options

    for (let i=0; i<exams.length; i++){
        let option = document.createElement("option"); //create option element
        option.innerText = exams[i].subject
        option.value = exams[i].subject
        subjectDropdown.appendChild(option); //add option into dropdown
    }
}

function addSession(){

    //get value of all input fields when creating new session
    let subject = document.getElementById("sessionSubject").value;
    let day = document.getElementById("sessionDay").value;

    //convert selected weekday into index
    let dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(day);
    //create copy of current displayed week
    let sessionDate = new Date(currentWeekDate);

    //move copied date to selected weekday
    sessionDate.setDate(currentWeekDate.getDate() - currentWeekDate.getDay() + 1 + dayIndex);

    //VALIDATION prevent scheduling sessions before today
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); //remove time from today so comparison is date only
    let selectedDate = new Date(sessionDate); 
    selectedDate.setHours(0, 0, 0, 0); //remove time from selected session date

    //stop if selected date is before today
    if(selectedDate < todayDate){
        alert("Cannot Schedule A Session Before Today");
        return;
    }

    let startHour = document.getElementById("startHour").value;
    let endHour = document.getElementById("endHour").value;
    let matchingExam = exams.find(exam=> exam.subject === subject); //find exam in exams array where exam.subject === selected subject
    let color = matchingExam.color;

    //validation checks
    if (subject === "" || startHour === "" || endHour === ""){
        alert("Please Complete All Fields")
        return;
    }

    if(startHour < 0 && endHour > 23){
        alert("Both The Selected Start and End Hours are Out Of Range")
        return;
    }

    if(startHour >= endHour){
        alert("End Hour Must Be Greater Than Start Hour");
        return;
    }

    if(startHour < 0){
        alert("The Selected Start Hour is Out Of Range")
        return;
    }

    if(endHour > 23){
        alert("The Selected End Hour is Out Of Range")
        return;
    }
    // prevent overlapping sessions on the same date
    for(let i = 0; i < sessions.length; i++){

        let existing = sessions[i];

        // skip session currently being edited
        if(i === editingSessionIndex){
            continue;
        }

        //VALIDATION: check overlap only compare sessions on the same date
        if(existing.date === sessionDate.toDateString()){
            // check if time ranges overlap
            let overlaps = startHour < existing.endHour && endHour > existing.startHour;
            if(overlaps){
                alert("Cannot Schedule overlapping sessions")
                return;
            }
        }
    }
    // VALIDATION: prevent scheduling revision after the exam date
    let examDate = new Date(matchingExam.date);
    if(sessionDate > examDate){
        alert("Cannot schedule a revision session after the exam date");
        return;
    }



    //create revision session object
    let session = {subject: subject, day: day, date: sessionDate.toDateString(), startHour: startHour, endHour: endHour, color: color, completed: false, rating: null, rescheduled: false};

    //if editing...
    if(editingSessionIndex !== null){
        sessions[editingSessionIndex] = session; //replace old session object with updated session
        editingSessionIndex = null; //exit editing mode
    }

    //otherwise create completely new session
    else{
        sessions.push(session); // add new session into sessions array
    }
    localStorage.setItem("sessions",JSON.stringify(sessions)); //save sessions array into localStorage

    console.log(sessions)
    renderSessions(); //visually render sessions into tt using function below

}

function renderSessions(){
    generateTimetable(); //rebuild fresh timetable before regenerating, so deleted sessions don't appear
    for(let i=0; i<sessions.length; i++){
        let session = sessions[i] //retrieve current session object
        
        for(let hour = session.startHour; hour<session.endHour; hour++){ //loop through each session's start and end hour
            let slot = document.querySelector( `[data-date="${session.date}"][data-hour="${hour}"]`); //select timetable cell that matches session's date and hour
        
           
            if (slot){ //if matching timtable cell exists i.e. (true)
                slot.style.backgroundColor = session.color; //embedded CSS to colour all hour slots
                if(hour == session.startHour){ //only first hour displays subject and delete button
                    let completedTick = session.completed ? " ✔" : ""; // add tick if completed
                    let ratingText = session.rating ? ` - ${session.rating}` : ""; // add rating text
                    
                    if(session.completed){ // if session has been rated, dont show buttons
                        slot.innerHTML = `${session.subject}${completedTick}${ratingText}`;
                    }
                    //show interactive buttons if session not rated
                    else{
                        slot.innerHTML = `
                            ${session.subject}
                            <button onclick="rateSession(${i}, '😀')">😀</button>
                            <button onclick="rateSession(${i}, '😐')">😐</button>
                            <button onclick="rateSession(${i}, '😥')">😥</button>
                            <button onclick="editSession(${i})">Edit</button>
                            <button onclick="deleteSession(${i})">X</button>
                        `;
                    }
                
                }
            }
        }
    }
}

//called when user clicks on HTML rating buttons tomark session as completed and store productivity rating
function rateSession(index, rating){
    //if session has already been rated then exit function to prevent multiple ratings
    if(sessions[index].completed){
        return;
    }

    sessions[index].completed = true;
    sessions[index].rating = rating; //store rating in session object
    //automatically create follow-up session if rating was poor
    if(rating === "poor" && !sessions[index].rescheduled){
        rescheduleSession(index); //create replacement session
        sessions[index].rescheduled = true; //mark original session as already rescheduled to prevent multiple reschedules
    }

    localStorage.setItem("sessions", JSON.stringify(sessions)); //update localStorage with new session rating
    renderSessions(); //re-draw sessions so that rating is visible
}

function deleteSession(index){
    sessions.splice(index,1) //remove session object from array by splice
    localStorage.setItem("sessions",JSON.stringify(sessions)); //update localStorage after deletion
    renderSessions() //re-render timetable with updated sessions
}

function editSession(index){
    let session = sessions[index]; //retrieve slected session object
    //these lines re-enter the current session's info that is being edited into the add a revision session input fields
    document.getElementById("sessionSubject").value = session.subject;
    document.getElementById("sessionDay").value = session.day;
    document.getElementById("startHour").value = session.startHour;
    document.getElementById("endHour").value = session.endHour;
    
    editingSessionIndex = index; //store currently edited session index
}

generateTimetable();
loadSubjectOptions();
renderSessions();
updateWeekLabel();