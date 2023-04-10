document
  .querySelector('#order-cancel-btn')
  ?.addEventListener('click', async (event) => {
    const elem = event.target as HTMLButtonElement;
    await fetch(`/my-orders/${elem.dataset.orderid}`, {
      method: 'DELETE',
    });
    window.location.reload();
  });
