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