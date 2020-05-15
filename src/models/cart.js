module.exports = function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = (item, id, quantity) => {
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty += Number(quantity);
        storedItem.price = storedItem.qty * storedItem.item.price;
        
        this.totalQty += Number(quantity);
        this.totalPrice += storedItem.price;
    }

    this.reduceOne = (id) => {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty <= 0){
            delete this.items[id];
        }
    }

    this.remove = (id) => {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    }

    this.generateArray = function(){
        var arr = [];
        for(var i in this.items) {
            arr.push(this.items[i]);
        }
        return arr;
    }

};