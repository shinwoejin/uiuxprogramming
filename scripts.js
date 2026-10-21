const serviceName = "Re:hear";
let isSubscribed = false;
let submitCount = 0;


function makeSubscripeMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "로 신청이 완료되었습니다.";
    }
    
    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.getElementById("subscribe-form");
const emailInput = document.getElementById("email");
const subscribeButton = document.getElementById("subscribeButton");
const subscribeMessage = document.getElementById("subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscribeEmail = emailInput.value.trim();

    if(subscribeEmail == "") {
        subscribeMessage.textContent =
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent = makeSubscripeMessage(subscribeEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true; 
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick(event) {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput(event) {
    const maxLength = nicknameInput.maxLength;
    const currentLength = Math.min(nicknameInput.value.length, maxLength);

    nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed
        ? "훈련 설정을 시작할 수 있습니다"
        : "동의 후 훈련 설정을 시작할 수 있습니다";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function(tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });
    panels.forEach(function(panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick)
})

const traingFlow = document.querySelector("#training-flow");
const flowSteps = traingFlow.querySelectorAll(".step");
const progressItems = traingFlow.querySelectorAll(".progress_item");
const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna")
const durationValues = ["3", "5", "10"];

const formData = {
    title:"", duration: "5", qna: false, qnaCount: "2"
}

function showStep(index) {
    flowSteps.forEach((step, i) => { step.hidden = i !== index; });
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i===index);
    });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement() {
    agreeCheck.checked = false;
    traingFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if(!agreeCheck.checked) return;
    recordingDialog.showModal();
});
recordingCancel.addEventListener("click", () => {
    recordingDialog.close();
    revokeRecordingAgreement();
});
recordingDialog.addEventListener("cancel", revokeRecordingAgreement);
recordingConfirm.addEventListener("click", () => {
    if(!agreeCheck.checked) return;
    recordingDialog.close();
    traingFlow.hidden = false;
    showStep(0);
    traingFlow.scrollIntoView({behavior: "smooth"});
    titleInput.focus();
})

function validateTitle() {
    const value = titleInput.value.trim();
    if(!value) {
        titleError.textContent = "발표 제목을 입력해 주세요.";
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", () => {
    if(!validateTitle()) return;
    showStep(1);
})

durationRange.addEventListener("input", () => {
    durationValue.value = durationValues[durationRange.value] + "분";
});
qnaOption.addEventListener("change", () => {
    qnaOptions.hidden = !qnaOption.checked;
});

optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.qna = qnaOption.checked;
    const count = document.querySelector('input[name="qna-count"]:checked');
    formData.qnaCount = count.value;
    summaryTitle.textContent = formData.title;
    summaryDuration.textContent = formData.duration + "분";
    summaryQna.textContent = formData.qna ? formData.qnaCount + "개 포함" : "미포함";
    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));
finishButton.addEventListener("click", () => showStep(3));
restartButton.addEventListener("click", () => {
    formData.title = "";
    formData.duration = "5";
    formData.qna = false;
    formData.qnaCount = "2";
    titleInput.value = "";
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    durationRange.value = "1";
    durationValue.value = "5분";
    qnaOption.checked = false;
    qnaOptions.hidden = true;
    document.querySelector('input[name="qna-count"][value="2"]').checked = true;
    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent = "";
    showStep(0);
})

// 중간시험 새기능 시작
const incidentCount = document.querySelector("#incident-count");
const incidentCard = document.querySelector("#incident-card");
const incidentTitle = document.querySelector("#incident-title");
const incidentTip = document.querySelector("#incident-tip");
const incidentDone = document.querySelector("#incident-done");
const incidentDraw = document.querySelector("#incident-draw");


function makeIncidentCards() {
    const shorter = Number(formData.duration) - 1;
    return [
        { title: "마이크가 갑자기 꺼졌어요", tip: "\"잠시만요\" 한마디 후 목소리를 조금 키워 이어가세요.", qnaOnly: false },
        { title: "발표 시간이 " + formData.duration + "분에서 " + shorter + "분으로 줄었어요", tip: "예시 하나를 빼고 결론을 먼저 말하세요.", qnaOnly: false },
        { title: "슬라이드가 넘어가지 않아요", tip: "다음 슬라이드 내용을 말로 먼저 설명하며 시간을 버세요.", qnaOnly: false },
        { title: "머릿속이 하얘졌어요", tip: "물 한 모금 마시고 방금 한 문장을 다시 말해 보세요.", qnaOnly: false },
        { title: "청중 반응이 너무 조용해요", tip: "\"혹시 이런 경험 있으신가요?\"처럼 가볍게 질문을 던져 보세요.", qnaOnly: false },
        { title: "예상 못 한 질문을 받았어요", tip: "질문을 한 번 다시 말해 확인하며 생각할 시간을 확보하세요.", qnaOnly: true },
        { title: "질문에 대한 답을 모르겠어요", tip: "\"확인 후 따로 답변드리겠습니다\"라고 솔직하게 말해도 괜찮아요.", qnaOnly: true },
        { title: "주제와 관련 없는 질문을 받았어요", tip: "\"좋은 질문 감사합니다, 발표 후 따로 이야기 나눠요\"라고 정중히 넘기세요.", qnaOnly: true }
    ];
}

let incidentDeck = [];
let incidentTotal = 0;
let incidentState = "ready"; 

function updateIncidentView() {
    incidentCount.textContent = "남은 카드 " + incidentDeck.length + "장 / 전체 " + incidentTotal + "장";

    incidentCard.hidden = incidentState !== "card";
    incidentDone.hidden = incidentState !== "done";

    if (incidentState === "ready") {
        incidentDraw.textContent = "돌발 상황 뽑기";
    } else if (incidentState === "done") {
        incidentDraw.textContent = "처음부터 다시 뽑기";
    } else if (incidentDeck.length === 0) {
        incidentDraw.textContent = "연습 마치기";
    } else {
        incidentDraw.textContent = "다음 상황 뽑기";
    }
}

function resetIncidentDeck() {
    const cards = makeIncidentCards();
    const basicCards = cards.filter((card) => !card.qnaOnly);
    const questionCards = cards.filter((card) => card.qnaOnly).slice(0, Number(formData.qnaCount));

    incidentDeck = formData.qna ? basicCards.concat(questionCards) : basicCards;
    incidentTotal = incidentDeck.length;
    incidentState = "ready";
    updateIncidentView();
}

function handleIncidentDraw() {
    if (incidentState === "done") {
        resetIncidentDeck();
        return;
    }

    if (incidentDeck.length === 0) {
        incidentState = "done";
        updateIncidentView();
        return;
    }

    const index = Math.floor(Math.random() * incidentDeck.length);
    const card = incidentDeck.splice(index, 1)[0];

    incidentTitle.textContent = card.title;
    incidentTip.textContent = "대처 팁: " + card.tip;
    incidentState = "card";
    updateIncidentView();

    incidentCard.classList.remove("is-new");
    void incidentCard.offsetWidth;
    incidentCard.classList.add("is-new");
}

incidentDraw.addEventListener("click", handleIncidentDraw);

finishButton.addEventListener("click", resetIncidentDeck);

// 중간시험 새기능 끝