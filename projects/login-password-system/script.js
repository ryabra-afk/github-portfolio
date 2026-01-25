let emailInput = document.getElementById("email")
let passwordInput = document.getElementById("password")

// emailInput.addEventListener("input", function() {  
//     // the function is passed as an argument and is never called directly by me
        //updates emailInput autmoatically when input is changed
//     console.log("key pressed")
// }); 

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
        }

        else{
            alert("Incorrect Password")
        }
    }
}
//localStorage example: "test@email.com" → { password: "123456" }
//IN README EXPLAIN WHY BACKEND NOT USED BUT LOCALSTORAGE INSTEAD AS EDUATIONAL TOOL