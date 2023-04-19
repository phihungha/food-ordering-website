document.querySelectorAll('.order-status-filter').forEach((e) => {
  e.addEventListener('click', (event) => {
    const elem = event.target as HTMLInputElement;
    const statusFilterValue = elem.getAttribute('value');
    window.location.assign(`/my-orders?status=${statusFilterValue}`);
  });
});

function setSelectedOrderFilterRadioBtn() {
  const queryParams = new URLSearchParams(window.location.search);
  const orderStatusFilter = queryParams.get('status') ?? 'pending';
  const elem = document.querySelector(
    `.order-status-filter[value="${orderStatusFilter}"]`,
  );
  elem?.setAttribute('checked', 'true');
}

setSelectedOrderFilterRadioBtn();
