export function createScreenManager(screenSelectors, activeClass = "active") {
  const elements = Object.fromEntries(
    Object.entries(screenSelectors).map(([name, selector]) => [name, document.querySelector(selector)])
  );

  let current = Object.entries(elements).find(([, element]) => element?.classList.contains(activeClass))?.[0] || null;

  function show(name) {
    const target = elements[name];

    if (!target) {
      throw new Error(`Tela não encontrada: ${name}`);
    }

    Object.values(elements).forEach((element) => element?.classList.remove(activeClass));
    target.classList.add(activeClass);
    document.body.dataset.screen = name;
    current = name;
  }

  function isActive(name) {
    return current === name && Boolean(elements[name]?.classList.contains(activeClass));
  }

  return {
    elements,
    show,
    isActive,
    get current() {
      return current;
    }
  };
}
