# leuzin
Front end app for nacc; using angular.js to interact with Rails app nacc.

It covers login/registration front-end, and a dashboard that will display neurral apps for the specific user.

### Components
leuzin is a plain HTML/Javascript web app designed using Angular.js, and styled Bootstrap.
* HTML <tt>html5</tt>
* Angular.js <tt>1.5.0, angular-ui-router 0.2.18</tt>
* Twitter Bootstrap <tt>bootstrap 3, ui-tpls-1.3.2</tt>
* Jquery <tt>2.2.0</tt>
leuzin is designed to gradually become a Progressive Web App.

### Mechanism
leuzin fires JSON requests to a back-end api called <tt>NACC</tt>, which sends JSON responses that are then processed into the Angular UI.

### Design

#### Registration
leuzin allows a user to send basic credentials such as name, email, and date-start.
* __Name__ - Basic user info
* __Email__ - _Required for authenticating the user_. This is essential for the passwordless session.
* __Date Start__ - _Required for generating ID for the user_. defines when the user started using the system. If leuzin is used for employee inventory, this can refer to the date the employee was hired.

After sending these data, an administrator must approve this user by changing the user status from <tt>for_auth</tt> to <tt>active</tt> in the user management Neurral module.


#### Login 
leuzin uses a new __singular-login__ approach that I based on the token-based authentication used in APIs today.

Singular Login uses a secure unique token for a user to use to access the system. This is singular as it is set for 1 user : 1 device : 1 period of time (configurable in <tt>NACC</tt>).

A user only has one token at one point in time (currently one day), that is set in the device that activated the access link in an email sent by Neurral after requesting for a token.

After successful approval by admin, a login email will be sent to the email provided by the user. The email contains an access link that when clicked, will set the device with a secure token for login.

* This token is unique to that device and to the user. Once activated from the email message, it cannot be set in other devices and the user cannot login into other devices without requesting a new token.
* All tokens will expire after 1 day (configurable in NACC), but the expiry will extend for every successful login during the active period.
* In exchange of not having to use a password and securing a singular-login-access policy only, the __user must ensure that the associated email address is secure__ as it is the only way to receive an access URL/link from Neurral to access the system. 

If trying to access leuzin from another browser or device, the user must use the __Request Token__ feature to generate a new token. (Note that this will also automatically invalidate the current active token.) The user must open the new access link that they will receive in the device or browser they intend to login with.

(More documentation to come)

#### Dashboard
leuzin loads the Neurral modules allowed for the user to this module after logging in. 
Example:
    For an admin, this may load the Use Management / approval Module
    For a guest, this may load a custom module set by admin, or his own profile.



