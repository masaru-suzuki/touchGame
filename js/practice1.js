class Panel {
  constructor(game) {
    this.game = game;
    this.el = document.createElement('li');
    this.el.classList.add('pressed');
    //globalにlet currentNumを定義
    this.el.addEventListener('click',() => {
      this.check();
    });
  }
  getEl() {
    return this.el
  }
  activate(num) {
    this.el.textContent = num;
    this.el.classList.remove('pressed');
  }
  check() {
    if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
      this.el.classList.add('pressed')
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
    //４つpanelsが入っている状態
    this.panels = [];
    for (let i = 0; i < this.game.getLevel() ** 2; i++) {
      //Panel クラスを作るときにこれを渡せば良いので、こちらに this.game としてあげます
      //game classみたいに、this.board = new Board()ってしないの？
      this.panels.push(new Panel(this.game));
    }
    this.setup();
  }
  setup() {
    const board = document.getElementById('board');
    const container = document.getElementById('container')
    //このpanelって何者なの？関数名？
    this.panels.forEach(panel => {
      board.appendChild(panel.getEl());
    });
    container.style.width = (this.game.getLevel() * 50) + (this.game.getLevel() * 10) + 'px'
  }
  activate() {
    const nums = [];
    for (let i = 0; i < this.game.getLevel() ** 2; i++) {
      //numsに対してiをpushする
      nums.push(i);
    }
    this.panels.forEach(panel => {
      //    const nums = [0, 1, 2, 3];こっちに入れると数値が重複する
      const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
      panel.activate(num);
    });
  }
}
  class Game {
    //const geme = new Game(3)の数値はconstructorで受ける
    constructor(level) {
      this.level = level;
      // Board クラスのコンストラクタに Game クラスのインスタンスを渡したいので this を渡してあげます。
      this.board = new Board(this);
      //this.level = level; がここに入っていると動かない！なんで？
      this.startTime = undefined;
      this.timerId = undefined;
      this.currentNum = undefined;
      const btn = document.getElementById('btn');
      btn.addEventListener('click', () => {
        this.start();
      });
    }
    start() {
      if (typeof this.timerId !== undefined) {
        clearTimeout(this.timerId);
        this.currentNum = 0;
        this.board.activate();
        this.startTime = Date.now();
        this.runTimer();
      }
    }
    runTimer(){
      const timer = document.getElementById('timer');
      timer.textContent = ((Date.now() - this.startTime)/1000).toFixed(2);
      this.timerId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }
    getCurrentNum() {
      return this.currentNum;
    }
    addCurrentNum() {
      this.currentNum++;
    }
    getTimerId() {
      return this.timerId;
    }
    getLevel() {
      return this.level;
    }
  }

  new Game(5);

