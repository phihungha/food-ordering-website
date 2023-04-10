document
  .querySelector('#product-search-box')!
  .addEventListener('keyup', async (e) => {
    const event = e as KeyboardEvent;
    if (event.key !== 'Enter') {
      return;
    }
    const elem = event.target as HTMLInputElement;
    window.location.assign(`/products?search=${elem.value}`);
  });
