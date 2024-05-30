function createTOC() {
    var list = document.createElement("ol");
    var headers = document.getElementsByTagName("h2")
    Array.prototype.slice.call(headers).forEach(function (element) {
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.href = "#"+element.id;
        link.innerHTML = element.innerHTML;
        
        item.appendChild(link);
        list.appendChild(item);
    });
    
    var toc = document.getElementById("toc");
    var title = document.createElement("h2");
    title.innerHTML = "Table of Contents";
    toc.appendChild(title);
    toc.appendChild(list);
    
}