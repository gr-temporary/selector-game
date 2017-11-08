(function() {
	var colorScheme = localStorage["editor-color"] || "monokai-sublime";
	var link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("href", "css/" + colorScheme + ".css");

	document.querySelector("#color-scheme option[value='" + colorScheme + "']").setAttribute("selected", true);

	document.querySelector("#color-scheme").addEventListener("change", function() {
		var colorScheme = this.value;
		localStorage["editor-color"] = colorScheme;
		link.setAttribute("href", "css/" + colorScheme + ".css");
	});
})();