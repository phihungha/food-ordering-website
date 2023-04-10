document
  .querySelector('#product-search-box')!
  .addEventListener('keyup', async (e) => {
    const event = e as KeyboardEvent;
    if (event.key !== 'Enter') {
      return;
    }
    const elem = event.target as HTMLInputElement;
    if (elem.value) {
      window.location.assign(`/products?search=${elem.value}`);
    } else {
      window.location.assign(`/products`);
    }
  });
