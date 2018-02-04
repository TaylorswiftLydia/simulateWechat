const data = {
  messages: [{
    left: '你妈妈和我掉水里，你救谁？',
    right: [{
      text: '忘了告诉你，我妈是游泳健将。',
      score: 3
    }, {
      text: '你有聊无聊啊？',
      score: -2
    }, {
      text: '宝贝儿，你这不是为难我吗？',
      score: 1
    }]
  }, {
    left: '你爱我吗？',
    right: [{
      text: '你烦不烦啊。',
      score: -2
    }, {
      text: '这还用问吗？',
      score: 1
    }, {
      text: '这个问题我要用一辈子来回答。',
      score: 3
    }]
  }, {
    left: '如果我老了你还会爱我吗？',
    right: [{
      text: '没事儿，你老了我也老了丑了。',
      score: -2
    }, {
      text: '不可能，你老了也好看。',
      score: 1
    }, {
      text: '我巴不得你老了，这样放家里才放心呢。',
      score: 3
    }]
  }, {
    left: '你觉得我闺蜜怎么样啊？',
    right: [{
      text: '我都没怎么注意她。',
      score: 1
    }, {
      text: '我觉得她对你挺真诚的，应该好好珍惜这样的朋友。',
      score: 3
    }, {
      text: '挺漂亮的。',
      score: -2
    }]
  }],
  result: [{
    score: 8,
    tips: '机智的小伙子，给你99分，多给一分怕你骄傲',
    say: '爱你么么哒~'
  }, {
    score: 4,
    tips: '诚恳的小伙子，可惜不那么有趣',
    say: '好吧我先睡觉了'
  }, {
    score: 0,
    tips: '她会下次再找你算账的，保重。',
    say: '哦'
  }, {
    score: -10,
    tips: '请问你们是怎么走到今天的？还是好好找个洞藏起来保命吧。',
    say: '你去吃草吧！'
  }]
}

/* util */
function $(selector) {
	return document.querySelector(selector);
}

function addClass(element, className) {
	element.classList.add(className);
}

function removeClass(element, className) {
	element.classList.remove(className);
}

function hasClass(element, className) {
	return element.classList.contains(className);
}

function getDomByStr(str) {
	const div = document.createElement('div');
	div.innerHTML = str;
	return div.children[0];
}

const firstPage = $('.first-page');

function bindEvents() {
	$('.js-continue-btn').addEventListener('touchend',()=> {
	addClass(firstPage,'fadeout');
	setTimeout(() => {
		addClass(firstPage,'hide');
		oneStep();
	},500)
})

// 实现事件委托
  $('.selector').addEventListener('touchend', (event) => {
    let target = event.target
    const currentTarget = event.currentTarget
    while (target !== currentTarget) {
      if (hasClass(target, 'js-to-select')) {
        const currentScore = +target.getAttribute('data-score')
        const message = target.querySelector('.message-bubble').innerText
        appendMessage('right', message);
        score += currentScore;
        nextStep();
        return
      }
      target = target.parentNode
    }
  })

  $('.icon-replay').addEventListener('touchend', (event) => {
    window.location.reload()
  })
}

let step = 0;
let score = 0;

function getMessage(side,str) {
	const template = `
	  <div class="message-item message-item--${side}">
		<img class="avatar" src="./img/${side === 'left' ? 'girl' : 'boy'}.png" alt="头像">
		<div class="message-bubble">${str}</div>
	  </div>
	`
	return getDomByStr(template);
}

function getSelectMessage(msgObj) {
	return `
	  <div class="message-item message-item--right js-to-select" data-score=${msgObj.score}>
		<img class="avatar" src="./img/boy.png" alt="头像">
		<div class="message-bubble">${msgObj.text}</div>
	  </div>
	`
}

function appendMessage(side,str) {
	const messageDom = getMessage(side,str);
	$('.chat-list').append(messageDom);
}

function changeSelectMessages() {
	const curMessage = data.messages[step];
	let selectMsgStr = '';
	curMessage.right.forEach((message) => {
		selectMsgStr += getSelectMessage(message);
	})
	$('.selector').innerHTML = selectMsgStr;
}

function oneStep() {
	const curMessage = data.messages[step];
	appendMessage('left',curMessage.left);
	changeSelectMessages();
	setTimeout(() => {
		toggleSelector(true);
	},500)
}

function toggleSelector(isShow) {
	const chatPage = $('.chat-page');
	if (isShow) {
		addClass(chatPage,'show-selector');
	} else {
		removeClass(chatPage,'show-selector');
	}
}

function getResultByScore() {
	let result;
	data.result.every((item) => {
		if (score > item.score) {
			result = item;
			return false;
		}
		return true;
	})
	return result;
}

function showTips(resultObj) {
	const tips = $('.cover-tips');
	tips.querySelector('.tips-text').innerText = `分数：${score}
      ${resultObj.tips}`
    removeClass(tips, 'hide');
}

function showResult() {
	const result = getResultByScore(score);
	showTips(result);
    appendMessage('left', result.say)
    setTimeout(() => {
      showTips(result);
    }, 1000)
}

function nextStep() {
	toggleSelector(false);
	step += 1;
	if (step >= data.messages.length) {
		showResult();
	} else {
		setTimeout(() => {
			oneStep();
		},700)
	}
}

bindEvents();