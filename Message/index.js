const { hash } = window.location;

// Decode the base64 string
const message = atob(hash.replace('#', ''));

if(message) {
    document.querySelector("#message-form").classList.add("hide");    
    document.querySelector("#message-show").classList.remove("hide");    

    document.querySelector("h1").innerHTML = message;
}

document.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();

    document.querySelector("#message-form").classList.add("hide");
    document.querySelector("#link-section").classList.remove("hide");

    const input = document.querySelector("#message-input");

    // Converting the message to base64
    const encrypted = btoa(input.value);

    const linkInput = document.querySelector("#link-input");
    linkInput.value = `${window.location}#${encrypted}`;
    // Automatically select the text of linkInput
    linkInput.select();
}); 