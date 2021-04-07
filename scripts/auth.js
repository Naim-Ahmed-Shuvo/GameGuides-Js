// listen for auth events
auth.onAuthStateChanged((user) => {
  if (user) {
    // get data
    db.collection("guides")
      .onSnapshot((data) => {
        setupGuides(data.docs);
        setupUI(user);
        // console.log(data.docs)
      },(err)=>{
        console.log(err.message)
      })
  } else {
    setupUI();
    setupGuides([]);
    
  }
});

// create new guide 
const createForm = document.querySelector("#create-form");

createForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  // 
  db.collection('guides').add({
    // 
    title: createForm['title'].value,
    content: createForm['content'].value

  }).then(()=>{
    // 
    const createModal = document.querySelector("#modal-create");
    M.Modal.getInstance(createModal).close();
    createForm.reset();

  }).catch(err =>{

    alert(err.message);

  })
})

// sign up
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get sign up info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);

    // 
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm["signup-bio"].value
    })

   
  }).then(()=>{
    // 
    const signupModal = document.querySelector("#modal-signup");
    M.Modal.getInstance(signupModal).close();
    signupForm.reset();
  });
});

// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("Logout success !");
  });
});

// login
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // login info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  //
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    //  console.log(cred.user);

    const loginModal = document.querySelector("#modal-login");
    M.Modal.getInstance(loginModal).close();
    loginForm.reset();
  });
});
