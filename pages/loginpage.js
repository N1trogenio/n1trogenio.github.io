$(document).ready(function(e) {

    $("#form-email-error").css("visibility", "hidden");
    $("#form-password-error").css("visibility", "hidden");
    $("#clie-password-error").css("visibility", "hidden");
    $("#forn-password-error").css("visibility", "hidden");
    $("#enti-password-error").css("visibility", "hidden");

    $("#form-confirm").on("click", function(e) {
        var exi = false;
        var valid = false;
        var user = $("#form-email");
        var pass = $("#form-password");
        $("#form-email-error").css("visibility", "hidden");
        $("#form-password-error").css("visibility", "hidden");

        function ajaxCall() {
            $.ajax({
                url: '../data/accounts.json',
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    console.log("Verifying account...");
                    for (i = 0; i < data.length; i++) {
                        if (data[i].username == user.val()) {
                            exi = true;
                            if (data[i].password == pass.val()) {
                                console.log("Logged on!");
                                sessionStorage.setItem("sessionType", data[i].type);
                                sessionStorage.setItem("loggedOn", true);
                                valid = true;
                                switch (data[i].type) {
                                    case '0':
                                        src = 'clie/clie.json';
                                        break;
                                    case '1':
                                        src = 'forn/forn.json';
                                        break;
                                    case '2':
                                        src = 'enti/enti.json';
                                }
                                $.ajax({
                                    url: '../data/' + src,
                                    method: 'GET',
                                    dataType: 'json',
                                    success: function(sess) {
                                        for (j = 0; j < sess.length; j++) {
                                            if (data[i].username == sess[j].Email) {
                                                sessionStorage.setItem("session", JSON.stringify(sess[j]));
                                                window.location.href="../index.html";
                                            }
                                        }
                                    }
                                })
                            }
                            break;
                        }
                    }

                    if (!exi) {
                        $("#form-email-error").css("visibility", "visible");
                    }
                    else if (!valid) {
                        $("#form-password-error").css("visibility", "visible");
                    }

                },
                error: function() {
                    console.log("Erro no ajax...");
                }
            });  
        }

        if (user.val().length > 0 && pass.val().length > 0) {
            ajaxCall();
        }
    });

    $('#reg-clie').on('click', function() {
        $("#clie-password-error").css("visibility", "hidden");
        if ($('#clie-password1').val() == $('#clie-password2').val() && $('#clie-password1').val().length != 0) {
            var sess = {
                "Email": $('#clie-email').val(),
                "StatusId": '-1',
                "Name": "",
                "Cont": "",
                "Favorites": {
                    "Product": [],
                    "Provider": []
                }
            }
            sessionStorage.setItem("sessionType", '0');
            sessionStorage.setItem("loggedOn", true);
            sessionStorage.setItem("session", JSON.stringify(sess));
            window.location.href = "../index.html";
        }
        else {
            $("#clie-password-error").css("visibility", "visible");
        }
    })

    $('#reg-forn').on('click', function() {
        $("#forn-password-error").css("visibility", "hidden");
        if ($('#forn-password1').val() == $('#forn-password2').val() && $('#forn-password1').val().length != 0) {
            var sess = {
                "Email": $('#forn-email').val(),
                "StatusId": "-1",
                "Address": "",
                "Id": "50",
                "Logo": "",
                "Profile": {
                    "Name": "",
                    "Desc": "",
                    "Photo": "",
                    "Cont": ""
                },
                "Cat": "",
                "Products": [],
                "Hour": {
                    "Week": [
                        {
                            "Start": "00:00",
                            "End": "00:00"
                        },
                        {
                            "Start": "00:00",
                            "End": "00:00"
                        },
                        {
                            "Start": "00:00",
                            "End": "00:00"
                        },
                        {
                            "Start": "00:00",
                            "End": "00:00"
                        },
                        {
                            "Start": "00:00",
                            "End": "00:00"
                        },
                        {
                            "Start": "00:00",
                            "End": "00:00"
                        },
                        {
                            "Start": "00:00",
                            "End": "00:00"
                        }
                    ],
                    "Except": []
                }
            }
            sessionStorage.setItem("sessionType", '1');
            sessionStorage.setItem("loggedOn", true);
            sessionStorage.setItem("session", JSON.stringify(sess));
            window.location.href = "../index.html";
        }
        else {
            $("#forn-password-error").css("visibility", "visible");
        }
    })

    $('#reg-enti').on('click', function() {
        $("#enti-password-error").css("visibility", "hidden");
        if ($('#enti-password1').val() == $('#enti-password2').val() && $('#enti-password1').val().length != 0) {
            var sess = {
                "Email": $('#enti-email').val(),
                "StatusId": "-1",
                "Id": 1000,
                "Area": "",
                "Profile": {
                    "Name": "",
                    "Desc": "",
                    "Photo": "",
                    "Cont": ""
                }
            }
            sessionStorage.setItem("sessionType", '2');
            sessionStorage.setItem("loggedOn", true);
            sessionStorage.setItem("session", JSON.stringify(sess));
            window.location.href = "../index.html";
        }
        else {
            $("#enti-password-error").css("visibility", "visible");
        }
    })
})