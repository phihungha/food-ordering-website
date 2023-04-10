document.querySelectorAll('#order-cancel-btn').forEach((e) => {
  e.addEventListener('click', async () => {
    const elem = e as HTMLButtonElement;
    await fetch(`/my-orders/${elem.dataset.orderid}`, {
      method: 'DELETE',
    });
    window.location.reload();
  });
});
