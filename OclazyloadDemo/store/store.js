/**
 * Created by Ming on 2017/2/24.
 */
angular.module("store", [{
    name: "cart",
    files: ["cart/cart.js", "../bower_components/moment/moment.js"]
}])
    .controller("StoreCtrl", function (list) {
        var store = this;
        store.message = list.items;

        store.date = moment().format('MMMM Do YYYY, h:mm:ss a');

    });