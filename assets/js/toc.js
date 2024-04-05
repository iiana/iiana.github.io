const inViewport = (element) => {
  const r = element.getBoundingClientRect();

  return (
    r.left >= 0 &&
    r.right <= (window.innerWidth || document.documentElement.clientWidth) &&
    r.top <= 150
  );
};

const atBottom = (element) => {
  return (
    window.innerHeight + Math.round(window.scrollY) >= element.offsetHeight
  );
};

const indexContent = () => {
  const sections = document.getElementsByClassName("js-section");
  let toc = [];

  for (let i = 0; i < sections.length; i++) {
    const el = sections[i];
    const title = el.getElementsByTagName("h2")[0].textContent.trim();

    const id = title
      .replace(/[^a-z0-9\s]/gi, "")
      .split(" ")
      .join("-")
      .toLowerCase();

    el.id = id;
    toc.push({ title: title, id: id });

    // Tag all elements in the section
    el.querySelectorAll("*").forEach((el) => {
      el.dataset.section = id;
      el.classList.add("_content");
    });
  }

  _toc = toc;
};

const render = () => {
  _toc.forEach((toc) => {
    const node = document.createElement("div"); // is a node
    node.innerHTML = `
      <div class='px-3 border-l-2 hover:border-[#7993E4] hover:text-[#E0E7FF]' id='_${toc.id}'>
        <button class='text-left' onclick="_tocGoTo('${toc.id}')">
          ${toc.title}
        </button>
      </div>
    `;
    document.getElementById("js-toc").appendChild(node);
  });
};

_tocGoTo = (id) => {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",
  });
};

const highlight = () => {
  const active = ["border-[#7993E4]", "text-[#E0E7FF]"];
  const inactive = ["text-slate-400", "border-transparent"];

  let visible = _toc[0].id;

  if (atBottom(document.querySelector("body"))) {
    visible = _toc[_toc.length - 1].id;
  } else {
    const sections = document.querySelectorAll(".js-section");
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (inViewport(section)) visible = section.id;
    }
  }

  _toc.forEach((toc) => {
    document.getElementById(`_${toc.id}`).classList.remove(...active);
    document.getElementById(`_${toc.id}`).classList.add(...inactive);
  });

  document.getElementById(`_${visible}`).classList.remove(...inactive);
  document.getElementById(`_${visible}`).classList.add(...active);
};

window.addEventListener("load", function () {
  indexContent();
  render();
  highlight();

  window.addEventListener("resize", highlight, false);
  window.addEventListener("scroll", highlight, false);
});
