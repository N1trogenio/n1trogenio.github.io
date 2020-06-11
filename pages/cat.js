$(document).ready(function() {

    var mainViewModel = function() {

        /* BEGINNING OF STARTER CODE */

        var self = this;
        self.sectionList = ko.observableArray([]);
        self.filteredProducts = ko.observableArray([]);
        self.loggedOn = ko.observable(sessionStorage.getItem("loggedOn") == 'true');
        self.session = ko.observable(JSON.parse(sessionStorage.getItem("session")));

        for (i = 0; i < self.session().Products.length; i++) {
            if (!self.sectionList().includes(self.session().Products[i].Sect)) {
                self.sectionList.push(self.session().Products[i].Sect);
            }
        }
        
        self.filteredProducts(self.session().Products);

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
        self.cart = ko.observableArray(JSON.parse(sessionStorage.getItem("cart")));
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

        /* END OF STARTER CODE */

        self.removeSect = function(sect) {
            for (i = 0; i < self.sectionList().length; i++) {
                if (self.sectionList()[i] == sect) {
                    self.sectionList.splice(i, 1);
                    break;
                }
            }
        }

        self.addSect = function() {
            var sect = $('#section-name').val().trim();
            if (sect.length > 0) {
                if (!self.sectionList().includes(sect)) {
                    self.sectionList.push(sect);
                }
            }
        }

        self.removeProduct = function(prod) {
            for (i = 0; i < self.session().Products.length; i++) {
                if (JSON.stringify(self.session().Products[i])==JSON.stringify(prod)) {
                    self.session().Products.splice(i, 1);
                    self.filteredProducts(self.session().Products);
                    break;
                }
            }
        }

        self.addProduct = function() {
            var dados = [];
            dados.push($('#form-name').val().trim());
            dados.push($('#form-quant').val());
            dados.push($('#form-price').val() + '/' + $('#form-unit').val());
            dados.push($('#form-disc').val());
            if (dados[0].length*dados[1].length*dados[2].length*dados[3].length != 0) {
                var valid = true;
                var prod = {
                    "Name": dados[0],
                    "Quant": dados[1],
                    "Price": dados[2],
                    "Disc": dados[3],
                    "Sect": ""
                }
    
                for (i = 0; i < self.session().Products.length; i++) {
                    if (JSON.stringify(self.session().Products[i])==JSON.stringify(prod)) {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    self.session().Products.push(prod);
                    if ($('#section-filter').val().length == 0) {
                        self.filteredProducts(self.session().Products);
                    }
                }

                console.log(self.session().Products);
            }
            
        }

        self.changeSection = function(select, prod) {
            var sel = select.value;
            if (sel.length > 0) {
                for (i = 0; i < self.session().Products.length; i++) {
                    if (self.session().Products[i] == prod) {
                        self.session().Products[i].Sect = sel;
                        break;
                    }
                }
            }
        }

        $("#section-filter").on('change', function() {
            var sel = this.value;
            if (sel.length > 0) {
                self.filteredProducts(self.session().Products.filter(function(val) {
                    return val.Sect == sel;
                }))
            }
            else {
                self.filteredProducts(self.session().Products);
            }
        })

    }

    ko.applyBindings(new mainViewModel);

    $("#before-load").css("display", "initial");
});