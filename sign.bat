cd "platforms\android\build\outputs\apk"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "F:\Github\STK_Soccer\certs\release.keystore" android-release-unsigned.apk niubility
zipalign -v 4 android-release-unsigned.apk SoccerBro.apk
