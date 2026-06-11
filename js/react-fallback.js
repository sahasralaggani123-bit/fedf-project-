(function () {
    if (window.React && window.ReactDOM) return;

    const Fragment = Symbol("Fragment");
    let hooks = [];
    let hookIndex = 0;
    let rootContainer = null;
    let rootVNode = null;

    function createElement(type, props) {
        const children = Array.prototype.slice.call(arguments, 2).flat(Infinity);
        return { type, props: props || {}, children };
    }

    function useState(initialValue) {
        const currentIndex = hookIndex;
        hooks[currentIndex] = hooks[currentIndex] === undefined ? initialValue : hooks[currentIndex];

        function setValue(nextValue) {
            hooks[currentIndex] = typeof nextValue === "function" ? nextValue(hooks[currentIndex]) : nextValue;
            renderRoot();
        }

        hookIndex += 1;
        return [hooks[currentIndex], setValue];
    }

    function useMemo(factory) {
        return factory();
    }

    function renderRoot() {
        if (!rootContainer || !rootVNode) return;
        hookIndex = 0;
        rootContainer.replaceChildren(toDom(rootVNode));
    }

    function toDom(vNode) {
        if (vNode === null || vNode === undefined || vNode === false || vNode === true) {
            return document.createTextNode("");
        }

        if (typeof vNode === "string" || typeof vNode === "number") {
            return document.createTextNode(String(vNode));
        }

        if (vNode.type === Fragment) {
            const fragment = document.createDocumentFragment();
            vNode.children.forEach((child) => fragment.appendChild(toDom(child)));
            return fragment;
        }

        if (typeof vNode.type === "function") {
            return toDom(vNode.type({ ...vNode.props, children: vNode.children }));
        }

        const element = document.createElement(vNode.type);
        applyProps(element, vNode.props);
        vNode.children.forEach((child) => element.appendChild(toDom(child)));
        return element;
    }

    function applyProps(element, props) {
        Object.entries(props || {}).forEach(([key, value]) => {
            if (key === "children" || value === null || value === undefined || value === false) return;
            if (key === "className") element.setAttribute("class", value);
            else if (key === "htmlFor") element.setAttribute("for", value);
            else if (key === "style" && typeof value === "object") Object.assign(element.style, value);
            else if (key.startsWith("on") && typeof value === "function") element.addEventListener(key.slice(2).toLowerCase(), value);
            else if (key === "value") element.value = value;
            else if (key === "checked") element.checked = Boolean(value);
            else if (value === true) element.setAttribute(key, "");
            else element.setAttribute(key, value);
        });
    }

    window.React = { createElement, useMemo, useState, Fragment };
    window.ReactDOM = {
        createRoot(container) {
            rootContainer = container;
            return {
                render(vNode) {
                    rootVNode = vNode;
                    renderRoot();
                }
            };
        }
    };
}());
