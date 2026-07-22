// create a replacement session for the next day
function rescheduleSession(index){
    let currentSession = sessions[index]; //get session
    let newDate = new Date(currentSession.date); //copy of session's date
    newDate.setDate(newDate.getDate() + 1); //move copied date forward by one day

    //create new session object 1 day after at same time
    let newSession = {
        subject: currentSession.subject,
        day: newDate.toLocaleDateString("en-GB",{ weekday: "long" }), //store next weekday name
        date: newDate.toDateString(), //store next date as string 
        startHour: currentSession.startHour, //same start hour
        endHour: currentSession.endHour, //same end hour
        color: currentSession.color,
        // new session has not been completed yet
        completed: false,
        rating: null
    };
    //add replacement session into sessions array
    sessions.push(newSession);
    //save updated sessions array
    localStorage.setItem("sessions",JSON.stringify(sessions));
}

