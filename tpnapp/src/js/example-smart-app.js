(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
                              'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
                              'http://loinc.org|2089-1', 'http://loinc.org|55284-4']
                      }
                    }
                  });

        var meds = smart.patient.api.fetchAll({
                    type: 'MedicationOrder',
                    query: {
                      status: "active"
                    }
                  });
        var mstatements = smart.patient.api.fetchAll({
                    type: 'MedicationStatement',
                  });
        var procedures = smart.patient.api.fetchAll({
                    type: 'Procedure',
                  });
        
        $.when(pt, obv).fail(onError);
        $.when(pt, meds).fail(onError);

        $.when(pt, obv, meds, procedures).done(function(patient, obv, meds, procedures) {
          var byCodes = smart.byCodes(obv, 'code');
          var gender = patient.gender;
          var dob = new Date(patient.birthDate);
          var day = dob.getDate();
          var monthIndex = dob.getMonth() + 1;
          var year = dob.getFullYear();

          var dobStr = monthIndex + '/' + day + '/' + year;
          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given.join(' ');
            lname = patient.name[0].family.join(' ');
          }

          var height = byCodes('8302-2');
          var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
          var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
          var hdl = byCodes('2085-9');
          var ldl = byCodes('2089-1');

          var p = defaultPatient();
          p.birthdate = dobStr;
          p.gender = gender;
          p.fname = fname;
          p.lname = lname;
          p.age = parseInt(calculateAge(dob));
          p.height = getQuantityValueAndUnit(height[0]);

          if (typeof systolicbp != 'undefined')  {
            p.systolicbp = systolicbp;
          }

          if (typeof diastolicbp != 'undefined') {
            p.diastolicbp = diastolicbp;
          }

          //p.hdl = getQuantityValueAndUnit(hdl[0]);
          p.hdl = "Bactrim2";
          p.ldl = getQuantityValueAndUnit(ldl[0]);

          /*smart.patient.api.fetchAllWithReferences({type: "MedicationOrder"},["MedicationOrder.medicationReference"]).then(function(results, refs) {
            results.forEach(function(prescription) {
              if (prescription.medicationCodeableConcept) {
                p.medlist = p.medlist + " " + getMedicationName(prescription.medicationCodeableConcept.coding);
              } else if (prescription.medicationReference) {
                var med = refs(prescription, prescription.medicationReference);
                p.medlist = p.medlist + " " + getMedicationName(med && med.code.coding || []);
              }
            });
          });*/
          if (meds.length > 0) {
            /*meds.forEach(function(script){

              p.medlist.push(getMedicationName(script.medicationCodeableConcept.coding));
              p.medlist.push(JSON.stringify(script.medicationCodeableConcept.coding[0].display));
              p.medlist.push(JSON.stringify(script.dosageInstruction[0].text));
              

            });*/
            p.medlist.push(JSON.stringify(meds));
          }

          if (mstatements.length > 0) {
            /*mstatements.forEach(function(script){
              p.mstatements.push(JSON.stringify(script));
             
            });*/
            p.mstatements.push(JSON.stringify(mstatements));
          }

          if (procedures.length > 0) {
            p.procedures.push(JSON.stringify(procedures));
          }

          ret.resolve(p);
        });
      } else {
        onError();
      } 

    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      age: {value: ''},
      height: {value: ''},
      systolicbp: {value: ''},
      diastolicbp: {value: ''},
      ldl: {value: ''},
      hdl: {value: ''},
      medlist: [],
      mstatements: [],
      procedures: [],
    };
  }

  function getBloodPressureValue(BPObservations, typeOfPressure) {
    var formattedBPObservations = [];
    BPObservations.forEach(function(observation){
      var BP = observation.component.find(function(component){
        return component.code.coding.find(function(coding) {
          return coding.code == typeOfPressure;
        });
      });
      if (BP) {
        observation.valueQuantity = BP.valueQuantity;
        formattedBPObservations.push(observation);
      }
    });

    return getQuantityValueAndUnit(formattedBPObservations[0]);
  }

  function isLeapYear(year) {
    return new Date(year, 1, 29).getMonth() === 1;
  }

  function calculateAge(date) {
    if (Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())) {
      var d = new Date(date), now = new Date();
      var years = now.getFullYear() - d.getFullYear();
      d.setFullYear(d.getFullYear() + years);
      if (d > now) {
        years--;
        d.setFullYear(d.getFullYear() - 1);
      }
      var days = (now.getTime() - d.getTime()) / (3600 * 24 * 1000);
      return years + days / (isLeapYear(now.getFullYear()) ? 366 : 365);
    }
    else {
      return undefined;
    }
  }

  function getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
        typeof ob.valueQuantity != 'undefined' &&
        typeof ob.valueQuantity.value != 'undefined' &&
        typeof ob.valueQuantity.unit != 'undefined') {
          return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
    } else {
      return undefined;
    }
  }

  function getMedicationName (medCodings) {
    var coding = medCodings.find(function(c){
      return c.system == "http://www.nlm.nih.gov/research/umls/rxnorm";
    });

    return coding && coding.display || "Unnamed Medication(TM)"
  }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#age').html(p.age);
    $('#height').html(p.height);
    $('#systolicbp').html(p.systolicbp);
    $('#diastolicbp').html(p.diastolicbp);
    $('#ldl').html(p.ldl);
    $('#hdl').html("Bactrim3");
    ml = "<ul>";
    p.medlist.forEach(function(m){
      ml = ml + "<li>" + m + "</li>";
    });
    ml = ml + "</ul>";
    $("#meds").html(ml);
    $("#medstatements").html(p.medstatements);
    $("#procedures").html(p.procedures);
  };

})(window);
