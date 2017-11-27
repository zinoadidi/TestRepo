"use strict";
$(document).ready(function () {


    $(".edit_field").each(function () {
        var x = $(this).val();
        // alert(x);
        $(this).val(x.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });

    $(".register").validate({
        rules: {

            Email: {
                required: true
            },
            Phonenumber: {
                required: true
            },
            password: {
                required: true
            },
            confirmPassword: {
                required: true,
                equalTo: "#password"
            },
            Surname: {
                required: true
            },
            Firstname: {
                required: true
            },
            Middlename: {
                required: true
            },
            Phonenumber: {
                required: true
            }
        },
        messages: {
            password: "Please provide a password",
            confirmPassword: {

                equalTo: "Password confirmation error"
            },
            Email: "Please enter a valid email address",
            terms: "Accept our terms and conditions",
            Surname: "Please provide a surname",
            Firstname: "Please provide a firstname",
            Middlename: "Please provide a middlename",
            Phonenumber: "Please provide a phonenumber"
        }
    });

    $(function () {
        $("#dob").datepicker({
            changeMonth: true,
            changeYear: true,
            yearRange: '1910:2010',
            dateFormat: 'yy/mm/dd'
        });
    });



    $(function () {
        var dateFormat = "yy-mm-dd",
                from = $("#datepicker_start")
                .datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    changeYear: true,
                    maxDate: (0)
                })
                .on("change", function () {
                    to.datepicker("option", "minDate", getDate(this));
                }),
                to = $("#datepicker_end").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            maxDate: (0)
        })
                .on("change", function () {
                    from.datepicker("option", "maxDate", getDate(this));
                });

        function getDate(element) {
            var date;
            try {
                date = $.datepicker.parseDate(dateFormat, element.value);
            } catch (error) {
                date = null;
            }

            return date;
        }
    });





    //document.getElementById("myForm").reset();

    $('#frequency').on('change', function () {
        if (this.value === 'Weekly') {
            $('#weekDays').show();
            $('#monthDays').hide();
        } else if (this.value === 'Monthly') {
            $('#weekDays').hide();
            $('#monthDays').show();
        }
    });

    $('.more_option').click(function () {
        $(".more_info").addClass('others_menu');
        $('.more_info').animate({height: 'toggle'});
    });

    $('.more_option_product').click(function () {
        $('.more_info_product').addClass('others_menu');
        $('.more_info_product').animate({height: 'toggle'});
    });

    $('.setting').click(function () {
        $(this).parent().find('.setting_item').animate({height: 'toggle'});
    });

    $('.help').click(function () {
        $(this).parent().find('.help_item').animate({height: 'toggle'});
    });


    $('#faqs h3').each(function () {
        var tis = $(this), state = false, answer = tis.next('div').hide().css('height', 'auto').slideUp();
        tis.click(function () {
            state = !state;
            answer.slideToggle(state);
            tis.toggleClass('active', state);
        });
    });

    //Trigger Tooltips site wide
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    //Registration Shenanigans

    function loadPreviews_click(e) {
        $('.upload-button').each(function () {
            var $input = $(this);
            var inputFiles = this.files;
            if (inputFiles == undefined || inputFiles.length == 0)
                return;
            var inputFile = inputFiles[0];

            var reader = new FileReader();
            reader.onload = function (event) {
                $('.upload-button-holder').css("background-image", "url('" + event.target.result + "')");
                $('#ProfilePic').val(event.target.result);
            };
            reader.onerror = function (event) {
                alert("I AM ERROR: " + event.target.error.code);
            };
            reader.readAsDataURL(inputFile);
        });
    }

    $(function () {
        $(".upload-button").change(loadPreviews_click);
    });


    $('.register-step-1').show();
    $('.register-step-2').hide();

    $('.register-step-1 .forward').click(function (e) {
        e.preventDefault();
        $('.register-step-1').hide();
        $('.register-step-2').show();
        return false;
    });

    $('.register-step-2 .back').click(function (e) {
        e.preventDefault();
        $('.register-step-1').show();
        $('.register-step-2').hide();
        return false;
    });

    //

    var x = 1;
    var option = "";

    if ($('.frequency').val() == "Weekly") {

        $('.frequency-depend').show();
        while (x <= 7) {
            switch (x) {
                case 1:
                    option += "<option value='Sunday'>Sunday</option>";
                    break;
                case 2:
                    option += "<option value='Monday'>Monday</option>";
                    break;
                case 3:
                    option += "<option value='Tuesday'>Tuesday</option>";
                    break;
                case 4:
                    option += "<option value='Wednesday'>Wednesday</option>";
                    break;
                case 5:
                    option += "<option value='Thursday'>Thursday</option>";
                    break;
                case 6:
                    option += "<option value='Friday'>Friday</option>";
                    break;
                case 7:
                    option += "<option value='Saturday'>Saturday</option>";
                    break;
                default:
                    option += "<option></option>";
                    break;
            }
            x++;
        }
        $('.frequency-day').attr('required', 'required');
        $('.frequency-day').html(option);

    } else if ($('.frequency').val() == "Monthly") {

        $('.frequency-depend').show();

        while (x <= 28) {
            option += "<option value='";
            option += x;
            option += "'>";
            option += x;
            option += "</option>";
            x++;
        }
        $('.frequency-day').attr('required', 'required');
        $('.frequency-day').html(option);

    } else {
        $('.frequency-day').removeAttr('required');
        $('.frequency-depend').hide();
    }

    $('.frequency').change(function () {

        var x = 1;
        var option = "";

        if ($('.frequency').val() == "Weekly") {

            $('.frequency-depend').show();
            while (x <= 7) {
                switch (x) {
                    case 1:
                        option += "<option value='";
                        option += x;
                        option += "'>Sunday</option>";
                        break;
                    case 2:
                        option += "<option value='";
                        option += x;
                        option += "'>Monday</option>";
                        break;
                    case 3:
                        option += "<option value='";
                        option += x;
                        option += "'>Tuesday</option>";
                        break;
                    case 4:
                        option += "<option value='";
                        option += x;
                        option += "'>Wednesday</option>";
                        break;
                    case 5:
                        option += "<option value='";
                        option += x;
                        option += "'>Thursday</option>";
                        break;
                    case 6:
                        option += "<option value='";
                        option += x;
                        option += "'>Friday</option>";
                        break;
                    case 7:
                        option += "<option value='";
                        option += x;
                        option += "'>Saturday</option>";
                        break;
                    default:
                        option += "<option></option>";
                        break;
                }
                x++;
            }
            $('.frequency-day').attr('required', 'required');
            $('.frequency-day').html(option);

        } else if ($('.frequency').val() == "Monthly") {

            $('.frequency-depend').show();

            while (x <= 28) {
                option += "<option value='";
                option += x;
                option += "'>";
                option += x;
                option += "</option>";
                x++;
            }
            $('.frequency-day').attr('required', 'required');
            $('.frequency-day').html(option);

        } else {
            $('.frequency-day').removeAttr('required');
            $('.frequency-depend').hide();
        }
    });

//    Investment Calculator
    function compoundInterest(principal, duration, rate) {
        return principal + (principal * rate * (duration / 12));
    }

    $("#cal-deduction,#cal-duration").keyup(function () {
        var rate = parseFloat($('.cal-rate').html()) / 100;
        var duration = parseFloat($('#cal-duration').val());
        var f = parseFloat($('#cal-deduction').val());
        var deduction = parseFloat($('#cal-deduction').val());

        var i, value = 0;
        for (i = duration; i > 0; i--) {
            deduction = f + value;
            value = compoundInterest(deduction, i / 12, rate);
        }

        $('#output').val("₦" + Math.round(deduction));
        return false;
    });

    //custom Goal
    $('input.number').keyup(function (event) {
        // skip for arrow keys
        if (event.which >= 37 && event.which <= 40)
            return;
        // format number
        $(this).val(function (index, value) {
            return value
                    .replace(/\D/g, "")
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    ;
        });
    });



    $('.custom-deduction').change(function () {

        var amount = $('.custom-amount').val();
        var deduction = $('.custom-deduction').val();

        var duration = 0;

        amount = amount.replace(/\,/g, '');
        amount = Number(amount);

        deduction = deduction.replace(/\,/g, '');
        deduction = Number(deduction);
        if (isNaN(duration)) {
            duration = 0;
        }
        if (duration = Math.ceil(amount / deduction)) {
            $('.custom-duration').val(duration);
        } else {
            $('.custom-duration').val(duration);
        }



    });

    $('.custom-deduction').keyup(function () {

        var amount = $('.custom-amount').val();
        var deduction = $('.custom-deduction').val();

        amount = amount.replace(/\,/g, '');
        amount = Number(amount);
        var duration = 0;
        deduction = deduction.replace(/\,/g, '');
        deduction = Number(deduction);

        if (isNaN(duration)) {
            duration = 0;
        }

        if (duration = Math.ceil(amount / deduction)) {
            $('.custom-duration').val(duration);
        } else {
            $('.custom-duration').val(duration);
        }



    });

    $('.custom-duration').change(function () {

        var amount = $('.custom-amount').val();
        var duration = $('.custom-duration').val();

        var deduction = Math.ceil(amount / duration);
        $('.custom-deduction').val(deduction);

    });

    $('.custom-duration').keyup(function () {

        var amount = $('.custom-amount').val();
        var duration = $('.custom-duration').val();

        var deduction = Math.ceil(amount / duration);
        $('.custom-deduction').val(deduction);

    });

    $('.custom-amount').change(function () {

        var amount = $('.custom-amount').val();
        var deduction = $('.custom-deduction').val();

        var duration = Math.ceil(amount / deduction);
        $('.custom-duration').val(duration);

    });

    $('.custom-amount').keyup(function () {

        var amount = $('.custom-amount').val();
        var deduction = $('.custom-deduction').val();

        var duration = Math.ceil(amount / deduction);
        $('.custom-duration').val(duration);

    });

//    Add Card Goal

    $('.add-card-goal').submit(function (e) {
        e.preventDefault();

        $('.add-card-goal .submit-button-holder input').attr('disabled', 'disabled');
        $('.add-card-goal .submit-button-holder input').val('Please wait...');

        var card = $('.add-card-goal .card').val();
        var month = $('.add-card-goal .month').val();
        var year = $('.add-card-goal .year').val();
        var cvv = $('.add-card-goal .cvv').val();

        $.post('/goal/addcard', {card: card, month: month, year: year, cvv: cvv}, function (data) {
            $('#myModal').modal('hide');
            var html = '<div class="col-xs-6 col-sm-4"><div class="card-select"><input type="radio" name="CardId" required value="' + data.Id + '">**** **** **** ' + data.CardNo + '</div></div>';
            $('.card-holder').append(html);
        });
    })

});

//  Update Goal Shenanigans

$('.change-card').click(function () {
    var card = $('.updateCardID:checked').val();
    var cardPan = $('.updateCardID:checked').data('card');
    $('.card-holder .card-select').html(cardPan);
    $('.update-goal .card').val(card);
});

$('.frequency').change(function () {
    var card = $('.frequency').val();
    $('.update-goal .frequencyf').val(card);
});

$('.frequency-day').change(function () {
    var card = $('.frequency-day').val();
    $('.update-goal .dayf').val(card);
});

$('.add-card-goal-edit').submit(function (e) {
    e.preventDefault();

    $('.add-card-goal-edit .submit-button-holder input').attr('disabled', 'disabled');
    $('.add-card-goal-edit .submit-button-holder input').val('Please wait...');

    var card = $('.add-card-goal-edit .card').val();
    var month = $('.add-card-goal-edit .month').val();
    var year = $('.add-card-goal-edit .year').val();
    var cvv = $('.add-card-goal-edit .cvv').val();

    $.post('/goal/addcard', {card: card, month: month, year: year, cvv: cvv}, function (data) {

        console.log(data);

        $('#myModal').modal('hide');

        $('.card-holder .card-select').html('**** **** **** ' + data.CardNo);
        $('.update-goal .card').val(data.Id);

    });


});





//Error Notification Handler
function intialiseErrorHandler() {
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(800);
    });
    $("#error-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#error-alert").slideUp(800);
    });
}


//Dashboard High chart details
function creditAndDebitChart(credit, debit) {
    Highcharts.theme = {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
            '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
            backgroundColor: {
                linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                stops: [
                    [0, '#C247A4'],
                    [1, '#56366D']
                ]
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            },
            plotBorderColor: '#606063'
        },
        title: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                }
            }
        },
        yAxis: {
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                style: {
                    color: '#A0A0A3'
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    color: '#B0B0B3'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    };






    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });






    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Transaction History'
        },
        subtitle: {
            text: 'Transaction History at a glance'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {// don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Amount (₦)'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: ₦{point.y:.2f}'
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: true,
                }
            }
        },

        series: [{
                name: 'Credit',
                // Define the data points. All series have a dummy year
                // of 1970/71 in order to be compared on the same x axis. Note
                // that in JavaScript, months start at 0 for January, 1 for February etc.
                data: credit
            }, {
                name: 'Debit',
                data: debit
            }
        ]
    });
}


function showItem(itemToToggle) {
    $(itemToToggle).show(1);
}
function hideItem(itemToToggle) {
    $(itemToToggle).hide(1);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function initializePasswordStrengthChecker() {
    jQuery(document).ready(function () {
        "use strict";
        var options = {
            minChar: 8,
            bootstrap3: true,
            errorMessages: {
                password_too_short: "<font color='red'>The Password is too short</font>",
                same_as_username: "Your password cannot be the same as your username"
            },
            scores: [17, 26, 40, 50],
            verdicts: ["Weak", "Normal", "Medium", "Strong", "Very Strong"],
            showVerdicts: true,
            showVerdictsInitially: false,
            raisePower: 1.4,
            usernameField: "#username",
        };
        $(':password').pwstrength(options);
    });
}



