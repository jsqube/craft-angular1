/**
 * Created by Ming on 2017/2/24.
 */
angular.module("cart", [])
    .service("list", function () {
        this.items = ["shoe", "apple", "phone"];
    });