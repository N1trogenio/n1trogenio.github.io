$(document).ready(function() {

    var marketsViewModel = function() {

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
                        res = self.session().Email;
                }
            }
            
            $("#login-name").text('Conta (' + res + ')');
        }
        else {
            self.type("-1");
        }
        self.cart = ko.observableArray(JSON.parse(sessionStorage.getItem("cart")));
        self.sectionList = ko.observableArray([]);
        self.favoriteFornList = ko.observableArray([]);
        self.favoriteProdList = ko.observableArray([]);
        if (self.type() == '0' && self.loggedOn()) {
            self.favoriteFornList(self.session().Favorites.Provider);
            self.favoriteProdList(self.session().Favorites.Provider);
        }
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

        /* END OF STARTER CODE */

        var id = window.location.hash;
        id = id.replace('#', '');
        var mapLoaded = false;
        var map;
        self.details = ko.observable(false);
        self.showBoxGrid = ko.observable(true);
        self.mapView = ko.observable(false);
        self.fornList = ko.observableArray([]);
        self.filteredFornList = ko.observableArray([]);
        self.filteredProducts = ko.observableArray([]);
        /*
        Inicializado com um Fornecedor apenas para testes.
        Permite testar como a informação de um Fornecedor é disponibilizada sem
        recorrer a chamadas AJAX, que neste caso são possíveis apenas num servidor local
        */
        self.selectedForn = ko.observable({
            "Email": "um.fornecedor@dom.pt",
            "StatusId": "4",
            "Address": "Aveiro",
            "Id": "100",
            "Logo": "100.png",
            "Profile": {
                "Name": "Retalho do João",
                "Desc": "Retalho do João. Localizado em Aveiro. Vendemos variados produtos.",
                "Photo": "100.jpg",
                "Cont": "[contactos]"
            },
            "Cat": "Tudo",
            "Products": [
                {
                    "Name": "Maçã Fuji",
                    "Quant": "20",
                    "Price": "1.49€/kg",
                    "Disc": "10"
                },
                {
                    "Name": "Laranja",
                    "Quant": "42",
                    "Price": "1.99€/kg",
                    "Disc": "0"
                }
            ],
            "Hour": {
                "Week": [
                    {
                        "Start": "09:00",
                        "End": "20:00",
                    },
                    {
                        "Start": "09:00",
                        "End": "20:00",
                    },
                    {
                        "Start": "09:00",
                        "End": "20:00",
                    },
                    {
                        "Start": "09:00",
                        "End": "20:00",
                    },
                    {
                        "Start": "09:00",
                        "End": "20:00",
                    },
                    {
                        "Start": "09:00",
                        "End": "20:00",
                    },
                    {
                        "Start": "00:00",
                        "End": "00:00",
                    }
                ],
                "Except": [
                    "24/12",
                    "25/12",
                    "10/06"
                ]
            }
        });

        function ajaxCall() {
            $.ajax({
                url: '../data/forn/forn.json',
                method: 'GET',
                dataType: 'json',
                success: function(data) {
                    for (i = 0; i < data.length; i++) {
                        if (data[i].StatusId == '4') {
                            self.fornList.push(data[i]);
                        }
                    }
                    self.filteredFornList(self.fornList());
                },
                error: function() {
                    console.log("Erro no ajax...");
                    self.fornList.push(self.selectedForn());
                }
            });
        }
        ajaxCall();

        if (id.length != 0) {
            for (i = 0; i < self.fornList().length; i++) {
                if (self.fornList()[i].Id == id) {
                    self.selectedForn(self.fornList()[i]);
                    self.filteredProducts(self.selectedForn().Products);
                    self.sectionList([]);
                    for (j = 0; j < self.selectedForn().Products.length; j++) {
                        if (!self.sectionList().includes(self.selectedForn().Products[j].Sect && self.selectedForn().Products[j].Sect.length > 0)) {
                            self.sectionList.push(self.selectedForn().Products[j].Sect);
                        }
                    }
                    self.details(true);
                    break;
                }
            }/*Alternativa (não dá para pôr 'break')
            self.fornList().forEach(elem => {
                if (elem.Id == id) {
                    self.selectedForn(elem);
                    self.details(true);
                }
            });
            */
        }

        if (!self.loggedOn() || self.type()!='0') {
            $("#extraMenu").css({"width": "15%"});
        }

        $("#view-opt").click(function(e) {
            console.log(self.fornList());
            if (self.showBoxGrid()) {
                self.showBoxGrid(false);
            } 
            else {
                self.showBoxGrid(true);
            }
        });

        self.morphDetails = function(arg) {
            if (self.details()) {
                self.details(false);
                window.location.href = "markets.html#";
            } 
            else {
                self.details(true);
                self.selectedForn(arg);
                self.sectionList([]);
                for (j = 0; j < self.selectedForn().Products.length; j++) {
                    if (!self.sectionList().includes(self.selectedForn().Products[j].Sect) && self.selectedForn().Products[j].Sect.length > 0) {
                        self.sectionList.push(self.selectedForn().Products[j].Sect);
                    }
                }
                self.filteredProducts(arg.Products);
                window.location.href = "markets.html#" + arg.Id;
            }
        }

        self.morphMap = function() {
            if (self.mapView()) {
                self.mapView(false);
            }
            else {
                self.mapView(true);
                if (!mapLoaded) {
                    mapLoaded = true;
                    map = new ol.Map({
                        target: 'map',
                        layers: [
                          new ol.layer.Tile({
                            source: new ol.source.OSM()
                          }),
                          /*
                          new ol.layer.Text("Fornecedores", {
                            location: "../data/forn/locations.txt",
                            projection: map.displayProjection
                          })
                          */
                        ],
                        view: new ol.View({
                          center: [-938799.8052258492, 4928698.977435714],
                          extent: [-1161533.3981280336, 4374688.101751428, -641222.6919913596, 5189254.934416671],
                          showFullExtent: true,
                          zoom: 9,
                          minZoom: 7,
                        })
                    });
                }
            }
        }

        self.isFavoriteForn = function(arg) {
            if (self.type() == '0' && self.loggedOn()) {
                var favProv = self.session().Favorites.Provider;
                for (i = 0; i < favProv.length; i++) {
                    if (favProv[i] == arg.Profile.Name) {
                        return true;
                    }
                }
            }
            return false;
        }

        self.favoriteForn = function(arg) {
            if (self.type() == '0' && self.loggedOn()) {
                var favProv = self.session().Favorites.Provider;
                var exi = false;
                if (self.isFavoriteForn(arg)) {
                    for (i = 0; i < favProv.length; i++) {
                        if (favProv[i] == arg.Profile.Name) {
                            exi = true;
                            break;
                        }
                    }
                }
                else {
                    favProv.push(arg);
                }
                $("#" + arg.Id).toggleClass("favorited");
            } 
        }

        self.isFavoriteProd = function(arg) {
            if (self.type() == '0' && self.loggedOn()) {
                var favProd = self.session().Favorites.Product;
                for (i = 0; i < favProd.length; i++) {
                    if (favProd[i] == arg.Name) {
                        return true;
                    }
                }
            }
            return false;
        }

        self.favoriteProd = function(arg) {
            if (self.type() == '0' && self.loggedOn()) {
                var favProd = self.session().Favorites.Product;
                if (self.isFavoriteProd(arg)) {
                    for (i = 0; i < favProd.length; i++) {
                        if (favProd[i] == arg.Name) {
                            favProd.splice(i, 1);
                            break;
                        }
                    }
                }
                else {
                    favProd.push(arg);
                }
                $("#" + arg.Name).toggleClass("favorited");
            }
        }

        self.finalPrice = function(prod) {
            return Math.round(parseFloat(prod.Price) * (1 - prod.Disc/100) * 100)/100;
        }

        self.unitPrice = function(prod) {
            return prod.Price.split("/")[1];
        }

        self.filter = function() {
            console.log("Filtering...");
            var res = self.fornList();
            var filters = [];
            var dayId = 0;
            filters.push($('#form-search').val().toLowerCase().trim());
            filters.push($('#form-time1').val());
            filters.push($('#form-time2').val());
            filters.push($('#form-dia').val());
            filters.push($('#form-local').val().toLowerCase().trim());
            filters.push($('#form-cat').val());
            switch (filters[3]) {
                case "tue":
                    dayId = 1;
                    break;
                case "wed":
                    dayId = 2;
                    break;
                case "thu":
                    dayId = 3;
                    break;
                case "fri":
                    dayId = 4;
                    break;
                case "sat":
                    dayId = 5;
                    break;
                case "sun":
                    dayId = 6;
            }
            res = res.filter(function(val) {
                console.log(val);
                return (val.Profile.Name.toLowerCase().includes(filters[0]) || filters[0].length == 0)
                    && ((val.Hour.Week[dayId].Start <= filters[1] && val.Hour.Week[dayId].End >= filters[2]) || filters[3]=="any")
                    && (val.Address.toLowerCase().includes(filters[4]) || filters[4].length == 0)
                    && (val.Cat == filters[5] || filters[5] == 'any');
            });
            console.log(res);
            self.filteredFornList(res);
        }

        self.addCart = function(prod) {
            if ($('#qnt' + prod.Id).val() > 0) {
                var pDet = {
                    "Name": prod.Name,
                    "Quant": $('#qnt' + prod.Id).val(),
                    "Price": prod.Price,
                    "Disc": prod.Disc,
                    "Id": prod.Id,
                    "Provider": {
                        "Name": self.selectedForn().Profile.Name,
                        "Id": self.selectedForn().Id,
                        "Address": self.selectedForn().Address
                    }
                }
                for (i = 0; i < self.cart().length; i++) {
                    if (self.cart()[i].Id == pDet.Id && self.cart()[i].Provider.Id == pDet.Provider.Id) {
                        self.cart.splice(i, 1);
                    }
                }
                self.cart.push(pDet);
                sessionStorage.setItem("cart", JSON.stringify(self.cart()))
            }
        }

        $('#product-name').on('change', function() {     
            var name = $('#product-name').val();
            if (name.length > 0) {
                var res = self.selectedForn().Products;
                res = res.filter(function(val) {
                    return val.Name.toLowerCase().includes(name.trim().toLowerCase());
                })
                self.filteredProducts(res);
            }
            else {
                self.filteredProducts(self.selectedForn().Products);
            }
        })

        $('#section-filter').on('change', function() {
            var sel = this.value;
            if (sel.length > 0) {
                self.filteredProducts(self.selectedForn().Products.filter(function(val) {
                    return val.Sect == sel;
                }))
            }
            else {
                self.filteredProducts(self.selectedForn().Products);
            }
        })

        self.weekDay = function(index) {
            switch (index) {
                case 0: return "Segunda-feira";
                case 1: return "Terça-feira";
                case 2: return "Quarta-feira";
                case 3: return "Quinta-feira";
                case 4: return "Sexta-feira";
                case 5: return "Sábado";
                case 6: return "Domingo";
            }
            return "ERROR.DAYINDEX";
        }

        self.profileExcept = ko.observableArray(self.selectedForn().Hour.Except);

    }

    ko.applyBindings(new marketsViewModel);

    $("#before-load").css("display", "initial");
});