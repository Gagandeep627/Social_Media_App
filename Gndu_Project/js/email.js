


let Email = document.getElementById("email")
let message = document.getElementById("message")


firebase.auth().onAuthStateChanged((user) => {





    if (user) {

        if (user.emailVerified){
            window.location.assign("../pages/home.html")
        } else {

            Email.innerHTML = user.Email


        }



    } else {
        window.location.assign("../pages/login.html")


    }











});



let resend = () => {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        message.innerHTML =
          "A verification link has been send to your email account";
        message.style.color = "green";
        message.style.marginBottom = "15px";
      });
  };
  let reloud = () => {
    location.reload();
  };





  const logout = ()=>{
    firebase.auth().signOut().then(() => {
      window.location.assign("./login.js")
    })
  }

















// let resend = () => {

//     firebase.auth().sendEmailVerification().then(()=>{
//         message.innerHTML = "A verification code has been send to your email adddress"
//         message.style.color = "green"
//         message.style.marginBottom = "15px"








//     })
// }


// const reloud = () => {
//     // alert()
//     location.reloud()
// }