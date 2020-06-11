$(document).ready(function() {

    var mainViewModel = function() {

        /* BEGINNING OF STARTER CODE */

        var self = this;
        self.sectionList = ko.observableArray([]);
        self.filteredProducts = ko.observableArray([]);
        self.loggedOn = ko.observable(sessionStorage.getItem("loggedOn") == 'true');
        self.type = ko.observable();
        self.email = ko.observable(sessionStorage.getItem("sessionEmail"));
        self.cart = ko.observableArray(JSON.parse(sessionStorage.getItem("cart")));
        self.session = ko.observable({
            "Name": "",
            "StatusId": "",
            "Address": "",
            "Profile": {},
            "Hour": {
                "Except": []
            },
            "Favorites": {
                "Product": [],
                "Provider": []
            },
            "Products": []

        });
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

        if (self.loggedOn()) {
            self.type(sessionStorage.getItem("sessionType"));
            var src;
            switch (self.type()) {
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
                success: function(data) {
                    for (i = 0; i < data.length; i++) {
                        if (data[i].Email == self.email()) {
                            self.session(data[i]);
                            console.log(self.session());
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

                            for (j = 0; j < data[i].Products.length; j++) {
                                if (!self.sectionList().includes(data[i].Products[j].Sect)) {
                                    self.sectionList.push(data[i].Products[j].Sect);
                                }
                            }
                            
                            self.filteredProducts(self.session().Products);

                            break;
                        }
                    }
                },
                error: function() {
                    console.log("Erro no ajax...");
                }
            });
        }
        else {
            self.type("-1");
        }

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