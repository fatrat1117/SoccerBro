import {Modal, NavController, Page, ViewController} from 'ionic-angular';
import {Component, OnInit, Inject} from '@angular/core';
import {
    FIREBASE_PROVIDERS, defaultFirebase,
    AngularFire, firebaseAuthConfig, AuthProviders,
    AuthMethods
} from 'angularfire2';
import {CordovaOauth, Facebook} from 'ng2-cordova-oauth/core';
import {transPipe} from '../../providers/localization'
declare let firebase: any;

@Page({
    templateUrl: 'build/pages/login/login.html',
    pipes: [transPipe]
})
export class LoginPage {

    error: any
    busy: boolean;
    _credentials: any;
    private facebookProvider: Facebook = new Facebook({
        clientId: "463670290510920",
        appScope: ["email"]
    })
    private cordovaOauth: CordovaOauth = new CordovaOauth();

    constructor(public af: AngularFire,
        public viewCtrl: ViewController
    ) {
        this._credentials = {
            email: '',
            password: ''
        };
        this.busy = false;
        //this.cordovaOauth = new CordovaOauth(new Facebook({ clientId: "463670290510920", appScope: ["email"] }));
        //this.cordovaOauth = new CordovaOauth(new Facebook({clientId: "502807016597247", appScope: ["email"]}));
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
    /**
     * this create in the user using the form credentials. 
     *
     * we are preventing the default behavor of submitting 
     * the form
     * 
     * @param _credentials {Object} the email and password from the form
     * @param _event {Object} the event information from the form submit
     */
    registerUser(_event) {
        _event.preventDefault();
        this.busy = true;

        let self = this;
        let _credentials = this._credentials;
        console.log("create user");
        this.af.auth.createUser(_credentials)
            .then((user) => {
                console.log(`Create User Success:`, user);
                //_credentials.created = true;
                self.dismiss();
                //return this.login(_credentials, _event);
            })
            .catch(e => {
                self.error = e;
                self.busy = false;
            });
    }

    registerUserWithFacebook(_event) {
        _event.preventDefault();
        let self = this;

        this.busy = true;
        //console.log(this.cordovaOauth);
        this.cordovaOauth.logInVia(this.facebookProvider).then(success => {
            console.log("Facebook success: " + JSON.stringify(success));
            let creds = firebase.auth.FacebookAuthProvider.credential(success["access_token"]);
            //console.log(creds);

            let providerConfig = {
                provider: AuthProviders.Facebook,
                method: AuthMethods.OAuthToken,
                remember: 'default',
                scope: ['email'],
            };

            this.af.auth.login(creds, providerConfig).then((value) => {
                console.log('firebase success');
                //console.log(value);
                this.dismiss();
            }).catch((error) => {
                this.error = error;
                self.busy = false;
            });
        }).catch((error) => {
            //this.error = error;
            self.busy = false;
        });
    }

    registerUserWithWechat(_event) {

    }
    /**
     * this logs in the user using the form credentials.
     * 
     * if the user is a new user, then we need to create the user AFTER
     * we have successfully logged in
     * 
     * @param _credentials {Object} the email and password from the form
     * @param _event {Object} the event information from the form submit
     */
    login(credentials, _event) {
        _event.preventDefault();
        // if this was called from the register user,  the check if we 
        // need to create the user object or not
        // let addUser = credentials.created
        // credentials.created = null;
        let self = this;
        this.busy = true;
        // login usig the email/password auth provider
        this.af.auth.login(credentials, {
            provider: AuthProviders.Password,
            method: AuthMethods.Password
        }).then((authData) => {
            //console.log(authData)
            // if (addUser) {
            //     const itemObservable = this.af.database.object('/users/' + authData.uid);
            //     itemObservable.set({
            //         "provider": authData.auth.providerData[0].providerId,
            //         "avatar": authData.auth.photoURL || "MISSING",
            //         "displayName": authData.auth.providerData[0].displayName || authData.auth.email,
            //     })
            // } else {
            this.dismiss();
            //}
        }).catch((error) => {
            this.error = error
            self.busy = false;
            //console.log(error)
        });
    }

    ResetPassword() {
        let self = this;
        this.busy = true;
        firebase.auth().sendPasswordResetEmail(this._credentials.email).then(_ => {
            alert("check your email to reset password");
            self.busy = false;
        }).catch(err => {
            alert(err);
            self.busy = false;
        });
    }
}