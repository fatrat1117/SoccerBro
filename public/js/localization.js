/**
 * Created by jixiang on 25/9/16.
 */

function localization() {
  var Localization  = Localization || {};
  Localization.browserLang = {
    userLang :  navigator.language || navigator.userLanguage,
    langCode : "en"
  }

  // alert(Localization.browserLang.userLang);

  $("[data-localize]").localize("example", { skipLanguage: "en-US" })
//using a regex will skip if the regex matches
//this would prevent loading of any english language translations
  $("[data-localize]").localize("example", { skipLanguage: /^en/ })
//using an array of strings will skip if any of the strings matches exactly
  $("[data-localize]").localize("example", { skipLanguage: ["en", "en-US"] })

  if (Localization.browserLang.userLang.toLowerCase() === "zh"||
    Localization.browserLang.userLang.toLowerCase() === "zh-cn" ||
    Localization.browserLang.userLang.toLowerCase() === "zh-sg" ||
    Localization.browserLang.userLang.toLowerCase() === "zh-hk" ||
    Localization.browserLang.userLang.toLowerCase() === "zh-tw"){
    $("[data-localize]").localize("files/SoccerBro", { language: "cn" })
  }else{
    $("[data-localize]").localize("SoccerBro", { language: "en" })
  }
}





