let preveiwContainer = document.querySelector('.names-preview');
let previewBox = preveiwContainer.querySelectorAll('.preview');

document.querySelectorAll('.name-container .name').forEach(product =>{
  product.onclick = () =>{
    preveiwContainer.style.display = 'flex';
    let tname = product.getAttribute('tname');
    let hid = document.getElementById('hid');
    hid.value = tname;
    console.log(tname)
    let name = product.getAttribute('data-name');
    previewBox.forEach(preview =>{
      let target = preview.getAttribute('data-target');
      if(name == target){
        preview.classList.add('active');
      }
    });
  };
});

previewBox.forEach(close =>{
  close.querySelector('.fa-times').onclick = () =>{
    close.classList.remove('active');
    preveiwContainer.style.display = 'none';
  };
});