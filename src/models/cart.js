module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = (item, id) => {
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.qty * storedItem.item.price;
        
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }

    this.generateArray = function(){
        var arr = [];
        for(var i in this.items) {
            arr.push(this.items[i]);
        }
        return arr;
    }

};