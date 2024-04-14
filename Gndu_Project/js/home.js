let uid;
let allusers = [];
let fileType = "";

let userimg = document.getElementById("userimg");
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (user.emailVerified) {
      uid = user.uid;
      var createpostinput = document.getElementById("a");

      firebase
        .firestore()
        .collection("users/")
        .onSnapshot((result) => {
          result.forEach((users) => {
            allusers.push(users.data());
            fileType = users.data().fileType;

            if (users.data().uid === user.uid) {
              createpostinput.setAttribute(
                "placeholder",
                `What's in your Mind ${
                  " " + users.data().FirstName + " " + users.data().LastName
                }`
              );
              if (users.data().ProfilePicture !== "") {
                userimg.setAttribute("src", users.data().ProfilePicture);
              }
            }
          });
        });
    } else {
      window.location.assign("../pages/emailverification.html");
    }
  } else {
    window.location.assign("../pages/Login.html");
  }
});

var loading = document.getElementById("loaderdiv");
var showposts = document.getElementById("showposts");

firebase
  .firestore()
  .collection("posts")
  .onSnapshot((result) => {
    loading.style.display = "none";
    let allposts = [];
    if (result.size === 0) {
      let nodata = document.getElementById("h1");
      nodata.style.display = "block";
    } else {
      result.forEach((post) => {
        allposts.push(post.data());
      });

      showposts.style.display = "block";
      showposts.innerHTML = "";

      for (let i = 0; i < allposts.length; i++) {
        let likearry = allposts[i].like;
        let dislikearry = allposts[i].dislike;
        let commentarry = allposts[i].commentArray;  
        let postmain = document.createElement("div");
        showposts.appendChild(postmain);
        postmain.setAttribute("class", "postmain");
        let postheader = document.createElement("div");
        postmain.appendChild(postheader);
        postheader.setAttribute("class", "postheader");

        // var ProfilePicture = "";

        firebase
          .firestore()
          .collection("users/")
          .doc(allposts[i].uid)
          .get()
          .then((res) => {
            let userprodev = document.createElement("div");
            let userprofileimg = document.createElement("img");
            postheader.appendChild(userprodev);
            userprodev.setAttribute("class", "userprodev");
            userprodev.appendChild(userprofileimg);
            userprofileimg.setAttribute(
              "src",
              res.data().ProfilePicture === ""
                ? "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651__340.png"
                : res.data().ProfilePicture
            );
            userprofileimg.setAttribute("class", "profileimage");

            let userdiv = document.createElement("div");
            userprodev.appendChild(userdiv);
            userdiv.setAttribute("class", "userdiv");
            let username = document.createElement("h6");
            userdiv.appendChild(username);
            username.innerHTML = `${res.data().FirstName} ${
              res.data().LastName
            }`;
            let date = document.createElement("h6");
            userdiv.appendChild(date);
            date.innerHTML = `${allposts[i].Date}`;

            let postdetail = document.createElement("p");
            postheader.appendChild(postdetail);
            postdetail.innerHTML = allposts[i].postValue;
            postdetail.setAttribute("class", "postdetail");

            // console.log(allposts[i])

            if (allposts[i].url !== "") {
              if (
                allposts[i].fileType === "image/png" ||
                allposts[i].fileType === "image/jpg" ||
                allposts[i].fileType === "image/jpeg"
              ) {
                let postimage = document.createElement("img");
                postmain.append(postimage);
                postimage.setAttribute("src", allposts[i].url);
                postimage.setAttribute("class", "postimage col-12");
              } else {
                let postvideo = document.createElement("video");
                postmain.appendChild(postvideo);
                postvideo.setAttribute("control", "true");
                postvideo.setAttribute("class", "postvideo");
                let source = document.createElement("source");
                postvideo.appendChild(source);
                source.setAttribute("src", allposts[i].url);
                source.setAttribute("Type", "video/mp4");
              }
              //problem's to be resolvedh. : ?
              // 1)Hunnh posth dehh descptnh : pageh chh problemnh hainh :
              //++seeh create_post.js forh postValue. : ?
              //  moveh toh nxth wrkh.
            }
            let footerdiv = document.createElement("div");
            postmain.appendChild(footerdiv);
            footerdiv.setAttribute("class", "footerdiv");
            var likebutton = document.createElement("button");
            footerdiv.appendChild(likebutton);
            likebutton.setAttribute("class", "likebutton");
            var likeicon = document.createElement("i");
            likebutton.appendChild(likeicon);
            likeicon.setAttribute("class", "fa-solid fa-thumbs-up");
            var liketitle = document.createElement("p");
            likebutton.appendChild(liketitle);
            liketitle.setAttribute("class", "impressiontitle");
            liketitle.innerHTML = `like (${likearry.length})`;
            // let likearry = allposts[i].like;
            for (let likeIndex = 0; likeIndex < likearry.length; likeIndex++) {
              if (likearry[likeIndex] === uid) {
                likeicon.style.color = "blue";
                liketitle.style.color = "blue";
              }
            }
            //like function
            likebutton.addEventListener("click", () => {
              let like = false;
              for (
                let likeIndex = 0;
                likeIndex < likearry.length;
                likeIndex++
              ) {
                if (likearry[likeIndex] === uid) {
                  like = true;
                  likearry.splice(likeIndex, 1);
                }
              }
              if (!like) {
                likearry = [uid];
              }
              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  like: likearry,
                });
            });
            var dislikebutton = document.createElement("button");
            footerdiv.appendChild(dislikebutton);
            dislikebutton.setAttribute("class", "dislikebutton");

            var dislikeicon = document.createElement("i");
            dislikebutton.appendChild(dislikeicon);
            dislikeicon.setAttribute("class", "fa-solid fa-thumbs-down");

            var disliketitle = document.createElement("p");
            dislikebutton.appendChild(disliketitle);
            disliketitle.setAttribute("class", "impressionstitle");
            disliketitle.innerHTML = `Dislike (${dislikearry.length})`;
            for (
              let dislikeindex = 0;
              dislikeindex < dislikearry.length;
              dislikeindex++
            ) {
              if (dislikearry[dislikeindex] === uid) {
                dislikeicon.style.color = "blue";
                disliketitle.style.color = "blue";
              }
            }
            dislikebutton.addEventListener("click", () => {
              let dislike = false;
              for (
                let dislikeindex = 0;
                dislikeindex < dislikearry.length;
                dislikeindex++
              ) {
                if (dislikearry[dislikeindex] === uid) {
                  dislike = true;
                  dislikearry.splice(dislikeindex, 1);
                }
              }
              if (!dislike) {
                dislikearry = [uid];
              }
              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  dislike: dislikearry,
                });
            });

            //comment method. : ?
            let commentbtn = document.createElement("button");
            footerdiv.appendChild(commentbtn);

            var commenticon = document.createElement("i");
            commentbtn.appendChild(commenticon);
            commenticon.setAttribute("class", "fa-solid fa-message");

            var commentmessage = document.createElement("p");
            commentbtn.appendChild(commentmessage);
            commentmessage.setAttribute("class", "impressionstitle");
            commentmessage.innerHTML = `Comment (${commentarry.length})`;
            // comment fuction
            if (commentarry.length !== 0) {
              for (
                var commentindex = 0;
                commentindex < commentarry.length;
                commentindex++
              ) {
                let commentmain = document.createElement("div");
                postmain.appendChild(commentmain);
                commentmain.setAttribute("class", "commentmain");
                let commentprofileimage = document.createElement("img");
                commentmain.appendChild(commentprofileimage);
                commentprofileimage.setAttribute(
                  "class",
                  "commentprofileimage"
                );
                var commentmessage = document.createElement("div");
                let commentusername = document.createElement("h6");
                commentmain.appendChild(commentmessage);
                commentmessage.appendChild(commentusername);
                //user data
                firebase
                  .firestore()
                  .collection("users")
                  .doc((commentarry[commentindex].commentuid))
                  .get()
                  .then((currentuserres) => {
                    commentprofileimage.setAttribute(
                      "src",
                      "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651__340.png"
                    );
                    if (currentuserres.data().ProfilePicture !== "") {
                      commentprofileimage.setAttribute(
                        "src",
                        currentuserres.data().ProfilePicture
                      );
                    }
                    commentusername.innerHTML = `${
                      currentuserres.data().FirstName
                    } ${currentuserres.data().LastName}`;
                  });
                let commentvalue = document.createElement("p");
                commentmessage.appendChild(commentvalue);
                commentvalue.setAttribute("class", "comment")
                commentvalue.innerHTML = commentarry[commentindex].commentvalue;
                
              }
            }
            let writecomment = document.createElement("div");
            writecomment.setAttribute("class", "writecomment");
            postmain.appendChild(writecomment);
            let commentinput = document.createElement("input");
            writecomment.appendChild(commentinput);
            commentinput.setAttribute("class", "commentinput");
            commentinput.setAttribute("placeholder", "Write Comment.....");
            let sendbutton = document.createElement("img");
            writecomment.appendChild(sendbutton);
            sendbutton.setAttribute(
              "src",
              "https://cdn-icons-png.flaticon.com/512/3682/3682321.png"
            );
            sendbutton.setAttribute("class", "sendbutton");

            //comment fuction
            sendbutton.addEventListener("click", () => {
              if (commentinput.value === "") {
                alert("Please write something.....!");
              } else {
                let commentdata = {
                  commentvalue: commentinput.value,
                  commentuid: uid,
                };
                commentarry.push(commentdata);       
                try {
                  firebase
                  .firestore()
                  .collection("posts")
                  .doc(allposts[i].id)
                  .update({
                    commentArray: commentarry,
                  });
                } catch (error) {
                  console.log(error)
                }
              }
            });
          });
      }
    }


    // const logout = ()=>{
    //   firebase.auth().signOut().then(() => {
    //     window.location.assign("./login.js")
    //   })
    // }
  });


  const logout = ()=>{
    firebase.auth().signOut().then(() => {
      window.location.assign("./login.js")
    })
  }
