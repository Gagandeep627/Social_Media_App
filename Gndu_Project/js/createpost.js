let postValue = document.getElementById("textarea");
var progressDiv = document.getElementById("progressdiv");
var progressbar = document.getElementById("progressbar");
let currentuser = "";
let url = "";
let fileType = "";
var done = document.getElementById("done");
let uid;
let alluser = [];
let userimg = document.getElementById("userimg");
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (user.emailVerified) {
      uid = user.uid;
      console.log("Email is verified!");
    } else {
      window.location.assign("./email.html");
    }
  } else {
    window.location.assign("./login.html");
  }
});

firebase.auth().onAuthStateChanged((user) => {
  currentuser = user;
});
let uploadimg = (event) => {
  fileType = event.target.files[0].type;
  var uploadfile = firebase
    .storage()
    .ref()
    .child(`postFiles/${event.target.files[0].name}`)
    .put(event.target.files[0]);
  uploadfile.on(
    "state_changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      var uploadpercentage = Math.round(progress);
      console.log(uploadpercentage);
      progressDiv.style.display = "block";
      progressbar.style.width = `${uploadpercentage}%`;
      progressbar.innerHTML = `${uploadpercentage}%`;
    },
    (error) => { },
    () => {
      uploadfile.snapshot.ref.getDownloadURL().then((downloadURL) => {
        url = downloadURL;
        done.style.display = "block";
        progressDiv.style.display = "none";
      });
    }
  );
};






//store the data on firestore. : ?


var d = new Date().toLocaleDateString();

// let postValue = document.getElementById("textarea")
function createPost(){

  if (postValue !== "" || url !== ""){
    firebase.firestore().collection("posts").add({

        postValue:postValue.value,
        uid: currentuser.uid,
        url:url,
        fileType : fileType,
        like:"",
        dislike:"",
        commentArray: [],
        Date:`${d}`


    }).then((res) => {

      firebase.firestore().collection("posts/").doc(res.id).update({

        id : res.id
      }).then(()=> {

        done.style.display = "none";
        document.getElementById("uploadedmssage").style.display = "block"

        setTimeout(() => {
            location.reload()  


        }, 2000)
         
      
  })
    })
  }
}




const logout = ()=>{
  firebase.auth().signOut().then(() => {
    window.location.assign("./login.js")
  })
}







// let postValue = document.getElementById("textarea")
// let progessdib = document.getElementById("progressdiv")
// let progressbar = document.getElementById("progressbar")

// let currentUser = ""
// let url = ""
// let fileType = ""
// let done = document.getElementById("done")
// let uid



// firebase.auth().onAuthStateChanged((user) => {


//     if (user) {
//         if (user.emailVerified){

//             setTimeout(() => {
//                 uid = user.uid

//             }, 1000)


//         }else{
//             setTimeout(()=>{
//                 window.location.assign("../pages/emailVerification.html")

//             }, 1000)

//         }

//     }else {

//         setTimeout(()=>{

//             window.location.assign("../pages/Login.html")
//         }, 1000)

//     }
// });


// firebase.auth().onAuthStateChanged((user)=>{
//     currentUser = user

// })



// let uploading = (event) =>{

//     filetype = event.target.files[0].fileType

//     var uploadTask = firebase.storage().ref().child(`posts/${event.target.files[0]}`)


//     uploadTask.on(`state_Changed` , 
//     (snapshot) => {

//         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         var uploadpercentage = Math.round(progress)
//         progressdiv.style.display = "block"
//         progressbar.style.width = `${uploadpercentage}%`
//         progressbar.innerHTML = `${uploadpercentage}%`
//     },
//     (error) => {
//         //Handle unsuccessful uploads

//     },
//     () => {


//         uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) =>{
//             url = downloadURL;
//             done.style.display = "block"
//             progressdiv.style.display = "none"


//         });




//     }
    
//     );



// }


