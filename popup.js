
window.addEventListener('DOMContentLoaded', () => {
    const mainCont = document.getElementById("mainCont");
    const buttonCont = document.getElementById("picker_btn_cont");
    const resultList = document.getElementById("result");

    const GiveMetheChild = (color, msg) => {
        const errorLabel = document.createElement("p")
        errorLabel.setAttribute("class", "errorLabel")
        errorLabel.style.backgroundColor = color
        errorLabel.innerText = msg

        mainCont.appendChild(errorLabel)
        setTimeout(() => {
            mainCont.removeChild(errorLabel)
        }, 2000)
    }

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0]

        if (tab.url === undefined || tab.url.indexOf('chrome') == 0) {
            buttonCont.innerHTML = '<span style="font-family: lobster, sans-serif">Color Catcher</span> não pode acessar <i>páginas do Chrome</i>'
        }
        else if (tab.url.indexOf('file') === 0) {
            buttonCont.innerHTML = '<span style="font-family: lobster, sans-serif">EColor Catcher</span> não pode acessar <i>páginas locais</i>'

        } else {
            const button = document.createElement("button")
            button.setAttribute("id", "picker_btn")
            button.innerText = "Selecionar cor da página da web"

            button.addEventListener("click", () => {
                if (!window.EyeDropper) {
                    GiveMetheChild("#ad5049", 'Seu navegador não suporta a API Color Catcher')
                    return
                }

                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { from: "popup", query: "eye_dropper_clicked" }
                );
                window.close()
            })

            buttonCont.appendChild(button)
        }
    });




    chrome.storage.local.get("color_hex_code", (resp) => {

        if (resp.color_hex_code && resp.color_hex_code.length > 0) {
            resp.color_hex_code.forEach(hexCode => {
                const liElem = document.createElement("li")
                liElem.innerText = hexCode
                liElem.style.backgroundColor = hexCode
                liElem.addEventListener("click", () => {
                    navigator.clipboard.writeText(hexCode);
                    GiveMetheChild("#e19526", "O código Hex foi copiado para a área de transferência!")
                })
                resultList.appendChild(liElem)
            })

            const ClearButton = document.createElement("button")
            ClearButton.innerText = "Limpar histórico"
            ClearButton.setAttribute("id", "ClearButton")
            ClearButton.addEventListener("click", () => {
                chrome.storage.local.remove("color_hex_code")
                window.close()
            })
            mainCont.appendChild(ClearButton)
        }

    })

})
