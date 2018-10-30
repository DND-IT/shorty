var uiSelectors = {
        mainForm: "main-form",
        urlInput: "url-input",
        customInput: "custom-input",
        dateStart: "start-date",
        dateEnd: "end-date",
        timeStart: "start-time",
        timeEnd: "end-time",
        options: "options",
        optionsButton: "options-button",
        submitButton: "submit-button",
        code: "code",
        oldUrl: "oldUrl"
    },
    mainForm,
    urlInput,
    customInput,
    dateStart,
    dateEnd,
    timeStart,
    timeEnd,
    options,
    optionsButton,
    optionsButtonLabel = {
        open: "△ Less options △",
        closed: "▽ More options ▽"
    },
    today,
    sendForm,
    toggleButtonLabel;

toggleButtonLabel = function(element, value1, value2) {
    element.innerHTML = element.innerHTML === value1 ? value2 : value1;
};

options = document.getElementById(uiSelectors.options);
optionsButton = document.getElementById(uiSelectors.optionsButton);
optionsButton.addEventListener("click", () => {
    options.classList.toggle("toggle-display");
    toggleButtonLabel(optionsButton, optionsButtonLabel.open, optionsButtonLabel.closed);
});

urlInput = document.getElementById(uiSelectors.urlInput);
customInput = document.getElementById(uiSelectors.customInput);
mainForm = document.getElementById(uiSelectors.mainForm);
mainForm.addEventListener("submit", sendForm);

// delimiting date and time inputs
dateStart = document.getElementById(uiSelectors.dateStart);
dateEnd = document.getElementById(uiSelectors.dateEnd);
timeStart = document.getElementById(uiSelectors.timeStart);
timeEnd = document.getElementById(uiSelectors.timeEnd);
today = new Date().toISOString().slice(0, 10);
dateStart.setAttribute("min", today);
dateEnd.setAttribute("min", today);
dateStart.addEventListener("change", () => {
    const minDate = dateStart.value;
    dateEnd.setAttribute("min", minDate);
    if(dateEnd.value && dateStart.value && dateEnd.value === dateStart.value) {
        if(timeEnd.value && timeStart.value && timeEnd.value < timeStart.value) {
            timeEnd.setAttribute("min", timeStart.value);
            timeEnd.value = timeStart.value;
        }
    }
});
dateEnd.addEventListener("change", () => {
    const maxDate = dateEnd.value;
    dateStart.setAttribute("max", maxDate);
    if(dateEnd.value && dateStart.value && dateEnd.value === dateStart.value) {
        if(timeEnd.value && timeStart.value && timeEnd.value < timeStart.value) {
            timeEnd.setAttribute("min", timeStart.value);
            timeEnd.value = timeStart.value;
        }
    }
});
timeStart.addEventListener("blur", () => {
    if(dateEnd.value && dateStart.value && dateEnd.value === dateStart.value) {
        if(timeStart.value > timeEnd.value) {
            timeEnd.value = timeStart.value;
        } else {
            timeEnd.setAttribute("min", timeStart.value);
        }
    }
});
timeEnd.addEventListener("blur", () => {
    if(dateEnd.value && dateStart.value && dateEnd.value === dateStart.value) {
        if(timeStart.value > timeEnd.value) {
            timeEnd.value = timeStart.value;
        } else {
            timeStart.setAttribute("max", timeStart.value);
        }
    }
});

document.getElementById("code").addEventListener("click", function() {
    this.select();
    document.execCommand("copy");
});

sendForm = function(event) {
    event.preventDefault();
    fetch("/", {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: urlInput.value,
            customInput: customInput.value,
            dateStart: dateStart.value,
            timeStart: timeStart.value,
            dateEnd: dateEnd.value,
            timeEnd: timeEnd.value
        })
    })
        .then(response => response.json())
        .then(data => {
            if(data.err) {
                document.getElementById("code").value = "";
                document.getElementById("oldUrl").innerHTML = "";
                document.getElementById("error").innerHTML = data.err;
            } else {
                document.getElementById("code").value = location.protocol + "//" + location.host + "/" + data.code;
                document.getElementById("oldUrl").innerHTML = data.url;
                document.getElementById("error").innerHTML = "";
                mainForm.reset();
            }
        })
        .catch(error => {
            console.log("Request failure: ", error);
        });
};
document.getElementById("main-form").addEventListener("submit", sendForm);

