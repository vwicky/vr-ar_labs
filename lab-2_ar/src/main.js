import './style.css'

document.getElementById('link-button-1').onclick = () => {
  console.log('> clicked - 1');
  window.location.href = './src/task-1/index-1.html'
}
document.getElementById('link-button-2').onclick = () => {
  console.log('> clicked - 2');
  window.location.href = './src/task-2/index-2.html'
}