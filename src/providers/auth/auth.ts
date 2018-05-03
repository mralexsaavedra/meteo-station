import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Md5 } from 'ts-md5/dist/md5';
import firebase from 'firebase/app';

@Injectable()
export class AuthProvider {

  constructor(public afAuth: AngularFireAuth) {
  }

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, Md5.hashStr(newPassword).toString());
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);    
  }

  logoutUser(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signupUser(newEmail: string, newPassword: string, newName: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, Md5.hashStr(newPassword).toString())
      .then( newUser => {
        firebase.database().ref('/users').child(newUser.uid).set({ user: newEmail, name: newName, user_api: "2ARAL1XBQHRP02JC", channel_id: ""});
        newUser.updateProfile({
          displayName: newName,
          photoURL: null
        }).then(function() {
          //nothing
        }).catch(function(error) {
          console.log(error);        
        });    
    });
  }

}
