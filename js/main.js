'use strict';
{
  class Panel {
    constructor(game) {
      //BoardClassにあるGameClassのインスタンスを受け取る
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
      this.el.classList.remove('pressed');
      this.el.textContent = num;
    }

    check() {
      //this.game.currentNumと直接プロパティにアクセスするのは好ましくない
      if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)){
        this.el.classList.add('pressed');
        this.game.addCurrentNum();
      if (this.game.getCurrentNum() === this.game.getLevel() ** 2){
        clearTimeout(this.game.getTimeoutId());
      }
      }
    }
  }
  class Board {
    constructor(game) {
      //GameClassのconstructorを受け取る
      this.game = game;
      //コンストラクタの処理ですが、パネルを管理したいのでとりあえずプロパティで配列として持っておく
      //パネルの初期化[]
      this.panels = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        this.panels.push(new Panel(this.game));
      }
      //ページの追加は別のメソッドにまとめる
      this.setup();
    }
    setup() {
      const board = document.getElementById('board');
      // panels の数だけ要素を追加していけば良いので forEach() を使っていきます。
      // ひとつひとつを panel としつつ、 board に対して appendChild() する
      // 追加するのは li 要素なので panel.el プロパティを追加してあげれば良いのですが、実はクラスのプロパティに外部から直接アクセスしないほうが良いとされているので、こちらのプロパティはメソッド経由で取得するようにしてあげましょう。
      this.panels.forEach(panel => {
        // board.appendChild(panel.el);
        board.appendChild(panel.getEl()); //オブジェクト指向のカプセル化
      });
    }

    activate(){
      const nums = [];
      for (let i = 0; i < this.game.getLevel() ** 2; i++) {
        nums.push(i);
      }

      this.panels.forEach(panel => {
        const num = nums.splice(Math.floor(Math.random() * nums.length), 1);
        //const num = nums.splice(Math.floor(Math.random() * nums.length),1)[0];が見本。[0]の意味って何？
        panel.activate(num);
      });
    }
  }


  class Game {
    constructor(level) {
      this.level = level;
      //panelClassでもcurrentNumとtimeoutIdをつかう。
      //GameClassのインスタンスをBoardClass経由でPanelClassに渡す
      //new Board(this)とする？？？
      this.board = new Board(this);
      //配列のスタートをとcurrentNumのスタートは同じでないとならない
      //letで定義していたものについては、まだ値が決まっていないのでundefinedにする
      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined;
    
      const btn = document.getElementById('btn');
      btn.addEventListener('click',() => {
        this.start();
        if (typeof this.timeoutId === 'undefined') {
          // this.stop();
          clearTimeout(this.timeoutId);
        }
      });
      this.setup();
    }
    setup() {
      const PANEL_WIDTH = 50;
      const PANEL_PADDING = 10;
      const container = document.getElementById('container');
      container.style.width = PANEL_WIDTH * this.level + PANEL_PADDING * this.level + 'px'
    }
    start() {
      this.currentNum = 0;
      this.board.activate();
      this.startTime = Date.now();
      this.runTimer();
      // btn.textContent = 'STOP'
      //再度btnを押したときにカウントが再開する
    }
    // stop() {
    //   //btnを押した時のカウントを保持
    //   //
    //   clearTimeout(this.timeoutId);
    //   this.stopTimer();
    //   btn.textContent = 'START'
    // }
     runTimer() {
      const timer = document.getElementById('timer');
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);
      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }
    // stopTimer() {
    //   timer.textContent = 
    // }
    addCurrentNum() {
      this.currentNum++;
    }
    getCurrentNum() {
      return this.currentNum;
    }
    getTimeoutId() {
      return this.timeoutId;
    }
    getLevel() {
      return this.level;
    }
  }

  new Game(4);


}