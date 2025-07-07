(function () {
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "https://cdn.jsdelivr.net/gh/aliibneimran/currency_converter/widget.css";
  document.head.appendChild(style);

  const btn = document.createElement("button");
  btn.id = "currency-btn";
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12 1a11 11 0 0 0-8.39 18.38l-2.2 2.21a1 1 0 1 0 1.42 1.42l2.21-2.2A11 11 0 1 0 12 1Zm0 2a9 9 0 1 1-9 9 9 9 0 0 1 9-9Zm-1 3v2h-1a1 1 0 0 0 0 2h1v2h-1a1 1 0 0 0 0 2h1v2h2v-2h1a1 1 0 0 0 0-2h-1v-2h1a1 1 0 0 0 0-2h-1V6Z"/>
    </svg>`;
  document.body.appendChild(btn);

  const modal = document.createElement("div");
  modal.id = "currency-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2>Currency Converter</h2>
      <form id="converter-form">
        <input type="number" id="amount" placeholder="Enter amount" required />
        <div class="select-group">
          <select id="from"></select>
          <span>→</span>
          <select id="to"></select>
        </div>
        <button type="submit">Convert</button>
        <p id="result"></p>
      </form>
    </div>`;
  document.body.appendChild(modal);

  btn.onclick = () => modal.classList.add("show");
  modal.querySelector(".close-btn").onclick = () => modal.classList.remove("show");

  async function loadCurrencies() {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
    const data = await res.json();
    const currencies = Object.keys(data.rates).sort();

    const fromSelect = document.getElementById("from");
    const toSelect = document.getElementById("to");

    currencies.forEach(code => {
      fromSelect.innerHTML += `<option value="${code}">${code}</option>`;
      toSelect.innerHTML += `<option value="${code}">${code}</option>`;
    });

    fromSelect.value = "USD";
    toSelect.value = "BDT";
  }

  loadCurrencies();

  document.getElementById("converter-form").onsubmit = async function (e) {
    e.preventDefault();
    const amount = parseFloat(this.amount.value);
    const from = this.from.value;
    const to = this.to.value;

    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await res.json();
    const rate = data.rates[to];
    const converted = (amount * rate).toFixed(2);
    this.querySelector("#result").innerText = `${amount} ${from} = ${converted} ${to}`;
  };
})();
