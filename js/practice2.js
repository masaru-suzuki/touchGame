'use strict';
{
class Panel {
  constructor(game) {
    this.game = game;
    this.el = document.createElement('li');
    this.el.classList.add('pressed');
    this.el.addEventListener('click', () => {
      this.check();
    });
  }
  getEl() {
    return this.el;
  }

  activate(num) {
    this.el.textContent = num;
    this.el.classList.remove('pressed');
  }

  check() {
    if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
      this.el.classList.add('pressed');
      this.game.addCurrentNum();
    }
    if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
      clearTimeout(this.game.getTimerId());
    }
  }
}
class Board {
  constructor(game) {
    this.game = game;
    this.panels = [];
    for (let i = 0; i < this.game.getLevel() ** 2; i++){
      //new Panel() はconstructorを指しているの？
      this.panels.push(new Panel(this.game));
    }
    this.setup();

  }
  setup() {
    const board = document.getElementById('board');
    //このpanelは何を指しているの？コールバック関数？
    this.panels.forEach(panel => {
      board.appendChild(panel.getEl());
    });
    const container = document.getElementById('container');
    container.style.width = (this.game.getLevel() * 50) + (this.game.getLevel() * 10) + 'px'
  }
  activate() {
    const nums = [];
    for (let i = 0; i < this.game.getLevel() ** 2; i++){
      //new Panel() はconstructorを指しているの？
      nums.push(i);
    }
    this.panels.forEach(panel =>{
      const num = nums.splice(Math.floor(Math.random() * nums.length), 1);
      panel.activate(num);
    });
  }
}
class Game {
  constructor(level) {
    this.level = level;
    this.board = new Board(this);
    //currentNumはグローバルの方に => game class
    this.currentNum = undefined;
    //timerIdはグローバルにセットしておくと、他のクラスでも使える => game class
    this.startTime = undefined;
    this.timerId = undefined;

    const btn = document.getElementById('btn');
    btn.addEventListener('click', () => {
      this.start();
    });
  }
  start() {
    if (typeof this.timerId !== 'undefined') {
      clearTimeout(this.timerId);
    }
    this.currentNum = 0;
    this.board.activate();
    this.startTime = Date.now();
    this.runTimer();
  }

  runTimer() {
    //timerはrunTimer()でしか使わないから、ここでok
    const timer = document.getElementById('timer');
    timer.textContent = ((Date.now() - this.startTime)/1000).toFixed(2)
    this.timerId = setTimeout(() => {
      this.runTimer();
    }, 10);
  }

  addCurrentNum() {
    this.currentNum++;
  }

  getCurrentNum() {
    return this.currentNum;
  }

  getTimerId() {
    return this.timerId;
  }
  getLevel() {
    return this.level;
  }
}

new Game(4);
}