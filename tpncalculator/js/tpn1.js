$(document).ready(function() {
  
  $("#button1").click(function() {
    $('#Page1').show();
    $('#Menu').hide();
  });

  $("#button2").click(function() {
    $('#Page2').show();
    $('#Menu').hide();
  });

  $("#button3").click(function() {
    $('#Menu').show();
    $('#Page1').hide();
  });

  $("#button4").click(function() {
    $("#Menu").show();
    $('#Page2').hide();
  });

  $("#button5").click(function() {
    var Weight = $('#Weight').val();
    var TotalVolume = $('#TotalVolume').val();
    var GoalRate = $('#GoalRate').val();
    var Dextrose = $('#Dextrose').val();
    var Sodium = $('#Sodium').val();
    var Potassium = $('#Potassium').val();
    var Acetate = $('#Acetate').val();
    var LineType = $("input[name='LineType']:checked").val();

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

    if (LineType==1) {
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

    $("#output1").html(text1);
    $("#output1").show();

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

    $("#output2").html(text2);
    $("#output2").show();
  });


$("#button6").click(function() {
  var Weight2 = $("#Weight2").val();
  var InfVol = $("#InfusionVolume").val();
  var HydVol = $("#HydrationVolume").val();
  var Dgram = $("#Dexg").val();
  var AAgram = $("#AAg").val();
  var Lipgram = $("#Lipidg").val();
  var LipCon = $("#LipidConc").val();
  var naclmeq =$("#naclmeq").val();
  var naacemeq = $("#naacemeq").val();
  var naphosmmol = $("#naphosmmol").val();
  var kclmeq = $("#kclmeq").val();
  var kacemeq = $("#kacemeq").val();
  var kphosmmol = $("#kphosmmol").val();
  var caglucmeq = $("#caglucmeq").val();
  var mgsomeq = $("#mgsomeq").val();
  var hours = $("#hours").val();

  var lipidgkd = Math.round(10 * Lipgram / Weight2) / 10;
  var aa = Math.round(10 * AAgram / Weight2) / 10;
  var camkd = Math.round(10 * caglucmeq / Weight2) / 10;
  var mgmkd= Math.round(10 * mgsomeq / Weight2) / 10;
  var hydRate = Math.round(10 * (HydVol / hours)) / 10;

  var lipvol = Lipgram * 100 / LipCon;
  var lipidVol = lipvol;
  var lipidRate = Math.round(10 * lipvol / hours) / 10;

  var TPNVolume = InfVol - HydVol - lipvol;
  var Dext = Math.round(1000 * Dgram / (InfVol - HydVol - lipvol)) / 10;
  var rate = Math.round(10 * TPNVolume / hours) / 10;

  var naphosmeq = (4 / 3) * naphosmmol;
  var kphosmeq = (4.4 / 3) * kphosmmol;
  var namkd = Math.round(10 * (+naclmeq + +naacemeq + +naphosmeq) / Weight2) / 10;
  var kmkd = Math.round(10 * (+kclmeq + +kacemeq + +kphosmeq) / Weight2) / 10;
  var acemkd = Math.round(10 * (+naacemeq + +kacemeq) / Weight2) / 10;
  var phosmkd = Math.round(10 * (+naphosmmol + +kphosmmol) / Weight2) / 10;

  var outputtext = "Try these parameters:" + "<br/ >" 
    + "TPN volume: " + TPNVolume + "<br />" 
    + "Dextrose conc: " + Dext + "<br />"
    + "Na (mEq/kg/day): " + namkd + "<br />"
    + "K (mEq/kg/day): " + kmkd + "<br />"
    + "Acetate (mEq/kg/day): " + acemkd + "<br />"
    + "Phos (mEq/kg/day): " + phosmkd + "<br />";
    + "Rate: " + rate;

  $("#output3").html(outputtext);
  $("#output3").show();
  });

$("#button7").click(function() {
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
});
});