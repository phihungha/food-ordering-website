document.querySelectorAll('.cart-item-delete-btn').forEach((e) => {
  e.addEventListener('click', async () => {
    const elem = e as HTMLButtonElement;
    await fetch(`/my-cart/${elem.dataset.productid}`, {
      method: 'DELETE',
    });
    window.location.reload();
  });
});
