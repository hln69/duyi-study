//单个商品的数据
class UIGoods{
    constructor(g){
        this.data = g;
        this.choose = 0;
    }
    //获取总价
    getTotalPrice(){
        return this.data.price * this.choose;
    }
    //是否选中了这件商品
    isChoose(){
        return this.choose > 0;
    }
    //选择的数量加一
    increase(){
        this.choose++;
    }
    //选择的数量建减一
    decrease(){
        if(this.choose === 0){
            return;
        }
        this.choose--;
    }
}
/**
 * 整个页面数据
 */
class UIData{
    constructor(){
        let uiGoods = []
        for (let i = 0; i < goods.length; i++) {
            
            uiGoods.push(new UIGoods(goods[i]));  
        } 
        console.log(uiGoods);
        this.uiGoods = uiGoods;
        this.deliveryThreshold = 30;
        this.deliveryPrice = 5; 
    }
    /**
     * 计算总金额
     * @returns 
     */
    getTotalPrice() {
        let sum = 0;
        for (let i = 0; i < this.uiGoods.length; i++) {
            console.log(this.uiGoods[i].getTotalPrice())
            sum += this.uiGoods[i].getTotalPrice();
        };   
        return sum;
    }
    /**
     * 
     * @param {根据下标减少商品} index 
     */
    increase(index){
        this.uiGoods[index].increase();
    }
    /**
     * 增加商品
     * @param {} index 
     */
    decrease(index){
        this.uiGoods[index].decrease();
    }
    /**获取商品总件数 */
    getGoodsSum(){
        let sum = 0;
        for (let i = 0; i < this.uiGoods.length; i++) {
            const element = this.uiGoods[i];
            sum+=element.choose;
        }
        return sum;
    }
    /**
     * 是否有购物车
     */
    hasGoodsImCar(){
        return this.getGoodsSum()>0;
    }
    /**
     * 是否达到配送标准
     */
    isCrossDeliveryThreshold(){
        return this.getTotalPrice()>=this.deliveryThreshold
    }
    /**
     * 商品是否选中
     * @param {*} index 
     * @returns 
     */
    isChoose(index){
        return this.uiGoods[index].isChoose();
    }
    /**
     * 商品数量
     */
    getGoodsNum(index){
        return this.uiGoods[index].choose;
    }
}
/**整个界面 */
class UI{
    constructor(){
        this.uiData = new UIData();
        this.doms ={
            goodsContainer:document.querySelector('.goods-list'),
            deliveryPrice:document.querySelector('.footer-car-tip'),//配送费
            deliveryThreshold:document.querySelector('.footer-pay span'),
            footerPay:document.querySelector('.footer-pay'),
            totalPrice:document.querySelector('.footer-car-total'),
            footerCar:document.querySelector('.footer-car'),
        };

        //算出动画跳跃目标，购物车
        let carRect = this.doms.footerCar.getBoundingClientRect();
        var jumpTarget = {
            x:carRect.left + carRect.width / 2,
            y:carRect.top + carRect.height /5,
        }
        this.jumpTarget = jumpTarget;
        this.createHTML();
        this.updateFooter();
        this.listenerEvent();
    }
    listenerEvent(){
        this.doms.footerCar.addEventListener('animationend',function(){
            this.classList.remove('animate');
        })
    }
    //根据商品数据创建列表元素
    createHTML(){
        //字符串
        let html = '';
        for (let i = 0; i < this.uiData.uiGoods.length; i++) {
            const element = this.uiData.uiGoods[i];
            html+=`<div class="goods-item">
          <img src="${element.data.pic}" alt="" class="goods-pic" />
          <div class="goods-info">
            <h2 class="goods-title">${element.data.title}</h2>
            <p class="goods-desc">${element.data.desc}
            </p>
            <p class="goods-sell">
              <span>月售 ${element.data.sellNumber}</span>
              <span>好评率${element.data.favorRate}%</span>
            </p>
            <div class="goods-confirm">
              <p class="goods-price">
                <span class="goods-price-unit">￥</span>
                <span>${element.data.price}</span>
              </p>
              <div class="goods-btns">
                <i index=${i} class="iconfont i-jianhao"></i>
                <span>${element.choose}</span>
                <i index=${i} class="iconfont index${i} i-jiajianzujianjiahao"></i>
              </div>
            </div>
          </div>
        </div>`
        }
        this.doms.goodsContainer.innerHTML = html;
    }
    //增加商品
    increase(index){
        this.uiData.increase(index);
        this.updateGoodsItem(index)
        this.updateFooter();
        this.jumpAnimate(index);
    }
    //减少商品
    decrease(index){
        this.uiData.decrease(index);
        this.updateGoodsItem(index)
        this.updateFooter();
        //this.jumpAnimate(index);
    }
    //修改对应界面
    updateGoodsItem(index){
        var goodsDom = this.doms.goodsContainer.children[index];
        if(this.uiData.isChoose(index)){
            goodsDom.classList.add('active');
        }else{
            goodsDom.classList.remove('active');
        }
        let amountDom = goodsDom.querySelector('.goods-btns span');
        amountDom.innerHTML = this.uiData.getGoodsNum(index);
    }
    //更新页脚
    updateFooter(){
        let deliveryPriceDom = this.doms.deliveryPrice;
        let total = this.uiData.getTotalPrice();
        deliveryPriceDom.innerHTML = `配送费￥${this.uiData.deliveryPrice}`
        //起送标准
        let deliveryThreshold = this.uiData.deliveryThreshold;
        let price = Math.round(deliveryThreshold-total)
        if(this.uiData.isCrossDeliveryThreshold()){
            this.doms.footerPay.classList.add('active');
        }else{
            this.doms.footerPay.classList.remove('active');
            this.doms.deliveryThreshold.innerHTML = `还差￥${price}元起送`
        }
        //总价
        this.doms.totalPrice.textContent = total.toFixed(2);
        //设置购物车样式
        if(this.uiData.hasGoodsImCar()){
            this.doms.footerCar.classList.add('active');    
        }else{
            this.doms.footerCar.classList.remove('active');
        }
        //设置购物车数量
        this.doms.footerCar.children[1].innerHTML = this.uiData.getGoodsSum()

    }
    //购物车动画
    carAnimate(){
        this.doms.footerCar.classList.add('animate');
    }
    jumpAnimate(index){
        let btnAdd = this.doms.goodsContainer.children[index].querySelector('.i-jiajianzujianjiahao');
        let rect = btnAdd.getBoundingClientRect();
        let jumpSrc = {
            x:rect.left,
            y:rect.top,
        }
        console.log(jumpSrc)
        //跳跃
        var div = document.createElement('div');
        div.className = 'add-to-car';
        var i = document.createElement('i');
        i.className = 'iconfont i-jiajianzujianjiahao';
        div.appendChild(i);
        document.body.appendChild(div);
        //设置初始位置
        div.style.transform = `translateX(${jumpSrc.x}px)`;
        i.style.transform = `translateY(${jumpSrc.y}px)`;

        //强行渲染
        div.clientWidth;
        //设置结束位置
        div.style.transform = `translateX(${this.jumpTarget.x}px)`;
        i.style.transform = `translateY(${this.jumpTarget.y}px)`;
        let that = this;
        div.addEventListener('transitionend',function(){
            div.remove();
            that.carAnimate();
        },{once: true})
    }
}
let ui = new UI()
// ui.increase(1);
ui.doms.goodsContainer.addEventListener('click',function(e){
    if(e.target.classList.contains('i-jiajianzujianjiahao')){
        let index = +e.target.getAttribute('index');
        ui.increase(index);
    }else if(e.target.classList.contains('i-jianhao')){
        let index = +e.target.getAttribute('index');
        ui.decrease(index);
    }
})