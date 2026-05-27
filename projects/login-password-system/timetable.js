function generateTimetable(){

    let timetable = document.getElementById("timetable"); 
    timetable.innerHTML = ""; //clear old tt before regerating

    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    // create empty top-left corner cell
    let emptyCell = document.createElement("div");
    emptyCell.classList.add("timeCell");
    timetable.appendChild(emptyCell);


    // create weekday labels across top row
    for(let i = 0; i < days.length; i++){
        let dayCell = document.createElement("div"); //create weekday cell
        dayCell.classList.add("timeCell"); //add timetable CSS styling
        dayCell.innerText = days[i]; //insert weekday text
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
            slot.dataset.day = days[day]; //store weekday inside slot dataset
            slot.dataset.hour = hour; //store hour inside slot dataset
            timetable.appendChild(slot); //add slot into timetable grid
        }
    }

}

function loadSubjectOptions(){
    let subjectDropdown = document.getElementById("sessionSubject")
    subjectDropdown.innerHTML - ""; //clear old drop down options

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


    //create revision session object
    let session = {subject: subject, day: day, startHour: startHour, endHour: endHour, color: color};

    sessions.push(session); //add session object into sessions array
    console.log(sessions)
    renderSessions(); //visually render sessions into tt using function below

}

function renderSessions(){
    for(let i=0; i<sessions.length; i++){
        let session = sessions[i] //retrieve current session object
        
        for(let hour = session.startHour; hour<session.endHour; hour++){ //loop through each session's start and end hour
            let slot = document.querySelector(`[data-day="${session.day}"][data-hour="${hour}"]`);  //complex formatting to find matching timetable slot
        
            if (slot){ //if matching timtable cell exists i.e. (true)
                slot.style.backgroundColor = session.color; //embedded CSS
                slot.innerText = session.subject; //display subject text inside slot
            }
        }
    }
    
}

generateTimetable();
loadSubjectOptions();