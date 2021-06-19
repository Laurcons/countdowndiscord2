const elements = JSON.parse($("#channelData").html());
const editor = new JSONEditor($("#json-editor")[0], {
    mode: "tree",
    theme: "ace/theme/monokai",
    modes: ["code", "tree", "preview"]
});
editor.set(elements);

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function(item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
const webhookUrl = findGetParameter("webhookUrl");

$("#saveMetaBtn").click(function(ev) {
    let $btn = $(this);
    $btn.append("<span class='spinner-border spinner-border-sm ms-2'></span>");
    $.ajax({
        url: "saveMeta?webhookUrl=" + webhookUrl,
        method: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ name: $("[name='channelName']").val() })
    }).done(function(result) {
        alert("Saved!");
    }).fail(function(reason) {
        alert("Error!");
    }).always(function() {
        $btn.children("span").remove();
    });
});

$("#saveElementsBtn").click(function(ev) {
    let $btn = $(this);
    $btn.append("<span class='spinner-border spinner-border-sm ms-2'></span>");
    $.ajax({
        url: "saveElements?webhookUrl=" + webhookUrl,
        method: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ elements: editor.get() })
    }).done(function(result) {
        alert("Saved!");
    }).fail(function(reason) {
        alert("Error!");
    }).always(function() {
        $btn.children("span").remove();
    });
});

$("#testBtn").click(function(ev) {
    let $btn = $(this);
    $btn.append("<span class='spinner-border spinner-border-sm ms-2'></span>");
    $.ajax({
        url: "test?webhookUrl=" + webhookUrl,
        method: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ elements: editor.get() })
    }).done(function(result) {
        alert("Tested!");
    }).fail(function(reason) {
        alert("Error!");
    }).always(function() {
        $btn.children("span").remove();
    });
});

$("#revertBtn").click(function() {
    if (confirm("Are you sure you want to revert?"))
        window.location = window.location;
});