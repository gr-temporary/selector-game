(function() {
	var template = document.getElementById("excercise-template");
	template.parentNode.removeChild(template);
	var list = document.getElementById("excercises");
	list.parentNode.removeChild(list);
	var main = document.querySelector("main");
	var saved = JSON.parse(localStorage["selectors"] || "{}");

	for(var i=0; i<list.children.length; i++) {
		addExcersize(list.children[i], i);
	}

	function addExcersize(excercise, id) {
		var block = template.cloneNode(true);
		block.id = "excercise-" + id;

		var h2 = block.querySelector("h2");
		h2.innerText = (id + 1) + ". " + excercise.getAttribute("title");

		var result = block.querySelector(".exercise-result");
		var htmlBlock = block.querySelector("pre > code.html");
		var html = excercise.innerHTML;

		result.innerHTML = html;
		htmlBlock.innerText = html;
		html = htmlBlock.innerHTML;
		html = html.split("♥");
		html = html.join("<span class='heart'>♥</span>");
		htmlBlock.innerHTML = html;

		result.id = "result-" + id;
		var style = document.createElement("style");
		style.id = "style-" + i;
		block.appendChild(style);
		var input = block.querySelector("code span[contenteditable]");
		input.id = "input-" + id;
		input.setAttribute("data-id", id);
		main.appendChild(block);
	}
	hljs.initHighlighting();

	var inputs = document.querySelectorAll("code span[contenteditable]");
	for(var i=0; i<inputs.length; i++) {
		inputs[i].addEventListener("input", updateSelector);
		if(saved[i]) {
			var s = saved[i].selector;
			inputs[i].innerText = s;
			applyStyle(i, s);
			if(saved[i].win) {
				document.querySelector("#excercise-" + i).classList.add("win");
			}
		}
	}

	function applyStyle(id, selector) {
		var style = document.getElementById("style-" + id);
		style.innerHTML = "#excercise-" + id + " " + selector + " { color: red; }";
	}

	function updateSelector(event) {
		var selector = this.innerText;
		var id = this.getAttribute("data-id");
		debounce(saveData, 1000)(id, selector);
		if(!selector.trim()) {
			return;
		}
		var result = document.getElementById("result-" + id);
		try {
			var elements = result.querySelectorAll(selector);
		} catch(e) {
			return;
		}
		if(elements.length) {
			applyStyle(id, selector);
			var win = true;
			for(var i=0; i<elements.length; i++) {
				if(elements[i].innerText.trim() != "♥") {
					win = false;
				}
			}
			if(win) {
				console.log("Win!");
				document.querySelector("#excercise-" + id).classList.add("win");
			}
			debounce(saveData, 1000)(id, selector, win);
		}
	}

	function saveData(id, selector, win) {
		saved[id] = {
			selector: selector,
			win: win ? true : false
		}
		localStorage['selectors'] = JSON.stringify(saved);
	}

	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};
})();