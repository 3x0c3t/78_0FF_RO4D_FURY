const bloc1 = document.querySelector(".bloc1");

if (bloc1) {
    const elements = {
        wheel: { selector: ".wheel", percent: "100%" },
        suspension: { selector: ".suspension", percent: "75%" },
        engine: { selector: ".engine", percent: "80%" },
        chassis: { selector: ".chassis", percent: "100%" },
        trunk: { selector: ".trunk", percent: "90%" },
    };

    function createPercentSpan(parent, text) {
        const span = document.createElement("span");
        span.className = "percent-label";
        span.textContent = text;
        parent.parentElement.style.position = "relative";
        parent.parentElement.appendChild(span);
    }

    bloc1.addEventListener("mouseenter", () => {
        bloc1.style.transform = "translateY(70px)";
        bloc1.style.width = "320px";
        bloc1.style.padding = "14px";

        Object.values(elements).forEach(item => {
            const nodes = bloc1.querySelectorAll(item.selector);
            nodes.forEach(node => {
                node.style.width = "50px";
                node.style.height = "50px";
                createPercentSpan(node, item.percent);
            });
        });
    });

    bloc1.addEventListener("mouseleave", () => {
        bloc1.style.transform = "translateY(0)";
        bloc1.style.width = "120px";
        bloc1.style.padding = "6px";

        Object.values(elements).forEach(item => {
            const nodes = bloc1.querySelectorAll(item.selector);
            nodes.forEach(node => {
                node.style.width = "16px";
                node.style.height = "16px";
                const percentSpan = node.parentElement.querySelector(".percent-label");
                if (percentSpan) percentSpan.remove();
            });
        });
    });
}
