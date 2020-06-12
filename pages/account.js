$(document).ready(function() {

    $('#logout-button').on('click', function() {
        // sessionStorage.setItem('loggedOn', 'false');
        // sessionStorage.setItem('sessionType', '-1');
        // sessionStorage.setItem('sessionIndex', '-1');
        sessionStorage.clear();
        window.location.href = "../index.html";
    });

    var mainViewModel = function() {
        
        /* BEGINNING OF STARTER CODE */

        var self = this;
        self.loggedOn = ko.observable(sessionStorage.getItem("loggedOn") == 'true');
        self.session = ko.observable(JSON.parse(sessionStorage.getItem("session")));
        self.type = ko.observable();
        self.entiDisp = ko.observable();
        if (self.loggedOn()) {
            self.type(sessionStorage.getItem("sessionType"));
            self.entiDisp(self.session().StatusId);
            var res;
            if (self.session().StatusId == '-1') {
                res = self.session().Email;
            }
            else {
                switch (self.type()) {
                    case "0":
                        res = self.session().Name;
                        break;
                    case "1":
                        if (self.session().StatusId > -3 && self.session().StatusId < 2) {
                            res = self.session().Email;
                        }
                        else {
                            res = self.session().Profile.Name;
                        }
                        break;
                    case "2":
                        if (self.entiDisp() == '-1') {
                            res = self.session().Email;
                        }
                        else {
                            res = self.session().Profile.Name;
                        }
                }
            }
            
            $("#login-name").text('Conta (' + res + ')');
        }
        else {
            self.type("-1");
        }
        self.cart = ko.observableArray(JSON.parse(sessionStorage.getItem("cart")));
        // self.session = ko.observable({
        //     "Name": "",
        //     "StatusId": "",
        //     "Address": "",
        //     "Profile": {},
        //     "Hour": {
        //         "Except": []
        //     },
        //     "Favorites": {
        //         "Product": [],
        //         "Provider": []
        //     }

        // });

        /* 'undefined' handling */
        self.profileName = ko.observable("");
        self.profileCont = ko.observable("");
        self.profileExcept = ko.observableArray([]);
        if (self.type() != '0') {
            self.profileName(self.session().Profile.Name);
            self.profileCont(self.session().Profile.Cont);
            if (self.type() == '1') {
                self.profileExcept(self.session().Hour.Except)
            }
        }

        self.statusIcon = ko.pureComputed(function() {
            if (self.loggedOn()) {
                switch (self.session().StatusId) {
                    case "0": case "-1": case "-2": case "-3": return "times";
                    case "1": return "times";
                    case "2": return "question";
                    case "3":return "clock";
                    case "4": return "check";
                    default: return "ERROR.STATUS";
                }
            }
            return "";
        });

        self.statusName = ko.pureComputed(function() {
            if (self.loggedOn()) {
                switch (self.session().StatusId) {
                    case "0": return "Sem perfil";
                    case "1": return "Não confirmado";
                    case "2": return "Catálogo inativo";
                    case "3": return "Catálogo submetido";
                    case "4": return "Ativo";
                    case "-1": return "Email não confirmado";
                    case "-2": return "Perfil rejeitado";
                    case "-3": return "Catálogo rejeitado";
                    default: return 'ERROR.STATUS';
                }
            }
            return "";
        });

        self.entiStatus = ko.pureComputed(function () {
            if (self.loggedOn()) {
                switch (self.entiDisp()) {
                    case '-1': return 'Email não confirmado';
                    case '0': return 'Inativo';
                    case '1': return 'Disponível';
                    default: return 'ERROR.STATUS';
                }
            }
            return "";
        })

        /* END OF STARTER CODE */

        self.confirmDisp = function() {
            console.log(self.entiDisp());
            if (self.entiDisp() == '0') {
                if (confirm("Tem a certeza de que pretende efetuar entregas urgentes? (incumprimento da entrega implica uma penalização)")) {
                    self.entiDisp('1');
                    self.session().StatusId = '1';
                }
            }
            else {
                self.entiDisp('0');
                self.session().StatusId = '0';
            }
            sessionStorage.setItem("session", JSON.stringify(self.session()));
        }

        

    }

    ko.applyBindings(new mainViewModel);

    $(".before-load").css("display", "initial");
});