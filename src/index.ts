const btn = document.querySelector('.button');
const results = document.querySelector('.results');

btn.addEventListener('click', async (e: MouseEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append(
    'files',
    new File(
      [
        new Blob([new TextEncoder().encode('Lorem Ipsium')], {
          type: 'text/plain',
        }),
      ],
      'new-file.txt',
      { type: 'text/plain' }
    )
  );

  const res = await fetch('/cool-profile', {
    method: 'POST',
    body: formData,
  });
  const result = await res.json();
  results.textContent = JSON.stringify(result);
});
