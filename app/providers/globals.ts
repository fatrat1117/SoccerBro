'use strict';
export var prod = 0;
export var firebaseConfig = (1 === prod) ?
  {
    apiKey: "AIzaSyA9L3ja5ZcViqTc5Tgz8tG6QvJGlYO-fa4",
    authDomain: "stk-soccer.firebaseapp.com",
    databaseURL: "https://stk-soccer.firebaseio.com",
    storageBucket: "stk-soccer.appspot.com",
  } :
  {
    apiKey: "AIzaSyCrhL6g6rHs7-X09jw5Oq8I_g0fspD8bf8",
    authDomain: "project-3416565325366537224.firebaseapp.com",
    databaseURL: "https://project-3416565325366537224.firebaseio.com",
    storageBucket: "project-3416565325366537224.appspot.com",
  };