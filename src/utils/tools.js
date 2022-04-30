import { message } from 'antd';

export function copy(text = '') {
  let input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.top = '-10000px';
  input.style.zIndex = '-999';
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  try {
    let result = document.execCommand('copy');
    document.body.removeChild(input);
    if (!result || result === 'unsuccessful') {
      message.error('复制失败，请手动复制链接!', 3);
    } else {
      message.success('复制成功,快分享给你的小伙伴吧!', 3);
    }
  } catch (e) {
    document.body.removeChild(input);
    alert('当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作');
  }
}
