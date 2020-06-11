$(document).ready(function() {

    var mainViewModel = function() {

        /* BEGINNING OF STARTER CODE */

        var self = this;
        self.loggedOn = ko.observable(sessionStorage.getItem("loggedOn") == 'true');
        self.session = ko.observable(JSON.parse(sessionStorage.getItem("session")));
        self.type = ko.observable();
        if (self.loggedOn()) {
            self.type(sessionStorage.getItem("sessionType"));
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
        self.email = ko.observable(sessionStorage.getItem("sessionEmail"));
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
        self.accountName = ko.observable();

        self.statusIcon = ko.pureComputed(function() {
            var res;
            switch (self.session().StatusId) {
                case "0": case "-1": case "-2": case "-3":
                    res = "times";
                    break;
                case "1":
                    res = "times";
                    break;
                case "2":
                    res = "question";
                    break;
                case "3":
                    res = "clock";
                    break;
                case "4":
                    res = "check";
            }
            return res;
        });

        self.statusName = ko.pureComputed(function() {
            var res;
            switch (self.session().StatusId) {
                case "0":
                    res = "Sem perfil";
                    break;
                case "1":
                    res = "Não confirmado";
                    break;
                case "2":
                    res = "Catálogo inativo";
                    break;
                case "3":
                    res = "Catálogo submetido";
                    break;
                case "4":
                    res = "Ativo";
                    break;
                case "-1":
                    res = "Email não confirmado";
                    break;
                case "-2":
                    res = "Perfil rejeitado";
                    break;
                case "-3":
                    res = "Catálogo rejeitado";
            }
            return res;
        });

        // if (self.loggedOn()) {
        //     self.type(sessionStorage.getItem("sessionType"));
        //     var src;
        //     switch (self.type()) {
        //         case '0':
        //             src = 'clie/clie.json';
        //             break;
        //         case '1':
        //             src = 'forn/forn.json';
        //             break;
        //         case '2':
        //             src = 'enti/enti.json';
        //     }
        //     $.ajax({
        //         url: '../data/' + src,
        //         method: 'GET',
        //         dataType: 'json',
        //         success: function(data) {
        //             for (i = 0; i < data.length; i++) {
        //                 if (data[i].Email == self.email()) {
        //                     console.log("YAY");
        //                     self.session(data[i]);
        //                     console.log(self.session());
        //                     var res;
        //                     switch (self.type()) {
        //                         case "0":
        //                             res = self.session().Name;
        //                             break;
        //                         case "1":
        //                             if (self.session().StatusId > -3 && self.session().StatusId < 2) {
        //                                 res = self.session().Email;
        //                             }
        //                             else {
        //                                 res = self.session().Profile.Name;
        //                             }
        //                             break;
        //                         case "2":
        //                             res = self.session().Email;
        //                     }
        //                     $("#login-name").text('Conta (' + res + ')');
        //                     break;
        //                 }
        //             }
        //         },
        //         error: function() {
        //             console.log("(MAIN) Erro no ajax...");
        //         }
        //     });
        // }
        // else {
        //     self.type("-1");
        // }

        /* END OF STARTER CODE */
        self.delivDay = ko.observable();
        /*
        -1-Não selecionado
        0-Data inválida
        1-Urgente
        2-Não urgente
        */
        self.delivStatus = ko.pureComputed(function() {
            var status = -1;
            if (self.delivDay() != undefined) {
                status = 2;
                var today = new Date();
                todayArr = [];
                todayArr.push(String(today.getFullYear()));
                todayArr.push(String(today.getMonth() + 1).padStart(2, '0'));
                todayArr.push(String(today.getDate()).padStart(2, '0'));
                selecArr = self.delivDay().split("-");
                if (todayArr[0] == selecArr[0]) {
                    if (todayArr[1] == selecArr[1]) {
                        var dayToday = parseInt(todayArr[2]);
                        var daySelec = parseInt(selecArr[2]);
                        if (dayToday + 3 >= daySelec && daySelec >= dayToday) {
                            status = 1;
                        }
                        else if (dayToday > daySelec) {
                            status = 0;
                        }
                    }
                }
            }
            return status;
        })

        self.statusName = ko.pureComputed(function() {
            switch (self.delivStatus()) {
                case 0: return "Data inválida";
                case 1: return "Urgente";
                case 2: return "Não urgente";
                case -1: return "Não selecionado";
            }
        })

        self.totalCart = ko.computed(function() {
            var sum = 0;
            self.cart().forEach(element => {
                sum += parseInt(element.Price.split('/')[0]) * (1 + parseInt(element.Disc)/100) * parseInt(element.Quant);
            })
            return Math.round(sum*100)/100;
        })

        /* Os portes de envio são simulados */
        self.totalDeliv = ko.computed(function() {
            if (self.delivStatus() == 1) {
                return Math.round(self.totalCart() * 40)/100;
            }
            return Math.round(self.totalCart() * 10)/100;
        })

        self.totalPay = ko.computed(function() {
            return Math.round((self.totalCart() + self.totalDeliv())*100)/100;
        })

        self.removeItem = function(item) {
            for (i = 0; i < self.cart().length; i++) {
                if (JSON.stringify(self.cart()[i])==JSON.stringify(item)) {
                    self.cart.splice(i, 1);
                    sessionStorage.setItem("cart", JSON.stringify(self.cart()));
                    break;
                }
            }
        }

    }

    ko.applyBindings(new mainViewModel);

    $("#before-load").css("display", "initial");
});