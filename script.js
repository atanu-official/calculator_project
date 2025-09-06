// Basic calculator logic with keyboard support
(function(){
  const displayEl = document.getElementById('display');
  let current = '';
  let previous = '';
  let operator = null;
  let resetNext = false;

  function updateDisplay() {
    displayEl.textContent = current || previous || '0';
  }

  function appendNumber(num){
    if(resetNext){
      current = '';
      resetNext = false;
    }
    if(num === '.' && current.includes('.')) return;
    if(current === '0' && num !== '.') current = num;
    else current = (current || '') + num;
  }

  function chooseOperator(op){
    if(!current && previous) operator = op;
    if(!current) return;
    if(previous){
      compute();
    } else {
      previous = current;
    }
    operator = op;
    resetNext = true;
  }

  function compute(){
    if(!operator || !previous) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    if(Number.isNaN(a) || Number.isNaN(b)) return;
    let result;
    switch(operator){
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/':
        if(b === 0){ result = 'Error'; break; }
        result = a / b; break;
      default: return;
    }
    result = (typeof result === 'number') ? roundAccurately(result, 10) : result;
    current = String(result);
    previous = '';
    operator = null;
    resetNext = true;
  }

  function roundAccurately(num, places){
    const factor = Math.pow(10, places);
    return Math.round((num + Number.EPSILON) * factor) / factor;
  }

  function clearAll(){
    current = '';
    previous = '';
    operator = null;
    resetNext = false;
  }

  function backspace(){
    if(resetNext){
      current = '';
      resetNext = false;
      return;
    }
    current = current.slice(0, -1);
  }

  function percent(){
    if(!current) return;
    current = String(parseFloat(current) / 100);
  }

  // Click handling
  document.querySelector('.keys').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    if(btn.hasAttribute('data-number')){
      appendNumber(btn.getAttribute('data-number'));
      updateDisplay();
      return;
    }
    const action = btn.getAttribute('data-action');
    if(!action) return;
    if(action === 'clear'){ clearAll(); updateDisplay(); return; }
    if(action === 'back'){ backspace(); updateDisplay(); return; }
    if(action === '%'){ percent(); updateDisplay(); return; }
    if(action === '='){ compute(); updateDisplay(); return; }
    // operators: + - * /
    chooseOperator(action);
    updateDisplay();
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if((e.key >= '0' && e.key <= '9') || e.key === '.'){
      appendNumber(e.key);
      updateDisplay();
      e.preventDefault();
      return;
    }
    if(['+','-','*','/'].includes(e.key)){
      chooseOperator(e.key);
      updateDisplay();
      e.preventDefault();
      return;
    }
    if(e.key === 'Enter' || e.key === '='){ compute(); updateDisplay(); e.preventDefault(); return; }
    if(e.key === 'Backspace'){ backspace(); updateDisplay(); return; }
    if(e.key.toLowerCase() === 'c'){ clearAll(); updateDisplay(); return; }
    if(e.key === '%'){ percent(); updateDisplay(); return; }
  });

  // initialize
  clearAll();
  updateDisplay();
})();
