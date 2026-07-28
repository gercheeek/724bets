/**
 * Akıcı bakiye artışı için requestAnimationFrame tabanlı animasyon fonksiyonu
 * @param startVal Başlangıç değeri
 * @param endVal Bitiş değeri
 * @param duration Milisaniye cinsinden süre (varsayılan: 1500)
 * @param onUpdate Değer değiştikçe çağrılacak callback
 * @param onComplete Animasyon bittiğinde çağrılacak opsiyonel callback
 */
export const countUp = (
  startVal: number,
  endVal: number,
  duration: number = 1500,
  onUpdate: (val: number) => void,
  onComplete?: () => void
) => {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Easing function (easeOutQuart) for smoother stop
    const easeOut = 1 - Math.pow(1 - progress, 4);
    
    const currentVal = startVal + (endVal - startVal) * easeOut;
    onUpdate(currentVal);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      if (onComplete) onComplete();
    }
  };
  
  window.requestAnimationFrame(step);
};
