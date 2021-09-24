const dropList = document.querySelectorAll("form select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");

// 给下拉列表加载country-list以及绑定事件
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code in country_list) {

        let selected = ''
        if (currency_code == (i == 0 ? 'CNY' : 'USD')) {
            selected = 'selected'
        }

        // let selected = currency_code == (i==0?'CNY':'USD')?'selected':''
        // let selected = i == 0 ? (currency_code == "CNY" ? "selected" : "") : (currency_code == "USD" ? "selected" : "");
        let option = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", option);
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target); // 加载对应旗标
        // console.log(e.currentTarget);
        // console.log(e.target);
    });
}
// 对应旗标
function loadFlag(element) {
    for (let code in country_list) {
        if (code == element.value) {
            // console.log(element.value);
            let Img = element.parentElement.querySelector("img");
            Img.src = `https://www.countryflags.io/${country_list[code]}/flat/48.png`;
        }
    }
}

// from与to调换位置
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
})
// 请求汇率转换
function getExchangeRate() {
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;
    if (amountVal == "" || amountVal == "0") {
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "转换中，请稍等 - -";
    let url = `https://v6.exchangerate-api.com/v6/a92892eecf7597e317c42fcd/latest/${fromCurrency.value}`;
    // fetch(url).then(response => response.json()).then(result=>console.log(result));
    fetch(url).then(response => response.json()).then(result => {
        // console.log(result);
        let exchangeRate = result.conversion_rates[toCurrency.value]; // 拿到相对于to货币的汇率
        let totalExRate = (amountVal * exchangeRate).toFixed(2); // from乘上相对于to货币的汇率
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(() => { 
        exchangeRateTxt.innerText = "转换失败";
    });
}

// 文件加载完成后即开始调用getExchangeRate()
window.addEventListener("load", () => {
    getExchangeRate();
});
// 为按钮绑定该方法
getButton.addEventListener("click", e => {
    e.preventDefault(); //preventing form from submitting
    getExchangeRate();
});