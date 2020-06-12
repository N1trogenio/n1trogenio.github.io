$(document).ready(function() {

    var mainViewModel = function() {
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
                        res = self.session().Email;
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
        //     }
        // });
        self.accountName = ko.observable();

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
                switch (self.session().StatusId) {
                    case '-1': return 'Email não confirmado';
                    case '0': return 'Inativo';
                    case '1': return 'Disponível';
                    default: return 'ERROR.STATUS';
                }
            }
            return "";
        })
        
    }

    ko.applyBindings(new mainViewModel);

});