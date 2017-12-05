
 $(document).ready(function(){ 
	dashboardApp = new Vue({
	  el: '#myDashboard',
	  data: {
	      	commonData:commonData
	  }
	});
	navApp = new Vue({
	  el: '#mySidebar',
	  data: {
	      	commonData:commonData
	  }
	});
	
	var testDash = String(sessionStorage.dashboardData)
	if ( testDash != 'undefined' && testDash != 'null' && testDash != ''){
		stats(sessionStorage.dashboardData,'existing');
		 updateDataFromApi(null)
	}else{
		startLoad()
        renda.get('/dashboardData/'+sessionStorage.UserId,'stats','new');
	}

});


 //functions for calculator 
function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              function Calculate(formObj)
                      {
                          document.forms["savings"].monthlydeposit.value = document.forms["savings"].monthlydeposit.value == 0?0:(parseFloat(document.forms["savings"].monthlydeposit.value)?parseFloat(document.forms["savings"].monthlydeposit.value):'');
                          document.forms["savings"].initialdeposit.value = document.forms["savings"].initialdeposit.value == 0?0:(parseFloat(document.forms["savings"].initialdeposit.value)?parseFloat(document.forms["savings"].initialdeposit.value):'');
                          var savings_result = 0;
                          var yt = 0;
                          var num_years = parseInt(formObj.numyears.options[formObj.numyears.selectedIndex].value);
                          var interest_rate = parseFloat(formObj.interestrate.value);
                          var initial_deposit = parseFloat(formObj.initialdeposit.value);
                          var monthly_deposit = parseFloat(formObj.monthlydeposit.value);

                           if (emptyField(formObj.monthlydeposit))
                              {
                                  alert("Please, give the monthly savings amount");
                                  document.forms["savings"].monthlydeposit.focus(); }

                          if (emptyField(formObj.numyears))
                              {
                                  alert("Please, give the Duration"); document.forms["savings"].numyears.focus(); }
                      else if (monthly_deposit < 0)
                              {
                                  alert("Please, give an amount greater than 0"); document.forms["savings"].monthlydeposit.focus(); }
                      else if (num_years < 0)
                              {
                                  alert("Please enter a valid number of years [ between 1 and 50 ]"); document.forms["savings"].numyears.focus(); }
                      else if (!isdigit(interest_rate))
                              {
                                  alert("Please enter a valid interest rate [ between 0 and 1000 ]"); document.forms["savings"].interestrate.focus(); }
                      else if (!isdigit(monthly_deposit))
                              {
                                  alert("Please, give a monthly savings amount."); document.forms["savings"].monthlydeposit.focus(); }
                      else if (!isdigit(initial_deposit))
                              {
                                  alert("Please, give a initial savings amount."); document.forms["savings"].initialdeposit.focus(); }
                      else
                              {
                                  var mi = interest_rate / 1200;
                                  var base = initial_deposit;
                                  var pp = 0;
                                  var yr = 0;
                                  //this is where the frequency will be implemented
                                  for (i = 0; i < num_years * 12; i++)
                                      {
                                          base = base * (1 + mi) + 1 * monthly_deposit;
                                          pp++
                                              if (pp == 12)
                                              {
                                                  yr++
                                                      if (yr < 10){
                                                          sp = " "
                                                      } else
                                                      {
                                                          sp = ""
                                                      }
                                              pp = 0;
                                          }
                                      }
                              document.getElementById("annualamount").value = "₦"+numberWithCommas(round_decimals(initial_deposit + (monthly_deposit * 12 * num_years), 2));
                              document.getElementById("result").value = "₦"+numberWithCommas(round_decimals(base, 2));
                              formObj.monthlydeposit.focus();
                          }
                      return false;
                  }
              function round_decimals(original_number, decimals){var result1 = original_number * Math.pow(10, decimals)
                      var result2 = Math.round(result1)
                      var result3 = result2 / Math.pow(10, decimals)
                      return(result3)
                  }
              function isdigit(c)
                      {
                          return((c >= '0') && (c <= '99999999999999999'));
                      }
              function delimit(numObj)
                      {
                          var arr = new Array(); var temp = numObj + 0; var n = 0; while (temp > 0)
                              {
                                  arr[n] = temp % 10;
                                  temp /= 10;
                                  temp = Math.floor(temp);
                                  ++n;
                              }
                      arr.reverse();
                      var len = arr.length;
                      var nOD = Math.floor(len / 3);
                      var fDP = len % 3;
                      if (nOD == 0)
                              return(numObj)
                      else if ((nOD == 1) && (fDP == 0))
                              return(numObj)
                      else
                      {
                          if (fDP == 0)
                                      {
                                          fDP = 3; --nOD;
                                    }
                              var p1 = 0, p2 = 0;
                              var res = new Array();
                              for (var i = 0; i < fDP; ++i)
                                      res[p2++] = arr[p1++] + "";
                                  res[p2++] = ","; --nOD;
                                  while (nOD >= 0)
                                      {
                                          for (var j = 0; j < 3; ++j)
                                              {res[p2++] = arr[p1++] + ""; }
                                      res[p2++] = ","; --nOD; }
                              res[--p2] = ""; var str = ""; for (var m = 0; m < res.length; ++m)
                                      {str += res[m]; }
                              return(str)}}
              function clearFnc(formObj)
                      {for (var z = 0; z < formObj.length; ++z)
                              {if (formObj[z].type == "text")
                                      formObj[z].value = ""; else
                                      formObj[z].selectedIndex = 0; }
                      formObj.amountsaved.focus(); return false; }
              function emptyField(textObj)
                      {if (textObj.value.length == 0)return true; for (var i = 0; i < textObj.value.length; ++i)
                              {var ch = textObj.value.charAt(i); if (ch != ' ' && ch != '\t')return false; }
                      return true; }
              function reFocus(){
                setTimeout("document.forms['savings'].amountsaved.focus()", 1); 
              }
/*request stat data*/

