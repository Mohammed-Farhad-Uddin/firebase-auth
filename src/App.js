import React, { useState } from 'react';
import './App.css';
import 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlRLzJlgpGV3OkMhff-IybKtpDQnLqJhM",
  authDomain: "like-button-eefc3.firebaseapp.com",
  projectId: "like-button-eefc3",
  storageBucket: "like-button-eefc3.appspot.com",
  messagingSenderId: "155228903209",
  appId: "1:155228903209:web:78dbb4298e1c11054c8938"
};

const app = initializeApp(firebaseConfig);

function App() {
  const GoogleProvider = new GoogleAuthProvider();
  const FbProvider = new FacebookAuthProvider();
  const[newUser,setNewUser]=useState(false)
  const[user,setUser]=useState({
    isSignIn:false,
    name:"",
    email:'',
    password:'',
    photo:'',
    error:'',
    success:false
  })

const handleSignIn=()=>{
  const auth = getAuth();
  signInWithPopup(auth, GoogleProvider)
  .then((res)=>{
    const{email,photoURL,displayName}=res.user;
    const signInUser={
      isSignIn:true,
      name:displayName,
      email:email,
      photo:photoURL
    }
    setUser(signInUser);
    console.log(res)//signInUser howar por res ki hobe
    console.log(displayName,email,photoURL);
  }).catch((err)=>console.log(err))
}

const handleFbSignIn=()=>{
          const auth = getAuth();
          signInWithPopup(auth, FbProvider)
          .then((result) => {
            // The signed-in user info.
            // const user = result.user;
            console.log("console after fb sign in",result.user)

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            // const credential = FacebookAuthProvider.credentialFromResult(result);
            // const accessToken = credential.accessToken;
          })
          .catch((error) => {
            // Handle Errors here.
            // const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            // const email = error.email;
            // The AuthCredential type that was used.
            // const credential = FacebookAuthProvider.credentialFromError(error);
            console.log(errorMessage)
        });
}

const handleSignOut=()=>{
         const auth = getAuth();
        signOut(auth).then((res) => {
          const userSignOut={
            isSignIn:false,
            name:'',
            email:'',
            photo:''
          }
          setUser(userSignOut)
          console.log(res)//sign out howar por res dekha
        }).catch((error) => {
          console.log(error)
        });
        }

        const handleChange=(e)=>{
          // let isFieldValid=true;
          let isFieldValid;
          // console.log(e.target.name,e.target.value)//e.target.name mane input e name jei ta dewa ace oi ta.ete buja jabe kon name tar modde target value ta uttece.krn email input e type korle email diye tar pase type kora word utbe.abe name=password e password field e type korle oita utbe.r name na dile buja jabe na kon input line ta te type word gula kaj kortece oi ta
          if(e.target.name === 'email'){
            isFieldValid=/\S+@\S+\.\S+/.test(e.target.value);
            // console.log(isFieldValid)
          }
          if(e.target.name === 'password'){
            const PassworShouldBeSixDigit=e.target.value.length>6;
            // console.log(PassworShouldBeSixDigit);//password minimum 6 digit hote hobe
            const passwordShouldContainsNumber=/^\d+$/.test(e.target.value)
            // console.log(passwordShouldContainsNumber)//password digit hote hobe

            // console.log(PassworShouldBeSixDigit,passwordShouldContainsNumber)
            // console.log(PassworShouldBeSixDigit && passwordShouldContainsNumber)
            isFieldValid=PassworShouldBeSixDigit && passwordShouldContainsNumber
          }
          if(isFieldValid){
            const newUserInfo={...user};
            newUserInfo[e.target.name]=e.target.value;
            newUserInfo[e.target.name]=e.target.value;
            setUser(newUserInfo)
          }
        }
        const handleBlur=(e)=>{
          // console.log(e.target.name,e.target.value)// blur e dile input e type korar por jkn oi kan tekhe onno kotao click korbo tkn console e utbe sob kicu type kora target value gula ek sathe.r onchange proti ta value change output show korbe.
          const newUserInfo={...user}
          newUserInfo[e.target.name]=e.target.value;
          setUser(newUserInfo)
        }

        const handleSubmit=(e)=>{
          e.preventDefault()
          // console.log(user.email,user.password)
          if(newUser && user.email && user.password){
                const auth = getAuth();
                createUserWithEmailAndPassword(auth, user.email, user.password)
                  .then((res) => {
                    // const user = userCredential.user;
                    const newUserInfo={...user};
                    newUserInfo.error='';
                    newUserInfo.success=true;
                    setUser(newUserInfo)
                    updateUserInfo(user.name)
                    console.log(res.user)
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    const newUserInfo={...user}
                    newUserInfo.error=errorMessage;
                    newUserInfo.success=false;
                    setUser(newUserInfo)
                  });
          }
          if(!newUser && user.email && user.password){
            const auth = getAuth();
            signInWithEmailAndPassword(auth, user.email, user.password)
              .then((res) => {
                // const user = userCredential.user;
                const newUserInfo={...user};
                newUserInfo.error='';
                newUserInfo.success=true;
                setUser(newUserInfo)
                console.log(res.user)
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                const newUserInfo={...user}
                newUserInfo.error=errorMessage;
                newUserInfo.success=false;
                setUser(newUserInfo)
              });
              }
        }

        const updateUserInfo=(name)=>{       
          const auth = getAuth();
          updateProfile(auth.currentUser, {
            displayName: name
          }).then(() => {
            // Profile updated!
            console.log('Profile Updated')
          }).catch((error) => {
            console.log(error)
          });
        }

  return (
    <div className="App">
      {
      user.isSignIn ? 
      <button onClick={handleSignOut}> Google Sign Out</button>:
      <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignIn && <div>
            <p>Welcome , {user.name}</p>
            <img src={user.photo} alt="this is Farhad vai" />
            <p>Your email:{user.email}</p>
        </div> 
      }
      <br />
      <button onClick={handleFbSignIn}>Facebook Sign In</button>
      <h1>Our Own Authentication</h1>
      {/* <p>Name:{user.name}</p>
      <p>Email:{user.email}</p>
      <p>Password:{user.password}</p> */}
      <form action="" onSubmit={handleSubmit}>
        <input onChange={()=>setNewUser(!newUser)} type="checkbox" name="newUser" id="" />
        <label htmlFor="newUser">New User Sign In</label> <br />
        {newUser && <input type="text" onBlur={handleBlur} name="name" placeholder="Type your name" />} <br />
        <input type="text" onChange={handleChange} name="email" placeholder="Enter your mail" required /> <br />
        <input type="password" onChange={handleChange} name="password" id="" placeholder="Enter your password" required /> <br />
        <input type="submit" value={newUser?"Sign Up":"Sign In"} />
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {user.success && <p style={{color:'Green'}}> User {newUser? 'Sign In' : "Log In"} successfuly</p>}
    </div>
  );
}

export default App;
