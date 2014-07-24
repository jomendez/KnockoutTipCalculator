var ViewModel = function () {

    ko.extenders.trackChange = function (target, track) {
        debugger;
        if (track) {
            target.isDirty = ko.observable(false);
            target.originalValue = target();
            target.subscribe(function (newValue) {

                target.isDirty(newValue != target.originalValue);
            });
        }
        return target;
    };


    this.billAmountObs = ko.observable(1);
    this.tipPercentObs = ko.observable(0);
    this.tipAmountObs = ko.observable(0).extend({ trackChange: true });
    this.totalAmountAux = ko.observable(0);
    this.totalAmountObs = ko.observable(0);
    this.flag = ko.observable(false);
    this.splitAmongObs = ko.observable(1);
    this.splitedTotal = ko.observable(0);


    this.percent = function (perc) {
        $("#tipPercent").val(perc * 1);
        this.tipPercentObs(perc * 1);
    }

    this.splitAmong = ko.computed({
        read: function () {
            if (this.splitAmongObs() * 1 > 0)
                this.splitedTotal(this.totalAmountObs() * 1 / this.splitAmongObs() * 1);
            return;
        },
        owner: this
    });



    this.tipAmount = ko.computed({
        read: function () {

            return Math.round(this.billAmountObs() * 1 * this.tipPercentObs() * 1 / 100);
        },
        write: function (value) {
            if (value > 0)
                this.tipAmountObs(value);
        },
        owner: this
    });


    this.tipPercent = ko.computed({
        read: function () {
            if (this.billAmountObs() * 1 > 0)
                return Math.round(this.tipAmountObs() * 1 / this.billAmountObs() * 1 * 100);
        },
        write: function (value) {
            if (value > 0)
                this.tipPercentObs(value);
        },
        owner: this
    });


    this.totalAmount = ko.computed({
        read: function () {
            this.tipPercent();

            var ret = this.billAmountObs() * 1 + (this.tipAmountObs.isDirty() ? this.tipAmountObs() * 1 : this.tipAmount() * 1);

            if (!this.tipAmountObs.isDirty()) {

                if (this.flag() == true) {
                    this.flag(false);
                    this.totalAmountObs(this.totalAmountAux());
                    return this.totalAmountAux();

                } else {
                    this.totalAmountObs(ret);
                    return ret;
                }

            } else {
                this.flag(true);
                this.totalAmountAux(ret);
                this.tipAmountObs.isDirty(false);
                return this.totalAmountAux();
            }

        },
        owner: this
    });






    this.billAmount = ko.computed({
        read: function () {
            return this.billAmountObs();
        },
        write: function (value) {
            if (value > 0)
                this.billAmountObs(value);
        },
        owner: this
    });





};

ko.applyBindings(new ViewModel());