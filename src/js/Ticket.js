export default class Ticket {
  constructor(id, name, status, time) {
    this.name = name;
    this.time = time;
    this.id = id;
    this.status = status;
  }

  createTicket() {
    const li = document.createElement('li');
    li.classList.add('item');
    li.dataset.id = this.id;
    let checkbox;

    if (this.status) {
      checkbox = '<input type="checkbox" class="item__checkbox" checked>';
    } else {
      checkbox = '<input type="checkbox" class="item__checkbox">';
    }

    const content = document.createElement('div');
    content.classList.add('item__content');
    const name = document.createElement('div');
    name.classList.add('item__name');
    name.textContent = this.name;
    content.append(name);

    const time = `<time class="item__time" datetime="03-07-2021">${this.time}</time>`;
    const ctrl = document.createElement('div');
    ctrl.classList.add('item__control');
    ctrl.innerHTML = `<button type="button" class="item__edit btn">&#9998</button>
          <button type="button" class="item__delete btn">X</button>`;

    li.insertAdjacentHTML('beforeend', checkbox);
    li.append(content);
    li.insertAdjacentHTML('beforeend', time);
    li.append(ctrl);

    return li;
  }
}
