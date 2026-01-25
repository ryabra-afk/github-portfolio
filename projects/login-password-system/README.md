Overview of the Project
-A straightforward demonstration of client-side user authentication (create account + sign in)
-Constructed with JavaScript, HTML, and CSS
-Puts more emphasis on comprehending the basics of the web than on production security


HTML (Organisation)
-Used semantic input types: type="password" is a masked input, whereas type="email" includes browser level validation.
-JavaScript can access elements through the DOM thanks to unique id properties.
-Buttons use onclick to initiate JavaScript logic
-Links external JavaScript and CSS files to separate concerns.


CSS (Presentation)
-Uses Flexbox for responsive layout and centring
-Targeted HTML elements with id selectors like #email, #password, and buttons in addition to class selectors like.detailsPannel
-Uses typeface, responsive spacing for all devices, and a consistent web page layout
-Offers hover and active states for improved user experience
-Colour contrast and rounded corners for modernism and accessibility
-Demonstrates knowledge of responsive sizing and viewport units (vh).

JavaScript (Functionality & Logic)
-Manages form validation and user interaction
-Uses.value to dynamically read input values
-Applies conditional reasoning to:
-Avoid submitting nothing at all
-Differentiate between creating an account and logging in.
-Uses localStorage to store and retrieve data
-Exhibits:
-DOM manipulation
-Parameter-based functions
-Basic error management and alert-based user feedback


Data Storage Choice (localStorage)
-uses the built-in localStorage of the browser as a teaching tool.
-enables concentration on:
    JavaScript reasoning
    State management on the client side
    Ideas for key-value data storage
-Avoids backend complexity during this learning phase.


Security Acknowledgement / Limitations
-Not suitable for real-world authentication
-Passwords are stored:
    In plain text
    On the client-side
Vulnerable to:
    XSS attacks
    Local device access
    Browser inspection tools
-No encryption, hashing, or server-side validation


Why no backend was used
-The project focuses on front-end fundamentals: HTML structure, CSS styling, and JavaScript logic.
-Backend features (databases, hashing, authentication servers) were intentionally excluded to keep the scope educational and clear.
-In a production environment, secure backend handling would be required for user authentication and data protection.



Future Improvements
-Replace localStorage with a secure backend
-Hash passwords (e.g. bcrypt)
-Add session handling / tokens
-Improve UI feedback without alerts
-Add form validation and error messaging

Shows Create Account
![Shows Create Account](images/image1.png)

Shows Successfull Signin Following Account Creation
![Shows Successfull Signin Following Account Creation](images/image2.png)

Shows Failed Signin Following Incorrect Email Input With Correct Password
![Shows Failed Signin Following Incorrect Email Input With Correct Password Input](images/image3.png)

Shows Failed Signin Following Correct Email Input With Incorrect Password Input
![Shows Failed Signin Following Correct Email Input With Incorrect Password Input](images/image4.png)

Shows Failed Signin Following Incorrect Email Input AND Incorrect Password Input
![Shows Failed Signin Following Incorrect Email Input AND Incorrect Password Input](images/image5.png)