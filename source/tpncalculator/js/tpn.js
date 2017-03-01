$("#button1").click(function() {
  $('#Page1').show();
  $('#Menu').hide();
});
$("#button2").onclick = function() {
  show('Page2', 'Menu')
};
$("#button3").onclick = function() {
  show('Menu', 'Page1')
};
$("#button4").onclick = function() {
  show('Menu', 'Page2')
};
$("#button5").onclick = function() {
  Calculate1()
};
$("#button6").onclick = function() {
  ConToHosp()
};
$("#button7").onclick = function() {
  ConToHome()
};
$("#button8").onclick = function() {
  TPNLF1()
};


function Calculate1() {
  var Weight = document.getElementById('Weight').value;
  var TotalVolume = document.getElementById('TotalVolume').value;
  var GoalRate = document.getElementById('GoalRate').value;
  var Dextrose = document.getElementById('Dextrose').value;
  var Sodium = document.getElementById('Sodium').value;
  var Potassium = document.getElementById('Potassium').value;
  var Acetate = document.getElementById('Acetate').value;
  var LineType = document.getElementsByName('LineType');

  var err1 = 0;
  var err2 = 1000;
  var text1 = "",
    text2 = "",
    text3 = "";
  var NaCl, KCl, NaAce, KAce;

  var TotSodium = Math.round(100 * 1000 * Sodium * Weight / TotalVolume) / 100;
  var TotPotassium = Math.round(100 * 1000 * Potassium * Weight / TotalVolume) / 100;
  var TotAcetate = Math.round(100 * 1000 * Acetate * Weight / TotalVolume) / 100;
  
  if (TotSodium>154) {
  alert("Warning:Hypertonic saline requested. Please consider reducing sodium to " + (Math.floor(154*TotalVolume/100/Weight)/10) + " mEq/kg/day to keep fluids isotonic");
  }

  if (LineType[1].checked) {
    TotPotassium = Math.min(TotPotassium, 40);
    Dextrose = Math.min(Dextrose, 12.5);
  }


  var saline = [154, 115.5, 77, 38.5, 0];
  var saline2 = ["NS", "3/4 NS", "1/2 NS", "1/4 NS", "W"];
  var salinechoice = "";


  for (i = 0; i < 5; i++) {
    var NaCl1 = saline[i];
    if (TotSodium > NaCl1) {
      var NaAce1 = Math.round(Math.min((TotSodium - NaCl1), TotAcetate) / 5) * 5;
    } else {
      var NaAce1 = 0;
    }
    var KAce1 = Math.round(Math.min(TotAcetate - NaAce1, TotPotassium) / 5) * 5;
    var KCl1 = Math.round((TotPotassium - KAce1) / 5) * 5;

    err1 = Math.abs(TotSodium - (NaCl1 + NaAce1)) + Math.abs(TotPotassium - (KCl1 + KAce1)) + Math.abs(TotAcetate - (KAce1 + NaAce1));

    if (err1 < err2) {
      NaCl = NaCl1;
      KCl = KCl1;
      KAce = KAce1;
      NaAce = NaAce1;
      salinechoice = saline2[i];
      err2 = err1;
    }
  }

  text1 = "Sodium (mEq/L): " + TotSodium + "<br>" + "Potassium (mEq/L): " + TotPotassium + "<br>" + "Acetate (mEq/L): " + TotAcetate;

  document.getElementById("output1").innerHTML = text1;
  document.getElementById("output1").style.display = "";

  text2 = "Try these fluids:" + "<br>" + "D" + Dextrose + " " + salinechoice;
  if (KCl > 0) {
    text2 = text2 + " + " + KCl + " mEq/L KCl";
  }
  if (NaAce > 0) {
    text2 = text2 + " + " + NaAce + " mEq/L Sodium Acetate";
  }
  if (KAce > 0) {
    text2 = text2 + " + " + KAce + " mEq/L Potassium Acetate";
  }
  text2 = text2 + " @ " + GoalRate + " mL/hr";

  document.getElementById("output2").innerHTML = text2;
  document.getElementById("output2").style.display = "";

}

function ConToHosp() {
  var Weight2 = document.getElementById('Weight2').value;
  var InfVol = document.getElementById('InfusionVolume').value;
  var HydVol = document.getElementById('HydrationVolume').value;
  var Dgram = document.getElementById('Dexg').value;
  var AAgram = document.getElementById('AAg').value;
  var Lipgram = document.getElementById('Lipidg').value;
  var LipCon = document.getElementById('LipidConc').value;
  var naclmeq = document.getElementById('naclmeq').value;
  var naacemeq = document.getElementById('naacemeq').value;
  var naphosmmol = document.getElementById('naphosmmol').value;
  var kclmeq = document.getElementById('kclmeq').value;
  var kacemeq = document.getElementById('kacemeq').value;
  var kphosmmol = document.getElementById('kphosmmol').value;
  var caglucmeq = document.getElementById('caglucmeq').value;
  var mgsomeq = document.getElementById('mgsomeq').value;
  var hours = document.getElementById('hours').value;

  document.getElementById('Lipidgkd').value = Math.round(10 * Lipgram / Weight2) / 10;
  document.getElementById('AA').value = Math.round(10 * AAgram / Weight2) / 10;
  document.getElementById('Camkd').value = Math.round(10 * caglucmeq / Weight2) / 10;
  document.getElementById('Mgmkd').value = Math.round(10 * mgsomeq / Weight2) / 10;
  document.getElementById('HydRate').value = Math.round(10 * (HydVol / hours)) / 10;

  var lipvol = Lipgram * 100 / LipCon;
  document.getElementById('LipidVol').value = lipvol;
  document.getElementById('LipidRate').value = Math.round(10 * lipvol / hours) / 10;

  document.getElementById('TPNVolume').value = InfVol - HydVol - lipvol;
  document.getElementById('Dext').value = Math.round(1000 * Dgram / (InfVol - HydVol - lipvol)) / 10;
  document.getElementById('Rate').value = Math.round(10 * (InfVol - HydVol - lipvol) / hours) / 10;

  var naphosmeq = (4 / 3) * naphosmmol;
  var kphosmeq = (4.4 / 3) * kphosmmol;
  document.getElementById('Namkd').value = Math.round(10 * (+naclmeq + +naacemeq + +naphosmeq) / Weight2) / 10;
  document.getElementById('Kmkd').value = Math.round(10 * (+kclmeq + +kacemeq + +kphosmeq) / Weight2) / 10;
  document.getElementById('Acemkd').value = Math.round(10 * (+naacemeq + +kacemeq) / Weight2) / 10;
  document.getElementById('Phosmkd').value = Math.round(10 * (+naphosmmol + +kphosmmol) / Weight2) / 10;

}

function ConToHome() {
  var W2 = document.getElementById('Weight2').value;
  var TPNvol = document.getElementById('TPNVolume').value;
  var Dexperc = document.getElementById('Dext').value;
  var AA = document.getElementById('AA').value;
  var Namkd = document.getElementById('Namkd').value;
  var Kmkd = document.getElementById('Kmkd').value;
  var Acemkd = document.getElementById('Acemkd').value;
  var Phosmkd = document.getElementById('Phosmkd').value;
  var Camkd = document.getElementById('Camkd').value;
  var Mgmkd = document.getElementById('Mgmkd').value;
  var GRate = document.getElementById('Rate').value;
  var Lipidgkd = document.getElementById('Lipidgkd').value;
  var LipVol = document.getElementById('LipidVol').value;
  var LipRate = document.getElementById('LipidRate').value;
  var HydRate = document.getElementById('HydRate').value;

  var LCon = document.getElementById('LipidConc').value;

  var hrs = Math.min(Math.round(TPNvol / GRate), 24);
  document.getElementById('hours').value = hrs;
  document.getElementById('HydrationVolume').value = +hrs * +HydRate;
  document.getElementById('InfusionVolume').value = Math.round(+TPNvol + (+LipVol * 20 / +LCon) + (+hrs * +HydRate));

  document.getElementById('caglucmeq').value = Math.round(10 * +Camkd * +W2) / 10;
  document.getElementById('mgsomeq').value = Math.round(10 * +Mgmkd * +W2) / 10;

  document.getElementById('Dexg').value = +Dexperc * +TPNvol / 100;
  document.getElementById('AAg').value = +AA * +W2;
  document.getElementById('Lipidg').value = +Lipidgkd * +W2;

  var Krem, Narem, Phosrem, Acerem;
  Krem = Kmkd * W2;
  Narem = Namkd * W2;
  Phosrem = Phosmkd * W2;
  Acerem = Acemkd * W2;

  if (Phosrem * 4.4 / 3 > Krem) {
    document.getElementById('kphosmmol').value = Math.round(30 / 4.4 * +Krem) / 10;
    Phosrem = +Phosrem - (+Krem * 3 / 4.4);
    Krem = 0;
  } else {
    document.getElementById('kphosmmol').value = Math.round(10 * +Phosrem) / 10;
    Krem = Krem - (Phosrem * 4.4 / 3);
    Phosrem = 0;
  }

  if (Phosrem * 4 / 3 > Narem) {
    document.getElementById('naphosmmol').value = Math.round(7.5 * +Narem) / 10;
    Narem = 0;
  } else {
    document.getElementById('naphosmmol').value = Math.round(10 * +Phosrem) / 10;
    Narem = +Narem - (+Phosrem * 4 / 3);
  }

  if (Narem > Acerem) {
    document.getElementById('naacemeq').value = Math.round(10 * Acerem) / 10;
    Narem = +Narem - +Acerem;
    Acerem = 0;
  } else if (Krem > Acerem) {
    document.getElementById('kacemeq').value = Math.round(10 * Acerem) / 10;
    Krem = +Krem - +Acerem;
    Acerem = 0;
  } else {
    document.getElementById('kacemeq').value = Math.round(10 * Krem) / 10;
    Acerem = +Acerem - +Krem;
    Krem = 0;
    document.getElementById('naacemeq').value = Math.round(10 * Math.min(Acerem, Narem)) / 10;
    Narem = Math.max(Narem - Acerem, 0);
  }

  document.getElementById('naclmeq').value = Math.max(Math.round(10 * Narem) / 10, 0);
  document.getElementById('kclmeq').value = Math.max(Math.round(10 * Krem) / 10, 0);

}

function TPNLF1() {
  var a1 = document.getElementById('Weight2').value;
  var a2 = document.getElementById('TPNVolume').value;
  var a3 = document.getElementById('Dext').value;
  var a4 = document.getElementById('Rate').value;
  var a5 = document.getElementById('Namkd').value;
  var a6 = document.getElementById('Kmkd').value;
  var a7 = document.getElementById('Acemkd').value;
  
  document.getElementById('Weight').value = a1;
  document.getElementById('TotalVolume').value = a2;
  document.getElementById('GoalRate').value = a4;
  document.getElementById('Dextrose').value = a3;
  document.getElementById('Sodium').value = a5;
  document.getElementById('Potassium').value = a6;
  document.getElementById('Acetate').value = a7;
  
  show('Page1','Page2')

}